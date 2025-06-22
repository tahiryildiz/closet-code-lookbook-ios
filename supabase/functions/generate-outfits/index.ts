
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

    // Create comprehensive wardrobe description with all available metadata
    const createDetailedItemDescription = (item: any) => {
      const parts = [];
      
      // Add color and tone information
      if (item.primary_color && item.primary_color !== 'colorless') {
        parts.push(item.primary_color);
      }
      if (item.color_tone) {
        parts.push(`${item.color_tone.toLowerCase()} tone`);
      }
      
      // Add material and fit
      if (item.material) parts.push(item.material.toLowerCase());
      if (item.fit) parts.push(`${item.fit.toLowerCase()}-fit`);
      
      // Add specific garment details
      if (item.sleeve) parts.push(item.sleeve.toLowerCase());
      if (item.neckline) parts.push(item.neckline.toLowerCase());
      if (item.pattern && item.pattern !== 'Solid') parts.push(item.pattern.toLowerCase());
      
      // Add the main item name
      const cleanName = item.name?.replace(/^colorless\s+/i, '').trim() || item.subcategory || item.category;
      parts.push(cleanName.toLowerCase());
      
      // Add construction details if available
      if (item.closure_type) parts.push(`with ${item.closure_type.toLowerCase()}`);
      if (item.pocket_style && item.pocket_style !== 'No Pockets') parts.push(`${item.pocket_style.toLowerCase()}`);
      
      return parts.join(' ');
    };

    const wardrobeDescription = wardrobeItems.map((item: any) => {
      const description = createDetailedItemDescription(item);
      const brand = item.brand && item.brand !== 'Unknown' ? `, ${item.brand}` : '';
      return `${description} (${item.category}${brand})`;
    }).join(', ');

    console.log('Enhanced wardrobe description:', wardrobeDescription);

    const prompt = `You are KombinAI's professional styling assistant. Create outfit recommendations using ONLY items from the user's digital wardrobe.

AVAILABLE WARDROBE ITEMS:
${wardrobeDescription}

CONDITIONS:
- Occasion: ${occasion}
- Time of day: ${timeOfDay}  
- Weather: ${weather}

STYLING REQUIREMENTS:
1. ONLY use items that exist in the user's wardrobe (listed above)
2. Create complete outfit combinations (2-4 items per outfit)
3. Ensure outfits are appropriate for the occasion, time, and weather
4. Consider color coordination and style harmony
5. Use CLEAN item names (remove "colorless" and metadata artifacts)
6. Provide 3 different outfit options with Turkish names

CONTEXT MATCHING:
- Office + Afternoon + Hot Weather = Light, professional pieces
- Casual + Morning + Cool Weather = Comfortable layering
- Party + Evening + Any Weather = Stylish, statement pieces

OUTPUT REQUIREMENTS:
- Turkish outfit names that sound natural and appealing
- Brief Turkish styling tips for each outfit
- Use clean, readable item names from the wardrobe

Return ONLY valid JSON in this exact format (no additional text):
{
  "outfits": [
    {
      "id": 1,
      "name": "Turkish outfit name that sounds natural",
      "items": ["clean item name 1", "clean item name 2", "clean item name 3"],
      "confidence": 95,
      "styling_tips": "Brief Turkish styling tip focusing on how to wear the combination"
    }
  ]
}`;

    console.log('Sending request to OpenAI with enhanced styling prompt...');

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
            content: 'You are KombinAI, a professional styling assistant. You MUST respond ONLY with valid JSON. Always use clean item names from the wardrobe list provided WITHOUT any metadata like "colorless". Create natural-sounding Turkish outfit names and styling tips.' 
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

      // Process outfits and generate professional flatlay images
      const processedOutfits = await Promise.all(parsedOutfits.outfits.slice(0, 3).map(async (outfit: any, index: number) => {
        const itemIds = outfit.items.map((itemName: string) => {
          const cleanedItemName = itemName.replace(/^colorless\s+/i, '').trim();
          const foundItem = wardrobeItems.find((item: any) => {
            const cleanWardrobeName = item.name?.replace(/^colorless\s+/i, '').trim() || '';
            return cleanWardrobeName.toLowerCase().includes(cleanedItemName.toLowerCase()) ||
                   cleanedItemName.toLowerCase().includes(cleanWardrobeName.toLowerCase()) ||
                   item.subcategory?.toLowerCase().includes(cleanedItemName.toLowerCase());
          });
          return foundItem ? foundItem.id : null;
        }).filter(Boolean);
        
        // Create enhanced descriptions for professional flatlay generation
        const enhancedItemDescriptions = outfit.items.map((itemName: string) => {
          const cleanedItemName = itemName.replace(/^colorless\s+/i, '').trim();
          const wardrobeItem = wardrobeItems.find((item: any) => {
            const cleanWardrobeName = item.name?.replace(/^colorless\s+/i, '').trim() || '';
            return cleanWardrobeName.toLowerCase().includes(cleanedItemName.toLowerCase()) ||
                   cleanedItemName.toLowerCase().includes(cleanWardrobeName.toLowerCase()) ||
                   item.subcategory?.toLowerCase().includes(cleanedItemName.toLowerCase());
          });
          
          if (wardrobeItem) {
            return createDetailedItemDescription(wardrobeItem);
          }
          return cleanedItemName;
        });

        // Create professional flatlay image prompt
        const imagePrompt = `PROFESSIONAL FASHION FLATLAY PHOTOGRAPHY: Create a single, cohesive outfit layout on a clean white background.

OUTFIT COMPOSITION (arrange as one complete look):
${enhancedItemDescriptions.map((item, i) => `${i + 1}. ${item}`).join('\n')}

VISUAL REQUIREMENTS:
- Professional magazine-style flatlay photography
- Clean white/cream background (like Zara, COS, or Everlane)
- Arrange items as they would be worn (top items above, bottom items below)
- Slightly overlapping placement for natural styling
- High-end fashion photography lighting
- Square format (1024x1024)
- No human figures, mannequins, or hangers
- No additional props or accessories not listed
- Soft, even shadows for depth

STYLING CONTEXT: ${occasion} - ${timeOfDay} - ${weather}

Generate exactly ONE cohesive outfit image that looks like professional fashion brand photography.`;
        
        console.log(`Generating professional flatlay image ${index + 1}`);
        
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
              console.log(`Generated professional flatlay image for outfit ${index + 1}: success`);
            }
          } else {
            const errorText = await imageResponse.text();
            console.error(`Failed to generate image for outfit ${index + 1}:`, errorText);
          }
        } catch (imageError) {
          console.error(`Error generating image for outfit ${index + 1}:`, imageError);
        }
        
        // Clean item names for display
        const cleanItems = outfit.items.map((item: string) => 
          item.replace(/^colorless\s+/i, '').trim()
        );
        
        return {
          ...outfit,
          items: cleanItems,
          item_ids: itemIds,
          images: generatedImageUrl ? [generatedImageUrl] : ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop'],
          occasion: occasion,
          generated_image: generatedImageUrl
        };
      }));

      console.log('Processed professional flatlay outfits count:', processedOutfits.length);
      console.log('KombinAI professional styling generation successful!');
      
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
      
      // Enhanced fallback with smart outfit combinations
      const createSmartOutfitCombination = (items: any[], index: number) => {
        // Categorize items for better combinations
        const tops = items.filter(item => 
          ['Tops', 'Topwear'].includes(item.category) || 
          ['TShirt', 'Shirt', 'Blouse', 'Polo'].includes(item.subcategory)
        );
        const bottoms = items.filter(item => 
          ['Bottoms'].includes(item.category) || 
          ['Jeans', 'Trousers', 'Pants', 'Shorts'].includes(item.subcategory)
        );
        const outerwear = items.filter(item => 
          ['Outerwear'].includes(item.category) || 
          ['Jacket', 'Blazer', 'Cardigan', 'Coat'].includes(item.subcategory)
        );
        
        let selectedItems = [];
        
        // Smart selection based on occasion and weather
        if (tops.length > 0) {
          const appropriateTop = tops.find(item => {
            if (occasion === 'office' && item.subcategory === 'Shirt') return true;
            if (occasion === 'casual' && item.subcategory === 'TShirt') return true;
            return true;
          }) || tops[Math.floor(Math.random() * tops.length)];
          selectedItems.push(appropriateTop);
        }
        
        if (bottoms.length > 0) {
          const appropriateBottom = bottoms.find(item => {
            if (occasion === 'office' && item.subcategory === 'Trousers') return true;
            if (weather === 'sunny' && item.subcategory === 'Shorts') return true;
            return true;
          }) || bottoms[Math.floor(Math.random() * bottoms.length)];
          selectedItems.push(appropriateBottom);
        }
        
        // Add outerwear if weather suggests it
        if (outerwear.length > 0 && (weather === 'cool' || weather === 'cold' || weather === 'windy')) {
          selectedItems.push(outerwear[Math.floor(Math.random() * outerwear.length)]);
        }
        
        // Ensure we have at least 2 items
        if (selectedItems.length < 2) {
          const remaining = items.filter(item => !selectedItems.includes(item));
          while (selectedItems.length < 2 && remaining.length > 0) {
            const randomItem = remaining.splice(Math.floor(Math.random() * remaining.length), 1)[0];
            selectedItems.push(randomItem);
          }
        }
        
        return {
          id: index + 1,
          name: `Günlük Kombin ${index + 1}`,
          items: selectedItems.map((item: any) => item.name?.replace(/^colorless\s+/i, '').trim() || item.subcategory),
          item_ids: selectedItems.map((item: any) => item.id),
          confidence: Math.floor(Math.random() * 20) + 75,
          styling_tips: `Bu kombinasyon ${selectedItems.map(item => createDetailedItemDescription(item)).join(' ve ')} parçalarından oluşuyor`,
          images: selectedItems.map((item: any) => item.image_url).filter(Boolean),
          occasion: occasion
        };
      };

      const fallbackOutfits = [
        createSmartOutfitCombination(wardrobeItems, 0),
        createSmartOutfitCombination(wardrobeItems, 1),
        createSmartOutfitCombination(wardrobeItems, 2)
      ].filter(outfit => outfit.items.length > 0);

      return new Response(JSON.stringify({
        outfits: fallbackOutfits,
        warning: 'AI servisi geçici olarak kullanılamadı, gardırobunuzdaki ürünlerden akıllı kombinler oluşturuldu.'
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
