
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
            content: `Sen bir moda uzmanısın ve kıyafet analizi yapıyorsun. Görüntüyü çok dikkatli bir şekilde analiz et ve aşağıdaki JSON formatında DETAYLI yanıt ver:

{
  "name": "Detaylı ürün adı (örn: Lacivert Slim Fit Blazer Ceket)",
  "category": "Ana kategori - SADECE bu kategorilerden birini seç: Tops, Bottoms, Outerwear, Dresses & Suits, Footwear, Accessories, Bags, Underwear & Loungewear, Swimwear, Activewear",
  "subcategory": "Alt kategori - kategori bazında uygun olanı seç:",
  "primaryColor": "Ana renk (Türkçe: Lacivert, Siyah, Beyaz, Kırmızı, Yeşil, Mavi, Gri, Kahverengi, vb.)",
  "secondaryColors": ["ikincil", "renkler", "listesi"],
  "colorTone": "Renk tonu (Açık, Koyu, Orta, Pastel, Canlı)",
  "pattern": "Desen tipi (Düz, Çizgili, Kareli, Puantiyeli, Çiçekli, Geometrik, vb.)",
  "patternType": "Desen detayı (İnce çizgili, Kalın kareli, Küçük puantiyeli, vb.)",
  "material": "Malzeme tahmini (Pamuk, Polyester, Yün, Denim, Keten, Pamuk-Polyester karışımı, vb.)",
  "fit": "Kesim (Slim Fit, Regular Fit, Oversize, Skinny, Straight, Wide Leg, vb.)",
  "collar": "Yaka tipi (V-Yaka, Bisiklet Yaka, Polo Yaka, Gömlek Yaka, Kapüşon, Notch Lapel, vb.)",
  "sleeve": "Kol tipi (Uzun Kol, Kısa Kol, Kolsuz, 3/4 Kol, vb.)",
  "button_count": 2,
  "has_lining": true,
  "closure": "Kapatma türü (Düğmeli, Fermuarlı, Çıtçıtlı, Bağcıklı, vb.)",
  "lapel_style": "Yaka stili (Notched, Peak, Shawl, vb. - sadece ceket/blazer için)",
  "structure": "Yapı (Structured, Semi-structured, Unstructured)",
  "formality_level": "Formalite seviyesi (Casual, Smart Casual, Business Casual, Formal, Black Tie)",
  "seasons": ["uygun", "mevsimler"],
  "occasions": ["uygun", "durumlar"],
  "tags": ["detaylı", "stil", "etiketleri"],
  "contextTags": ["kullanım", "durumu", "etiketleri"],
  "confidence": 85,
  "style": "Detaylı stil açıklaması"
}

KATEGORİ VE ALT KATEGORİ LISTESI:
- Tops: T-Shirt, Polo Shirt, Shirt, Blouse, Sweatshirt, Hoodie, Tank Top, Crop Top, Tunic, Bodysuit, Bustier, Kimono
- Bottoms: Jeans, Trousers, Shorts, Joggers, Skirt, Culottes, Leggings, Cargo Pants
- Outerwear: Blazer, Coat, Jacket, Trench Coat, Parka, Overcoat, Cardigan, Gilet
- Dresses & Suits: Mini Dress, Midi Dress, Maxi Dress, Evening Gown, Cocktail Dress, Jumpsuit, Romper, Suit, Abaya
- Footwear: Sneakers, Loafers, Boots, Heels, Flats, Sandals, Slippers, Espadrilles, Oxford Shoes
- Accessories: Belt, Watch, Sunglasses, Scarf, Hat, Beanie, Gloves, Tie, Bowtie, Necklace, Earrings
- Bags: Backpack, Crossbody Bag, Shoulder Bag, Clutch, Tote, Briefcase, Wallet
- Underwear & Loungewear: Bra, Panties, Boxer, Pajamas, Camisole, Robe, Thermals
- Swimwear: Bikini, One-piece Swimsuit, Trunks, Swim Shorts, Swim Shirt
- Activewear: Sports Bra, Leggings, Tank Top, Tracksuit, Gym Shorts, Rash Guard

ÖNEMLİ KURALLAR:
- Category için SADECE yukarıdaki ana kategorilerden birini seç
- Subcategory için o kategoriye ait alt kategorilerden en uygun olanı seç
- Her alanı mümkün olduğunca detaylı doldur
- Renkleri çok dikkatli belirle (lacivert ≠ gri, beyaz ≠ krem)
- Fit/kesim bilgisini görsel ipuçlarından çıkar
- Yaka tipini net belirle
- Button_count sadece düğme varsa sayı ver, yoksa 0
- Has_lining astar var mı görsel ipuçlarından tahmin et
- Closure türünü net belirle
- Lapel_style sadece ceket/blazer için doldur
- Structure yapısal sertlik seviyesini belirle
- Formality_level kullanım durumuna göre belirle
- Mevsim uygunluğunu malzeme ve kalınlığa göre belirle
- Occasions için: Günlük, İş, Spor, Gece, Resmi, Tatil gibi durumları değerlendir
- Secondary colors için sadece belirgin ikincil renkleri listele
- Pattern için: eğer düz ise "Düz", desenli ise desen tipini belirt
- Context tags için: rahat, şık, spor, vintage, modern gibi etiketler ekle
- Sadece JSON döndür, başka metin ekleme`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Bu kıyafet ürününü çok detaylı analiz et. Özellikle kategori ve alt kategoriyi doğru belirle, renk, kesim, yaka, desen, düğme sayısı, astar durumu, kapatma türü, formalite seviyesi, mevsim uygunluğu ve kullanım durumlarını dikkatli belirle. Tüm alanları doldur.'
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
          category: 'Tops',
          subcategory: 'T-Shirt',
          primaryColor: 'Gri',
          secondaryColors: [],
          colorTone: 'Orta',
          pattern: 'Düz',
          patternType: 'Desenli değil',
          material: 'Pamuk karışımı',
          fit: 'Regular Fit',
          collar: 'Bisiklet Yaka',
          sleeve: 'Uzun Kol',
          button_count: 0,
          has_lining: false,
          closure: 'Pullover',
          lapel_style: null,
          structure: 'Unstructured',
          formality_level: 'Casual',
          seasons: ['Sonbahar', 'Kış'],
          occasions: ['Günlük'],
          tags: ['rahat', 'günlük'],
          contextTags: ['genel kullanım'],
          confidence: 50,
          style: 'Genel kullanım için uygun kıyafet'
        }
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
