
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

    // Enhanced wardrobe description using rich metadata
    const wardrobeDescription = wardrobeItems.map((item: any) => {
      const description = item.prompt_description || 
        `${item.primary_color || 'colorless'} ${item.fit || ''} ${item.material || ''} ${item.name}`.trim();
      return `${description} (${item.category}${item.brand ? `, ${item.brand}` : ''})`;
    }).join(', ');

    console.log('Enhanced wardrobe description:', wardrobeDescription);

    const prompt = `You are KombinAI's styling assistant. Generate outfit recommendations using only items from the user's digital wardrobe.

AVAILABLE WARDROBE ITEMS:
${wardrobeDescription}

CONDITIONS:
- Occasion: ${occasion}
- Time of day: ${timeOfDay}  
- Weather: ${weather}

CORE FUNCTION:
- Combine wardrobe items into complete outfits
- Provide 3 different outfit options (no more than 3)
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

    console.log('Sending request to OpenAI with enhanced KombinAI prompt...');

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

      // Enhanced item description creator with rich fallback logic
      const createEnhancedItemDescription = (itemName: string, wardrobeItem: any) => {
        // Use prompt_description if available, otherwise construct rich description from metadata
        if (wardrobeItem?.prompt_description) {
          return wardrobeItem.prompt_description;
        }
        
        const color = wardrobeItem?.primary_color || wardrobeItem?.color || '';
        const fit = wardrobeItem?.fit || '';
        const material = wardrobeItem?.material || '';
        const collar = wardrobeItem?.collar || '';
        const sleeve = wardrobeItem?.sleeve || '';
        const pattern = wardrobeItem?.pattern || 'solid';
        const category = wardrobeItem?.category || '';
        
        // Map Turkish categories to detailed English descriptors
        const categoryMap: { [key: string]: string } = {
          'Tişörtler': 't-shirt',
          'Gömlek': 'button-up shirt', 
          'Pantolonlar': 'trousers',
          'Ceket': 'blazer',
          'Kazak': 'sweater',
          'Etek': 'skirt',
          'Şort': 'shorts',
          'Mont': 'jacket',
          'Hırka': 'cardigan'
        };

        const englishType = categoryMap[category] || category.toLowerCase();
        
        // Create rich, realistic descriptions with proper garment terminology
        const parts = [];
        if (color) parts.push(color);
        if (fit) parts.push(`${fit}-fit`);
        if (material) parts.push(material);
        if (pattern && pattern !== 'solid') parts.push(pattern);
        parts.push(englishType);
        if (collar) parts.push(`with ${collar}`);
        if (sleeve) parts.push(`${sleeve}s`);
        
        return parts.join(' ');
      };

      // Generate outfit images with bulletproof anti-hallucination prompts
      const processedOutfits = await Promise.all(parsedOutfits.outfits.slice(0, 3).map(async (outfit: any, index: number) => {
        const itemIds = outfit.items.map((itemName: string) => {
          const foundItem = wardrobeItems.find((item: any) => 
            item.name.toLowerCase().trim() === itemName.toLowerCase().trim() ||
            item.name.toLowerCase().includes(itemName.toLowerCase()) ||
            itemName.toLowerCase().includes(item.name.toLowerCase())
          );
          return foundItem ? foundItem.id : null;
        }).filter(Boolean);
        
        // Create enhanced descriptions for each selected item with rich fallback
        const enhancedItemDescriptions = outfit.items.map((itemName: string) => {
          const wardrobeItem = wardrobeItems.find((item: any) => 
            item.name.toLowerCase().trim() === itemName.toLowerCase().trim() ||
            item.name.toLowerCase().includes(itemName.toLowerCase()) ||
            itemName.toLowerCase().includes(item.name.toLowerCase())
          );
          return createEnhancedItemDescription(itemName, wardrobeItem);
        });

        // Create bulletproof anti-hallucination prompt with single image constraint
        const imagePrompt = `Professional flat lay fashion photography of a complete men's outfit on a clean light beige background.

Generate only one image, no variations.

