
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
                text: `Analyze this clothing item image and provide detailed information in JSON format. Be very specific and accurate in your analysis.

IMPORTANT: For T-shirts specifically, pay special attention to these attributes:
- subcategory: Choose from ["TShirt", "TankTop", "LongSleeve", "Henley"] for T-shirt types
- neckline: Choose from ["CrewNeck", "VNeck", "Henley", "Polo"] 
- design_details: Choose from ["LogoPrint", "Embroidered", "ChestPrint", "BackPrint", "NoDesign", "GraphicPrint", "TextPrint", "AllOverPrint"]
- fit: Choose from ["Slim", "Regular", "Relaxed", "Oversize"]
- sleeve: Use "Short", "Long", or "Sleeveless"
- material: For T-shirts, commonly ["Cotton", "Polyester", "Modal", "Linen", "Elastane"]
- pattern: Choose from ["Solid", "Printed", "Striped", "Graphic", "None"]
- seasons: For T-shirts, typically ["Spring", "Summer", "Autumn"]
- occasions: For T-shirts, commonly ["Casual", "Sport", "Outdoor", "Home", "Travel"]

Return a JSON object with these exact fields:
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
}

Be thorough and accurate in your analysis.`
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
        max_tokens: 1000
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
