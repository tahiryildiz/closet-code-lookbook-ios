
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { occasion, timeOfDay, weather, wardrobeItems } = await req.json();

    console.log('Received request:', { occasion, timeOfDay, weather, wardrobeCount: wardrobeItems?.length });

    if (!occasion || !timeOfDay || !weather) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!wardrobeItems || wardrobeItems.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No wardrobe items provided' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const wardrobeDescription = wardrobeItems.map((item: any) => 
      `${item.name} (${item.category}, ${item.color || 'renk belirtilmemiş'}${item.brand ? `, ${item.brand}` : ''})`
    ).join(', ');

    console.log('Wardrobe description:', wardrobeDescription);

    const prompt = `Kullanıcının gardırobundaki şu ürünlerden 3 farklı kombin önerisi oluştur:
${wardrobeDescription}

Kriterler:
- Durum: ${occasion}
- Zaman: ${timeOfDay}
- Hava durumu: ${weather}

ÖNEMLİ: Sadece yukarıda listelenen ürünleri kullan. Her kombin için:
1. Türkçe yaratıcı bir isim ver
2. Kombinde yer alan 2-4 ürünü listele (sadece yukarıdaki listeden)
3. Uyum skoru (80-100 arası)
4. Türkçe kısa stil ipucu
5. Her kombin için görsel bir açıklama (bu ürünlerle nasıl görüneceği)

JSON formatında şu yapıda döndür:
{
  "outfits": [
    {
      "id": 1,
      "name": "Kombin ismi",
      "items": ["ürün1", "ürün2", "ürün3"],
      "item_ids": ["id1", "id2", "id3"],
      "confidence": 95,
      "styling_tips": "Türkçe stil ipucu",
      "visual_description": "Bu kombinle nasıl görüneceğinin açıklaması"
    }
  ]
}`;

    console.log('Sending request to OpenAI...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'Sen profesyonel bir moda stilistisin. Sadece geçerli JSON formatında yanıt ver, başka bir metin ekleme. Kullanıcının sahip olduğu ürünlerden gerçekçi kombinler oluştur.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    console.log('OpenAI response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('OpenAI response received, processing...');
    
    const generatedContent = data.choices[0].message.content;
    console.log('Generated content:', generatedContent);

    try {
      const parsedOutfits = JSON.parse(generatedContent);
      
      if (!parsedOutfits.outfits || parsedOutfits.outfits.length === 0) {
        throw new Error('No outfits generated');
      }

      // Add item_ids and images to outfits based on item names
      const processedOutfits = parsedOutfits.outfits.map((outfit: any) => {
        const itemIds = outfit.items.map((itemName: string) => {
          const foundItem = wardrobeItems.find((item: any) => 
            item.name.toLowerCase().includes(itemName.toLowerCase()) ||
            itemName.toLowerCase().includes(item.name.toLowerCase())
          );
          return foundItem ? foundItem.id : null;
        }).filter(Boolean);
        
        const itemImages = outfit.items.map((itemName: string) => {
          const foundItem = wardrobeItems.find((item: any) => 
            item.name.toLowerCase().includes(itemName.toLowerCase()) ||
            itemName.toLowerCase().includes(item.name.toLowerCase())
          );
          return foundItem?.image_url || null;
        }).filter(Boolean);
        
        return {
          ...outfit,
          item_ids: itemIds,
          images: itemImages.length > 0 ? itemImages : ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop'],
          occasion: occasion
        };
      });

      console.log('Processed outfits count:', processedOutfits.length);
      
      // If only one outfit was generated, show notification
      if (processedOutfits.length === 1) {
        return new Response(JSON.stringify({
          outfits: processedOutfits,
          warning: 'Sadece 1 kombin oluşturulabildi. Daha fazla ürün ekleyerek daha çok seçenek elde edebilirsiniz.'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      return new Response(JSON.stringify({ outfits: processedOutfits }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      console.error('Raw response:', generatedContent);
      
      // Fallback response using actual wardrobe items
      const shuffleArray = (array: any[]) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
      };

      const createFallbackOutfit = (items: any[], index: number) => {
        const selectedItems = shuffleArray(items).slice(0, Math.min(3, items.length));
        return {
          id: index + 1,
          name: `Stil Önerisi ${index + 1}`,
          items: selectedItems.map((item: any) => item.name),
          item_ids: selectedItems.map((item: any) => item.id),
          confidence: Math.floor(Math.random() * 20) + 80,
          styling_tips: "Bu kombinasyon gardırobunuzdaki ürünlerden oluşturuldu",
          images: selectedItems.map((item: any) => item.image_url).filter(Boolean),
          occasion: occasion
        };
      };

      const fallbackOutfits = [
        createFallbackOutfit(wardrobeItems, 0),
        createFallbackOutfit(wardrobeItems, 1),
        createFallbackOutfit(wardrobeItems, 2)
      ];

      return new Response(JSON.stringify({
        outfits: fallbackOutfits,
        warning: 'AI servisinde sorun oluştu, gardırobunuzdaki ürünlerden rastgele kombinler oluşturuldu.'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error in generate-outfits function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