The outfit includes EXACTLY these ${enhancedItemDescriptions.length} items and NO OTHER ITEMS:
${enhancedItemDescriptions.map((item, i) => `${i + 1}. ${item}`).join('\n')}

BULLETPROOF CONSTRAINTS:
- Generate ONLY ONE SINGLE IMAGE (no variations or alternatives)
- Use ONLY the ${enhancedItemDescriptions.length} items listed above
- Do NOT add any extra clothing items, garments, or pieces
- Do NOT change the colors, materials, or fits of any items
- Do NOT include shoes, belts, or accessories unless explicitly listed above
- Do NOT include mannequins, models, hangers, or human figures
- Do NOT add any styling props, backgrounds items, or decorative elements
- Arrange items exactly as they would be worn by a person
- Use square composition (1024x1024)
- Professional catalog-style flat lay photography

LIGHTING & STYLE:
- Bright studio lighting with soft, even shadows
- Clean, minimal, catalog-quality presentation
- Neutral light beige background only

CRITICAL: Stay 100% faithful to the provided wardrobe items. Generate exactly one image with only the listed items. Do not hallucinate, add, or modify anything.`;
        
        console.log(`Generating bulletproof single image ${index + 1}:`, imagePrompt);
        
        let generatedImageUrl = null;
        
        try {
          const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openAIApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'dall-e-3',
              prompt: imagePrompt,
              n: 1,
              size: '1024x1024',
              quality: 'hd',
              style: 'natural'
            }),
          });

          if (imageResponse.ok) {
            const imageData = await imageResponse.json();
            console.log('Image generation response status: success');
            
            if (imageData.data && imageData.data[0] && imageData.data[0].url) {
              generatedImageUrl = imageData.data[0].url;
              console.log(`Generated bulletproof image for outfit ${index + 1}: success`);
            }
          } else {
            const errorText = await imageResponse.text();
            console.error(`Failed to generate image for outfit ${index + 1}:`, errorText);
          }
        } catch (imageError) {
          console.error(`Error generating image for outfit ${index + 1}:`, imageError);
        }
        
        return {
          ...outfit,
          item_ids: itemIds,
          images: generatedImageUrl ? [generatedImageUrl] : ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop'],
          occasion: occasion,
          generated_image: generatedImageUrl
        };
      }));

      console.log('Processed bulletproof outfits count:', processedOutfits.length);
      console.log('KombinAI bulletproof generation successful!');
      
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
      
      // Enhanced fallback with rich descriptions
      const shuffleArray = (array: any[]) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
      };

      const createRichFallbackDescription = (item: any) => {
        // Create rich descriptions even in fallback mode
        if (item.prompt_description) {
          return item.prompt_description;
        }
        
        const parts = [];
        if (item.primary_color) parts.push(item.primary_color);
        if (item.fit) parts.push(`${item.fit}-fit`);
        if (item.material) parts.push(item.material);
        if (item.pattern && item.pattern !== 'solid') parts.push(item.pattern);
        
        // Add detailed category descriptions
        const categoryDescriptions: { [key: string]: string } = {
          'Tişörtler': 'crewneck t-shirt',
          'Gömlek': 'button-up shirt with collar',
          'Pantolonlar': 'tailored trousers',
          'Ceket': 'structured blazer with lapels',
          'Kazak': 'knit sweater',
          'Etek': 'midi skirt',
          'Şort': 'casual shorts',
          'Mont': 'outerwear jacket',
          'Hırka': 'open-front cardigan'
        };
        
        const categoryDesc = categoryDescriptions[item.category] || item.category.toLowerCase();
        parts.push(categoryDesc);
        
        if (item.collar) parts.push(`with ${item.collar}`);
        if (item.sleeve) parts.push(`${item.sleeve}s`);
        
        return parts.join(' ');
      };

      const createOutfitCombination = (items: any[], index: number) => {
        // Try to create logical outfit combinations with rich descriptions
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
          styling_tips: `Bu kombinasyon ${selectedItems.map(item => createRichFallbackDescription(item)).join(', ')} ürünlerinden oluşturuldu`,
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
