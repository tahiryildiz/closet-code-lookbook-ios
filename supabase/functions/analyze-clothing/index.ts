
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
            content: `Sen bir moda uzmanısın ve kıyafet analizi yapıyorsun. Görüntüyü dikkatli bir şekilde analiz et ve aşağıdaki JSON formatında yanıt ver:

{
  "name": "Ürün adı (örn: Lacivert Slim Fit Blazer)",
  "category": "Kategori (şunlardan biri: Ceketler, Gömlekler, Tişörtler, Kazaklar, Elbiseler, Pantolonlar, Etekler, Üstler, Altlar)",
  "primaryColor": "Ana renk (Türkçe: Lacivert, Siyah, Beyaz, Kırmızı, Yeşil, Mavi, Gri, Kahverengi, vb.)",
  "tags": ["stil", "etiketleri", "listesi"],
  "material": "Malzeme tahmini",
  "confidence": 85,
  "season": "Mevsim uygunluğu",
  "style": "Stil açıklaması"
}

ÖNEMLİ KURALLAR:
- Rengi çok dikkatli belirle (lacivert ≠ gri, beyaz ≠ krem)
- Ceketler için mutlaka "Ceketler" kategorisini kullan, "Üstler" değil
- Ürün adını açıklayıcı yap (Kıyafet değil, Lacivert Blazer Ceket gibi)
- Sadece JSON döndür, başka metin ekleme`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Bu kıyafet ürününü analiz et ve detaylı bilgilerini ver. Özellikle renk, kategori ve ürün adını çok dikkatli belirle.'
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
