
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
                text: `CRITICAL: You are analyzing clothing images with EXTREME PRECISION. Your accuracy directly impacts user experience.

CLOTHING TYPE IDENTIFICATION RULES:
1. JACKET vs T-SHIRT: Look for these SPECIFIC features:
   - JACKET: Has collar, lapels, front opening (zipper/buttons), structured shoulders, thicker material, layering piece
   - T-SHIRT: No collar (crew/v-neck only), pullover style, thin material, basic cut, casual wear
   - BLAZER: Formal jacket with lapels, button closure, structured fit
   - CARDIGAN: Knitted, button/zip front, often casual

2. COLOR ANALYSIS - Look at the ACTUAL dominant color:
   - PRIMARY COLOR: The most prominent color covering 50%+ of the garment
   - SECONDARY COLORS: Any accent colors, patterns, or trim colors
   - IGNORE lighting effects - focus on the actual fabric color
   - Common colors: Navy Blue, Black, White, Grey, Brown, Beige, Red, Green, etc.

3. MATERIAL DETECTION - Examine texture and appearance:
   - DENIM: Woven cotton with characteristic texture
   - WOOL: Smooth or textured, often for formal wear
   - COTTON: Soft appearance, casual items
   - POLYESTER: Smooth, often shiny finish
   - LINEN: Loose weave, natural texture

4. BRAND DETECTION - Look VERY carefully for:
   - Chest logos (Nike swoosh, Adidas stripes, Lacoste crocodile)
   - Label text or embroidery
   - Distinctive design elements
   - Check collar, sleeves, and chest areas thoroughly

FIELD REQUIREMENTS - Fill every field accurately:

**Basic Info:**
- name: Descriptive Turkish name (e.g., "Lacivert Denim Ceket", "Beyaz Polo Yaka Tişört")
- brand: DETECTED BRAND or "Bilinmiyor" (look carefully for logos/labels)
- category: "Tops", "Bottoms", "Outerwear", "Dresses & Suits", "Footwear", "Accessories"
- subcategory: SPECIFIC type - "Blazer", "Denim Jacket", "Bomber Jacket", "TShirt", "Polo", etc.

**Colors & Patterns:**
- primary_color: EXACT main color in English ("Navy Blue", "Black", "White", etc.)
- secondary_colors: Array of additional colors if present
- color_tone: "Light", "Medium", or "Dark" based on color intensity
- pattern: "Solid", "Striped", "Printed", "Graphic", "Checkered"

**Physical Details:**
- material: Primary fabric ("Denim", "Cotton", "Wool", "Polyester", "Linen")
- fit: "Slim", "Regular", "Relaxed", "Oversize"
- sleeve: "Long Sleeve", "Short Sleeve", "Sleeveless"
- collar: "No Collar", "Crew Neck", "V Neck", "Button Down", "Spread Collar"
- closure_type: "Pullover", "Button-Up", "Zip", "Snap"

**Construction:**
- design_details: ["Logo Print", "Embroidered", "Plain", "Graphic Print", etc.]
- pocket_style: "No Pockets", "Chest Pocket", "Side Pockets", "Patch Pockets"
- hem_style: "Straight", "Curved", "Raw Edge"

**Usage:**
- season_suitability: ["Spring", "Summer", "Autumn", "Winter"] based on material/style
- occasions: ["Casual", "Formal", "Sport", "Business", "Evening"] based on style
- style_tags: ["Classic", "Modern", "Vintage", "Sporty", "Formal"]

**Analysis:**
- image_description: Detailed description of the garment's appearance
- confidence: 1-100 (be honest about uncertainty)

CRITICAL REMINDERS:
- NAVY BLUE jackets are NOT t-shirts - check the garment structure carefully
- Look at the actual color, not lighting effects
- A jacket has structure, collar, and opening - very different from a t-shirt
- Brand detection is crucial - examine logos thoroughly

Return ONLY valid JSON in this format:
{
  "name": "Turkish name with color and type",
  "brand": "detected brand or Bilinmiyor",
  "category": "category",
  "subcategory": "specific type",
  "primary_color": "exact color in English",
  "secondary_colors": ["array of colors"],
  "color_tone": "Light|Medium|Dark",
  "pattern": "pattern type",
  "pattern_type": "specific pattern details or null",
  "material": "fabric type",
  "fit": "fit type",
  "collar": "collar style",
  "sleeve": "sleeve type",
  "neckline": "neckline style",
  "design_details": ["array of design elements"],
  "closure_type": "closure type",
  "waist_style": "waist style or null",
  "pocket_style": "pocket style",
  "hem_style": "hem style",
  "lapel_style": "lapel style or null",
  "has_lining": false,
  "button_count": "number or Unknown",
  "accessories": [],
  "season_suitability": ["seasons"],
  "occasions": ["occasions"],
  "image_description": "detailed description",
  "style_tags": ["style tags"],
  "confidence": 85
}`
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
        max_tokens: 1500,
        temperature: 0.1  // Lower temperature for more consistent analysis
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

    // Parse the JSON response with better error handling
    let analysisResult
    try {
      // Remove any potential markdown formatting
      const cleanContent = content.replace(/```json\s?|\s?```/g, '').trim()
      analysisResult = JSON.parse(cleanContent)
      
      // Validate critical fields
      if (!analysisResult.name || !analysisResult.category || !analysisResult.primary_color) {
        console.error('Missing critical fields in analysis result:', analysisResult)
        throw new Error('Incomplete analysis - missing critical fields')
      }
      
      console.log('Analysis completed successfully:', {
        name: analysisResult.name,
        category: analysisResult.category,
        subcategory: analysisResult.subcategory,
        color: analysisResult.primary_color,
        confidence: analysisResult.confidence
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
        details: 'Please try uploading the image again. If the problem persists, check the image quality and try a clearer photo.'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
