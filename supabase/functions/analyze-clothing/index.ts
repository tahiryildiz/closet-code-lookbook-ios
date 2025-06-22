
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { imageUrl } = await req.json()
    
    if (!imageUrl) {
      throw new Error('Image URL is required')
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    console.log('Analyzing image:', imageUrl)

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are analyzing a clothing item image. Return a JSON object containing **all possible structured attributes** that can be extracted visually for use in a product database. 

Step 1: Identify the main category and subcategory of the clothing (e.g., category: "Tops", subcategory: "Shirt").

Step 2: Based on the identified type, include all relevant attributes below. If a field does not apply to this item, mark it as "Not Applicable". If it is not visible or unclear, mark it as "Unknown".

Return all attributes even if some are Unknown.

Your JSON must include:

- name: "Detailed product name (e.g., Green Cargo Pants, Blue Denim Jacket)"
- brand: "DETECT BRAND CAREFULLY - look at logos and labels (Lacoste, Nike, Adidas, Zara, H&M, etc.)"
- category: "Main category - ONLY choose from: Tops, Bottoms, Outerwear, Dresses & Suits, Footwear, Accessories, Bags, Underwear & Loungewear, Swimwear, Activewear"
- subcategory: "Sub category based on the item type"
- fit: "Fit type (e.g., Regular Fit, Oversized, Slim Fit, Relaxed Fit)"
- material: "Material estimate (e.g., Cotton, Denim, Polyester, Wool)"
- primary_color: "Primary color in English (Navy, Black, White, Red, Green, Blue, Gray, Brown, etc.)"
- secondary_colors: "Array of secondary colors if any"
- color_tone: "Color tone (e.g., Dark, Neutral, Light, Bright)"
- pattern: "Pattern type (e.g., Solid, Striped, Checkered, Polka Dot)"
- pattern_type: "Pattern detail (e.g., Thin Striped, Large Checkered - null if solid)"
- season_suitability: "Array of suitable seasons (e.g., [Spring, Summer])"
- occasions: "Array of occasions (e.g., [Casual, Workwear])"
- collar: "Collar type (e.g., Polo, Stand, Crew, V-Neck - Not Applicable if none)"
- sleeve: "Sleeve length (e.g., Short Sleeve, Long Sleeve, Sleeveless)"
- closure_type: "Closure type (e.g., Zipper, Buttons, Drawstring, None)"
- waist_style: "Waist style (e.g., Elastic Waist, Drawstring, Fixed Waist - Not Applicable if none)"
- pocket_style: "Pocket style (e.g., Side Pockets, Cargo, No Pockets)"
- hem_style: "Hem style (e.g., Regular, Elastic Cuff, Drawstring Hem)"
- neckline: "Neckline for tops/dresses (e.g., V-Neck, Round, Square - Not Applicable if none)"
- lapel_style: "Lapel style for jackets (e.g., Notch, Shawl - Not Applicable if none)"
- has_lining: "true/false"
- button_count: "Number of buttons or Unknown"
- accessories: "Array of accessories (e.g., [Belt, Drawstring, Hood])"
- image_description: "Natural language description of the item"
- style_tags: "Array of style descriptors (e.g., [casual, elegant, minimalist])"
- confidence: "Confidence score 0-100"

CRITICAL RULES:
1. BRAND DETECTION: Look very carefully for brand logos, labels, and markings
2. ALL VALUES MUST BE IN ENGLISH
3. Include ALL fields even if marked as "Unknown" or "Not Applicable"
4. Be specific with colors and include them in the product name
5. Pattern: if solid use "Solid", if patterned specify the pattern type
6. Return only valid JSON, no additional text

Example response structure:
{
  "name": "Green Cargo Pants",
  "brand": "Unknown",
  "category": "Bottoms",
  "subcategory": "Cargo Pants",
  "fit": "Regular Fit",
  "material": "Cotton",
  "primary_color": "Green",
  "secondary_colors": [],
  "color_tone": "Medium",
  "pattern": "Solid",
  "pattern_type": null,
  "season_suitability": ["Spring", "Summer", "Autumn"],
  "occasions": ["Casual", "Outdoor"],
  "collar": "Not Applicable",
  "sleeve": "Not Applicable",
  "closure_type": "Zipper",
  "waist_style": "Elastic Waist",
  "pocket_style": "Cargo",
  "hem_style": "Regular",
  "neckline": "Not Applicable",
  "lapel_style": "Not Applicable",
  "has_lining": false,
  "button_count": "Unknown",
  "accessories": ["Belt Loops"],
  "image_description": "Green cargo pants with multiple pockets",
  "style_tags": ["casual", "utilitarian", "outdoor"],
  "confidence": 85
}`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this clothing item in detail. IMPORTANT: Look carefully for brand logos and markings. Include color in the product name. Fill ALL fields even if some are Unknown or Not Applicable. ALL RESPONSES MUST BE IN ENGLISH.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        max_tokens: 1500,
        temperature: 0.1
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('OpenAI API error:', errorData)
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`)
    }

    const data = await response.json()
    console.log('OpenAI response:', data)

    const content = data.choices[0].message.content
    console.log('Analysis result:', content)

    // Parse the JSON response
    let analysisResult
    try {
      // Clean the content in case it has markdown formatting
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      analysisResult = JSON.parse(cleanContent)
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', content)
      
      // Try to extract JSON from the response if it's wrapped in markdown
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        try {
          analysisResult = JSON.parse(jsonMatch[0])
        } catch (secondParseError) {
          throw new Error('Invalid response format from AI')
        }
      } else {
        throw new Error('Invalid response format from AI')
      }
    }

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in analyze-clothing function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        fallback: {
          name: 'Clothing Item',
          brand: 'Unknown',
          category: 'Tops',
          subcategory: 'T-Shirt',
          primary_color: 'Unknown',
          secondary_colors: [],
          color_tone: 'Medium',
          pattern: 'Solid',
          pattern_type: null,
          material: 'Cotton Blend',
          fit: 'Regular Fit',
          collar: 'Crew Neck',
          sleeve: 'Long Sleeve',
          closure_type: 'None',
          waist_style: 'Not Applicable',
          pocket_style: 'No Pockets',
          hem_style: 'Regular',
          neckline: 'Not Applicable',
          lapel_style: 'Not Applicable',
          has_lining: false,
          button_count: 'Unknown',
          accessories: [],
          season_suitability: ['All Seasons'],
          occasions: ['Casual'],
          image_description: 'Automatic analysis failed',
          style_tags: ['general'],
          confidence: 30
        }
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
