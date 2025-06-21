
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

    const prompt = `You are KombinAI's styling assistant. Generate outfit recommendations using only items from the user's digital wardrobe.

AVAILABLE WARDROBE ITEMS:
${wardrobeDescription}

CONDITIONS:
- Occasion: ${occasion}
- Time of day: ${timeOfDay}  
- Weather: ${weather}

CORE FUNCTION:
- Combine wardrobe items into complete outfits
- Provide 3-4 different outfit options
- Include brief styling tip for each outfit
- Consider weather appropriateness
- Match occasion formality level

OUTPUT REQUIREMENTS:
- List specific items from their wardrobe
- Create complete outfit combinations (2-4 items per outfit)
- Each outfit should work as a cohesive look

CONSTRAINTS:
- ONLY use items that exist in user's wardrobe (listed above)
- No external shopping recommendations
- Keep suggestions practical and wearable
- Consider basic color coordination
- Account for seasonal appropriateness

Return ONLY valid JSON in this exact format (no additional text):
{
  "outfits": [
    {
      "id": 1,
      "name": "Creative Turkish outfit name",
      "items": ["exact item name 1", "exact item name 2", "exact item name 3"],
      "confidence": 95,
      "styling_tips": "Brief Turkish styling tip"
    }
  ]
}`;

    console.log('Sending request to OpenAI with KombinAI prompt...');

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
            content: 'You are KombinAI, a professional styling assistant. You MUST respond ONLY with valid JSON. Never include any text outside the JSON structure. Always use exact item names from the wardrobe list provided.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1500,
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
    
    let generatedContent = data.choices[0].message.content;
    console.log('Generated content:', generatedContent);

    // Clean the response to ensure it's valid JSON
    generatedContent = generatedContent.trim();
    if (generatedContent.startsWith('```json')) {
      generatedContent = generatedContent.replace(/```json\n?/, '').replace(/\n?```$/, '');
    }
    if (generatedContent.startsWith('```')) {
      generatedContent = generatedContent.replace(/```\n?/, '').replace(/\n?```$/, '');
    }

    try {
      const parsedOutfits = JSON.parse(generatedContent);
      
      if (!parsedOutfits.outfits || parsedOutfits.outfits.length === 0) {
        throw new Error('No outfits generated');
      }

      // Process outfits to add item_ids and images
      const processedOutfits = parsedOutfits.outfits.map((outfit: any) => {
        const itemIds = outfit.items.map((itemName: string) => {
          const foundItem = wardrobeItems.find((item: any) => 
            item.name.toLowerCase().trim() === itemName.toLowerCase().trim() ||
            item.name.toLowerCase().includes(itemName.toLowerCase()) ||
            itemName.toLowerCase().includes(item.name.toLowerCase())
          );
          return foundItem ? foundItem.id : null;
        }).filter(Boolean);
        
        const itemImages = outfit.items.map((itemName: string) => {
          const foundItem = wardrobeItems.find((item: any) => 
            item.name.toLowerCase().trim() === itemName.toLowerCase().trim() ||
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
      console.log('KombinAI generation successful!');
      
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
      
      // Fallback: Create outfit combinations from actual wardrobe items
      const shuffleArray = (array: any[]) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
      };

      const createOutfitCombination = (items: any[], index: number) => {
        // Try to create logical outfit combinations
        const tops = items.filter(item => ['Tişörtler', 'Gömlek', 'Bluz', 'Kazak'].includes(item.category));
        const bottoms = items.filter(item => ['Pantolonlar', 'Etek', 'Şort'].includes(item.category));
        const outerwear = items.filter(item => ['Ceket', 'Hırka', 'Mont'].includes(item.category));
        
        let selectedItems = [];
        
        // Add a top if available
        if (tops.length > 0) {
          selectedItems.push(shuffleArray(tops)[0]);
        }
        
        // Add a bottom if available
        if (bottoms.length > 0) {
          selectedItems.push(shuffleArray(bottoms)[0]);
        }
        
        // Add outerwear if available and weather suggests it
        if (outerwear.length > 0 && (weather === 'cool' || weather === 'cold' || weather === 'rainy')) {
          selectedItems.push(shuffleArray(outerwear)[0]);
        }
        
        // If we don't have enough items, just pick randomly
        if (selectedItems.length < 2) {
          selectedItems = shuffleArray(items).slice(0, Math.min(3, items.length));
        }
        
        return {
          id: index + 1,
          name: `Kombin ${index + 1}`,
          items: selectedItems.map((item: any) => item.name),
          item_ids: selectedItems.map((item: any) => item.id),
          confidence: Math.floor(Math.random() * 20) + 80,
          styling_tips: "Bu kombinasyon gardırobunuzdaki ürünlerden oluşturuldu",
          images: selectedItems.map((item: any) => item.image_url).filter(Boolean),
          occasion: occasion
        };
      };

      const fallbackOutfits = [
        createOutfitCombination(wardrobeItems, 0),
        createOutfitCombination(wardrobeItems, 1),
        createOutfitCombination(wardrobeItems, 2)
      ];

      return new Response(JSON.stringify({
        outfits: fallbackOutfits,
        warning: 'AI servisi geçici olarak kullanılamadı, gardırobunuzdaki ürünlerden mantıklı kombinler oluşturuldu.'
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
