
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
                text: `You are a professional fashion analyst and stylist. Analyze this clothing item image with extreme attention to detail and provide comprehensive metadata in JSON format.

CRITICAL INSTRUCTIONS:
1. AUTO-FILL ALL POSSIBLE FIELDS by analyzing the image thoroughly
2. STANDARDIZE ALL VALUES IN ENGLISH with proper capitalization (e.g., "Short Sleeve", "Crew Neck", "Slim Fit")
3. For arrays like style_tags, occasions, seasons - include multiple relevant values
4. Use your fashion expertise to infer details even if not perfectly visible
5. Be specific and accurate in your analysis

FIELD REQUIREMENTS:

**Basic Info:**
- name: Descriptive English name (e.g., "Navy Blue Cotton Crew Neck T-Shirt")
- brand: Detected brand or "Unknown"
- category: Main category in English
- subcategory: Specific subcategory - for T-shirts use: "TShirt", "TankTop", "LongSleeve", "Henley"

**Colors & Patterns:**
- primary_color: Main color in English
- secondary_colors: Array of additional colors
- color_tone: "Light", "Medium", or "Dark"
- pattern: "Solid", "Printed", "Striped", "Graphic", "None"
- pattern_type: Specific pattern details or null

**Physical Attributes:**
- material: Fabric type (e.g., "Cotton", "Polyester", "Modal", "Linen", "Elastane")
- fit: "Slim", "Regular", "Relaxed", "Oversize"
- sleeve: "Short Sleeve", "Long Sleeve", "Sleeveless"
- neckline: "Crew Neck", "V Neck", "Henley", "Polo"
- collar: Collar style or null
- design_details: Array from ["Logo Print", "Embroidered", "Chest Print", "Back Print", "No Design", "Graphic Print", "Text Print", "All Over Print"]

**Construction Details (AUTO-FILL):**
- closure_type: "Pullover", "Button-Up", "Zip", "Snap", etc. or null
- waist_style: "Straight", "Fitted", "Loose", "Elastic" or null
- pocket_style: "No Pockets", "Chest Pocket", "Side Pockets", etc. or null
- hem_style: "Straight", "Curved", "High-Low", "Raw Edge" or null
- lapel_style: Style if applicable or null
- has_lining: true/false
- button_count: Number or "Unknown"

**Style & Usage:**
- accessories: Array of any visible accessories
- season_suitability: Array from ["Spring", "Summer", "Autumn", "Winter"]
- occasions: Array from ["Casual", "Sport", "Outdoor", "Home", "Travel", "Office", "Evening", "Formal"]
- style_tags: Array of style descriptors (e.g., ["Modern", "Classic", "Sporty", "Minimalist"])

**AI Analysis:**
- image_description: Detailed description of the item and its styling
- confidence: 1-100 confidence score

IMPORTANT: 
- Fill every possible field based on image analysis and fashion knowledge
- Use consistent English terminology throughout
- Include multiple values for arrays when applicable
- Be thorough and professional in your analysis

Return ONLY valid JSON in this exact format:
{
  "name": "descriptive name in English",
  "brand": "detected brand or Unknown",
  "category": "main category",
  "subcategory": "specific subcategory",
  "primary_color": "main color",
  "secondary_colors": ["array", "of", "secondary", "colors"],
  "color_tone": "Light|Medium|Dark",
  "pattern": "pattern type",
  "pattern_type": "specific pattern details or null",
  "material": "fabric type",
  "fit": "fit type",
  "collar": "collar style or null",
  "sleeve": "sleeve type",
  "neckline": "neckline style",
  "design_details": ["array", "of", "design", "elements"],
  "closure_type": "closure type or null",
  "waist_style": "waist style or null",
  "pocket_style": "pocket style or null",
  "hem_style": "hem style or null",
  "lapel_style": "lapel style or null",
  "has_lining": false,
  "button_count": "number or Unknown",
  "accessories": ["array", "of", "accessories"],
  "season_suitability": ["array", "of", "seasons"],
  "occasions": ["array", "of", "occasions"],
  "image_description": "detailed description of the item",
  "style_tags": ["array", "of", "style", "tags"],
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
        max_tokens: 1500
      })
    })

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.statusText}`)
    }

    const openaiData = await openaiResponse.json()
    const content = openaiData.choices[0]?.message?.content

    if (!content) {
      throw new Error('No content received from OpenAI')
    }

    // Parse the JSON response
    let analysisResult
    try {
      analysisResult = JSON.parse(content)
    } catch (parseError) {
      // If JSON parsing fails, try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('Failed to parse JSON response from OpenAI')
      }
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
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
