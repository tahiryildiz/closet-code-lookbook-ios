
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
            content: `You are a fashion expert analyzing clothing items. Analyze the image VERY CAREFULLY and respond in the following JSON format with DETAILED information.

IMPORTANT: 
1. BRAND DETECTION: Carefully examine logos, labels, and markings. Look for Lacoste crocodile, Nike swoosh, Adidas three stripes, etc.
2. ALL VALUES MUST BE IN ENGLISH - this is critical for database consistency
3. Use only the specified category and subcategory values
4. Analyze colors, patterns, fit, and materials very carefully

{
  "name": "Detailed product name (e.g., Lacoste Polo Shirt, Nike Dri-Fit T-Shirt)",
  "brand": "DETECT BRAND CAREFULLY - look at logos and labels (Lacoste, Nike, Adidas, Zara, H&M, etc.)",
  "category": "Main category - ONLY choose from: Tops, Bottoms, Outerwear, Dresses & Suits, Footwear, Accessories, Bags, Underwear & Loungewear, Swimwear, Activewear",
  "subcategory": "Sub category - choose from the list below",
  "primaryColor": "Primary color in English (Navy, Black, White, Red, Green, Blue, Gray, Brown, Pink, Purple, Yellow, Orange, etc.)",
  "secondaryColors": ["secondary", "colors", "list"],
  "colorTone": "Color tone (Light, Dark, Medium, Pastel, Bright)",
  "pattern": "Pattern type (Solid, Striped, Checkered, Polka Dot, Floral, Geometric, Leopard, Zebra, etc.)",
  "patternType": "Pattern detail (Thin Striped, Thick Checkered, Small Polka Dot, etc. - null if solid)",
  "material": "Material estimate (Cotton, Polyester, Wool, Denim, Linen, Silk, Cotton-Polyester Blend, etc.)",
  "fit": "Fit type (Slim Fit, Regular Fit, Oversize, Skinny, Straight, Wide Leg, Relaxed Fit, etc.)",
  "collar": "Collar type (V-Neck, Crew Neck, Polo Collar, Shirt Collar, Hood, Notch Lapel, Peak Lapel, etc.)",
  "sleeve": "Sleeve type (Long Sleeve, Short Sleeve, Sleeveless, 3/4 Sleeve, 7/8 Sleeve, etc.)",
  "seasons": ["suitable", "seasons", "list"],
  "occasions": ["Casual", "Work", "Sport", "Evening", "Formal", "Holiday", "etc."],
  "tags": ["detailed", "style", "tags"],
  "contextTags": ["usage", "context", "tags"],
  "confidence": 85,
  "style": "Detailed style description"
}

SUBCATEGORY LIST:
Tops: T-Shirt, Polo Shirt, Shirt, Blouse, Sweatshirt, Hoodie, Tank Top, Crop Top, Tunic, Bodysuit, Bustier, Kimono
Bottoms: Jeans, Trousers, Shorts, Joggers, Skirt, Culottes, Leggings, Cargo Pants
Outerwear: Blazer, Coat, Jacket, Trench Coat, Parka, Overcoat, Cardigan, Gilet
Dresses & Suits: Mini Dress, Midi Dress, Maxi Dress, Evening Gown, Cocktail Dress, Jumpsuit, Romper, Suit, Abaya
Footwear: Sneakers, Loafers, Boots, Heels, Flats, Sandals, Slippers, Espadrilles, Oxford Shoes
Accessories: Belt, Watch, Sunglasses, Scarf, Hat, Beanie, Gloves, Tie, Bowtie, Necklace, Earrings
Bags: Backpack, Crossbody Bag, Shoulder Bag, Clutch, Tote, Briefcase, Wallet
Underwear & Loungewear: Bra, Panties, Boxer, Pajamas, Camisole, Robe, Thermals
Swimwear: Bikini, One-piece Swimsuit, Trunks, Swim Shorts, Swim Shirt
Activewear: Sports Bra, Leggings, Tank Top, Tracksuit, Gym Shorts, Rash Guard

CRITICAL RULES:
1. BRAND DETECTION: Look carefully for Lacoste crocodile, Nike swoosh, Adidas three stripes and other brand logos
2. Category: ONLY use the main categories listed above
3. Subcategory: Choose the most appropriate from the category's subcategories
4. Fill every field as detailed as possible
5. Colors must be carefully identified (navy ≠ black, white ≠ cream)
6. Pattern: if solid use "Solid", if patterned specify the pattern type
7. PatternType: only fill for patterned items, null for solid
8. Secondary colors: only list prominent secondary colors
9. Season suitability based on material and thickness
10. Occasions based on appropriate usage situations
11. Tags and contextTags for style and usage labels
12. ALL VALUES IN ENGLISH ONLY
13. Return only JSON, no additional text`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this clothing item in detail. IMPORTANT: Look carefully for brand logos, labels and markings. Detect Lacoste crocodile, Nike swoosh and other brand marks. Determine category and subcategory correctly, analyze color, fit, collar, pattern information carefully. ALL RESPONSES MUST BE IN ENGLISH.'
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
        max_tokens: 1000,
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
          brand: null,
          category: 'Tops',
          subcategory: 'T-Shirt',
          primaryColor: 'Unknown',
          secondaryColors: [],
          colorTone: 'Medium',
          pattern: 'Solid',
          patternType: null,
          material: 'Cotton Blend',
          fit: 'Regular Fit',
          collar: 'Crew Neck',
          sleeve: 'Long Sleeve',
          seasons: ['All Seasons'],
          occasions: ['Casual'],
          tags: ['general'],
          contextTags: ['casual'],
          confidence: 30,
          style: 'Automatic analysis failed'
        }
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
