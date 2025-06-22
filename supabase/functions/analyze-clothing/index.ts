
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
            content: `Sen bir moda uzmanısın ve kıyafet analizi yapıyorsun. Görüntüyü ÇOK DİKKATLİ bir şekilde analiz et ve aşağıdaki JSON formatında DETAYLI yanıt ver. 

ÖNEMLİ: Görüntüdeki MARKA logolarını, etiketlerini ve yazıları DİKKATLİCE incele. Lacoste timsahı, Nike swoosh, Adidas çizgileri gibi marka işaretlerini mutlaka tanı.

{
  "name": "Detaylı ürün adı (örn: Lacoste Polo T-Shirt, Nike Dri-Fit Tişört)",
  "brand": "MARKA ADINI DİKKATLE BELİRLE - logo ve etiketlere bak (Lacoste, Nike, Adidas, Zara, H&M, vb.)",
  "category": "Ana kategori - SADECE şunlardan birini seç: Tops, Bottoms, Outerwear, Dresses & Suits, Footwear, Accessories, Bags, Underwear & Loungewear, Swimwear, Activewear",
  "subcategory": "Alt kategori - aşağıdaki listeden seç",
  "primaryColor": "Ana renk (Türkçe: Lacivert, Siyah, Beyaz, Kırmızı, Yeşil, Mavi, Gri, Kahverengi, Pembe, Mor, Sarı, Turuncu, vb.)",
  "secondaryColors": ["ikincil", "renkler", "listesi"],
  "colorTone": "Renk tonu (Açık, Koyu, Orta, Pastel, Canlı)",
  "pattern": "Desen tipi (Düz, Çizgili, Kareli, Puantiyeli, Çiçekli, Geometrik, Leopar, Zebra, vb.)",
  "patternType": "Desen detayı (İnce çizgili, Kalın kareli, Küçük puantiyeli, vb. - düz ise null)",
  "material": "Malzeme tahmini (Pamuk, Polyester, Yün, Denim, Keten, İpek, Pamuk-Polyester karışımı, vb.)",
  "fit": "Kesim (Slim Fit, Regular Fit, Oversize, Skinny, Straight, Wide Leg, Relaxed Fit, vb.)",
  "collar": "Yaka tipi (V-Yaka, Bisiklet Yaka, Polo Yaka, Gömlek Yaka, Kapüşon, Notch Lapel, Peak Lapel, vb.)",
  "sleeve": "Kol tipi (Uzun Kol, Kısa Kol, Kolsuz, 3/4 Kol, 7/8 Kol, vb.)",
  "seasons": ["uygun", "mevsimler", "listesi"],
  "occasions": ["Günlük", "İş", "Spor", "Gece", "Resmi", "Tatil", "vb."],
  "tags": ["detaylı", "stil", "etiketleri"],
  "contextTags": ["kullanım", "durumu", "etiketleri"],
  "confidence": 85,
  "style": "Detaylı stil açıklaması"
}

ALT KATEGORİ LİSTESİ:
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

KRITIK KURALLAR:
1. MARKA TESPİTİ: Lacoste timsahı, Nike swoosh, Adidas üç çizgi gibi logo ve markaları DİKKATLİCE ara ve tanı
2. Kategori için SADECE yukarıdaki ana kategorilerden birini seç
3. Subcategory için o kategoriye ait alt kategorilerden en uygun olanı seç
4. Her alanı mümkün olduğunca DETAYLI doldur
5. Renkleri çok dikkatli belirle (lacivert ≠ siyah, beyaz ≠ krem)
6. Pattern: eğer düz ise "Düz", desenli ise desen tipini belirt
7. PatternType: sadece desenli ürünler için doldur, düz ise null
8. Secondary colors için sadece belirgin ikincil renkleri listele
9. Mevsim uygunluğunu malzeme ve kalınlığa göre belirle
10. Occasions için uygun kullanım durumları belirle
11. Tags ve contextTags için stil ve kullanım etiketleri ekle
12. Sadece JSON döndür, başka metin ekleme`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Bu kıyafet ürününü çok detaylı analiz et. ÖNEMLİ: Marka logolarını, etiketlerini ve yazıları dikkatli incele. Lacoste timsahı, Nike swoosh gibi marka işaretlerini mutlaka tanı. Kategori ve alt kategoriyi doğru belirle, renk, kesim, yaka, desen bilgilerini dikkatli belirle.'
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
          name: 'Kıyafet Ürünü',
          brand: null,
          category: 'Tops',
          subcategory: 'T-Shirt',
          primaryColor: 'Bilinmiyor',
          secondaryColors: [],
          colorTone: 'Orta',
          pattern: 'Düz',
          patternType: null,
          material: 'Pamuk karışımı',
          fit: 'Regular Fit',
          collar: 'Bisiklet Yaka',
          sleeve: 'Uzun Kol',
          seasons: ['Tüm Mevsimler'],
          occasions: ['Günlük'],
          tags: ['genel'],
          contextTags: ['günlük'],
          confidence: 30,
          style: 'Otomatik analiz başarısız oldu'
        }
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
