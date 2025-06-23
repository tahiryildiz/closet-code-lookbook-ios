
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { imageUrl } = await req.json()

    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: 'Image URL is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `You are an expert fashion analyst with extensive knowledge of clothing, accessories, and footwear. Analyze this image with EXTREME PRECISION and CONSERVATIVE CONFIDENCE.

CRITICAL ANALYSIS PRINCIPLES:
1. ONLY describe what you can CLEARLY see - avoid assumptions
2. If uncertain about any detail, mark it as "Unknown" or use lower confidence
3. Look at the ENTIRE garment structure, not just surface appearance
4. Consider the context and positioning of the item in the image
5. Be especially careful with similar-looking items (jacket vs shirt vs blazer)

STEP-BY-STEP ANALYSIS PROCESS:

STEP 1: ITEM IDENTIFICATION
- What is the PRIMARY clothing item in the image?
- Look for structural elements: collars, lapels, closures, fit, length
- Distinguish between: Jacket (structured, often has lapels/collar, outerwear), Shirt (lightweight, button-front or pullover), T-shirt (casual, pullover, short sleeves), Blazer (formal jacket), Cardigan (knitted, often open front)
- For bottoms: Jeans (denim), Trousers (formal pants), Shorts, Skirts, etc.
- For dresses: One-piece garments
- For accessories: Bags, belts, jewelry, scarves
- For footwear: Sneakers, boots, heels, sandals, etc.

STEP 2: COLOR ANALYSIS
- Primary color: The most dominant color (60%+ of garment)
- Secondary colors: Accent colors, patterns, trim (if clearly visible)
- Be specific: "Navy Blue" not just "Blue", "Burgundy" not just "Red"
- Common precise colors: Black, White, Navy Blue, Light Blue, Dark Blue, Grey, Charcoal, Beige, Cream, Brown, Tan, Red, Burgundy, Green, Olive, Pink, Purple, Yellow, Orange

STEP 3: MATERIAL ASSESSMENT
- Look for texture, shine, weave patterns
- Common materials: Cotton, Denim, Wool, Polyester, Linen, Leather, Silk, Cashmere, Knit, Canvas

STEP 4: CONSTRUCTION DETAILS
- Closure type: Buttons, zipper, pullover, wrap, etc.
- Collar style: Crew neck, V-neck, button-down, spread collar, no collar
- Sleeve type: Long sleeve, short sleeve, sleeveless, 3/4 sleeve
- Fit: Slim, regular, relaxed, oversized
- Specific construction features visible

STEP 5: BRAND DETECTION
- Carefully examine for logos, emblems, distinctive design elements
- Check chest area, sleeves, collar, buttons for brand markers
- Only specify brand if CLEARLY visible - don't guess

FIELD COMPLETION RULES:

**Basic Information:**
- name: Create Turkish name combining color + type (e.g., "Lacivert Denim Ceket", "Beyaz Polo Tişört")
- brand: Only if clearly visible logo/label, otherwise "Bilinmiyor"
- category: Choose from - "Tops", "Bottoms", "Outerwear", "Dresses & Suits", "Footwear", "Accessories"
- subcategory: Be specific - "Denim Jacket", "Blazer", "T-Shirt", "Polo Shirt", "Jeans", "Chinos", "Sneakers", etc.

**Visual Details:**
- primary_color: Most dominant color in English
- secondary_colors: Array of additional colors if clearly present
- color_tone: "Light", "Medium", "Dark" based on brightness
- pattern: "Solid", "Striped", "Checkered", "Printed", "Logo Print", "Graphic"

**Technical Specifications:**
- material: Primary fabric if identifiable
- fit: "Slim", "Regular", "Relaxed", "Oversized"
- collar: Specific collar type or "No Collar"
- sleeve: Sleeve length and style
- closure_type: How the garment closes
- design_details: Array of visible design elements

**Contextual Information:**
- season_suitability: Based on material and style
- occasions: Where this would typically be worn
- style_tags: Fashion style descriptors

**Quality Assessment:**
- confidence: 1-100 based on image clarity and your certainty
  * 90-100: Crystal clear image, definitive identification
  * 70-89: Good clarity, confident identification with minor uncertainties
  * 50-69: Adequate clarity, reasonable identification with some uncertainty
  * 30-49: Poor clarity or significant uncertainty
  * Below 30: Very unclear or heavily obscured

**Image Description:**
- Provide a detailed, objective description of what you observe

RESPONSE FORMAT - Return ONLY valid JSON:
{
  "name": "Turkish name with color and type",
  "brand": "Brand name or Bilinmiyor",
  "category": "Primary category",
  "subcategory": "Specific item type",
  "primary_color": "Dominant color",
  "secondary_colors": ["Additional colors if present"],
  "color_tone": "Light|Medium|Dark",
  "pattern": "Pattern type",
  "pattern_type": "Specific pattern details or null",
  "material": "Primary material",
  "fit": "Fit type",
  "collar": "Collar style",
  "sleeve": "Sleeve type",
  "neckline": "Neckline style",
  "design_details": ["Visible design elements"],
  "closure_type": "Closure method",
  "waist_style": "Waist style or null",
  "pocket_style": "Pocket style",
  "hem_style": "Hem style",
  "lapel_style": "Lapel style or null",
  "has_lining": false,
  "button_count": "Number or Unknown",
  "accessories": [],
  "season_suitability": ["Appropriate seasons"],
  "occasions": ["Suitable occasions"],
  "image_description": "Detailed objective description",
  "style_tags": ["Style descriptors"],
  "confidence": 85
}

REMEMBER: Your accuracy directly impacts user experience. Be conservative with confidence, precise with identification, and honest about uncertainties.`
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        max_tokens: 2000,
        temperature: 0.05  // Very low temperature for maximum consistency
      })
    })

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text()
      console.error('OpenAI API error:', openaiResponse.status, errorText)
      throw new Error(`OpenAI API error: ${openaiResponse.status} - ${errorText}`)
    }

    const openaiData = await openaiResponse.json()
    const content = openaiData.choices[0]?.message?.content

    if (!content) {
      throw new Error('No content received from OpenAI')
    }

    // Parse the JSON response with enhanced error handling
    let analysisResult
    try {
      // Clean the content and parse
      const cleanContent = content.replace(/```json\s?|\s?```/g, '').trim()
      analysisResult = JSON.parse(cleanContent)
      
      // Validate critical fields
      if (!analysisResult.name || !analysisResult.category || !analysisResult.primary_color) {
        console.error('Missing critical fields in analysis result:', analysisResult)
        throw new Error('Incomplete analysis - missing critical fields')
      }
      
      // Ensure confidence is within valid range
      if (analysisResult.confidence && (analysisResult.confidence < 1 || analysisResult.confidence > 100)) {
        console.warn('Invalid confidence score, setting to 50')
        analysisResult.confidence = 50
      }
      
      console.log('Analysis completed successfully:', {
        name: analysisResult.name,
        category: analysisResult.category,
        subcategory: analysisResult.subcategory,
        color: analysisResult.primary_color,
        confidence: analysisResult.confidence,
        material: analysisResult.material
      })
      
    } catch (parseError) {
      console.error('Failed to parse analysis result:', parseError)
      console.error('Raw content:', content)
      throw new Error('Failed to parse AI analysis result')
    }

    return new Response(
      JSON.stringify(analysisResult),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error analyzing clothing:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Analysis failed. Please ensure the image clearly shows a clothing item and try again with better lighting or angle.'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
