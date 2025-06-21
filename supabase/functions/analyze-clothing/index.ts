
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
            content: `You are a fashion expert analyzing clothing items. You must respond with a JSON object containing:
            - name: A descriptive name (e.g., "Lacivert Blazer Ceket", "Siyah Tişört")
            - category: One of these exact categories: "Ceketler", "Gömlekler", "Tişörtler", "Kazaklar", "Elbiseler", "Pantolonlar", "Etekler", "Üstler", "Altlar"
            - primaryColor: Color in Turkish (e.g., "Lacivert", "Siyah", "Beyaz", "Kırmızı", "Yeşil", "Mavi", "Gri", "Kahverengi")
            - tags: Array of relevant tags in Turkish
            - material: Material type in Turkish
            - confidence: Number between 0-100
            - season: Season suitability in Turkish
            - style: Style description in Turkish

            Be very accurate with colors and specific with categories. For jackets, use "Ceketler" not "Üstler".`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this clothing item and provide detailed information about it.'
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
        max_tokens: 500,
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
      analysisResult = JSON.parse(content)
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', content)
      throw new Error('Invalid response format from AI')
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
          name: 'Kıyafet',
          category: 'Üstler',
          primaryColor: 'Gri',
          tags: ['genel'],
          material: 'Bilinmiyor',
          confidence: 50,
          season: 'Tüm Mevsim',
          style: 'Genel'
        }
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
