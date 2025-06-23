

export const generateOutfitImage = async (outfit: any, wardrobeItems: any[], occasion: string, timeOfDay: string, weather: string, openAIApiKey: string, index: number) => {
  console.log(`🖼️  [DEBUG] Starting image generation for outfit ${index + 1}`);
  console.log(`🖼️  [DEBUG] Outfit items:`, outfit.items);
  console.log(`🖼️  [DEBUG] OpenAI API Key present:`, !!openAIApiKey);
  
  // Find actual wardrobe items that match the outfit items
  const matchedItems = outfit.items.map((itemName: string) => {
    const cleanedItemName = itemName.trim();
    const wardrobeItem = wardrobeItems.find((item: any) => {
      const wardrobeName = (item.name || item.subcategory || '').trim();
      return wardrobeName === cleanedItemName;
    });
    
    if (wardrobeItem && wardrobeItem.image_url) {
      console.log(`✅ [DEBUG] Found reference image for "${itemName}": ${wardrobeItem.image_url}`);
      return {
        name: wardrobeItem.name,
        image_url: wardrobeItem.image_url,
        category: wardrobeItem.category,
        color: wardrobeItem.primary_color || wardrobeItem.color,
        description: wardrobeItem.prompt_description || `${wardrobeItem.category} in ${wardrobeItem.primary_color || wardrobeItem.color}`
      };
    } else {
      console.log(`⚠️  [DEBUG] No reference image found for "${itemName}"`);
      return null;
    }
  }).filter(Boolean);

  if (matchedItems.length === 0) {
    console.log('❌ [DEBUG] No reference images found for outfit items');
    return {
      generated_image: null,
      reference_images: [],
      item_count: 0,
      composition_type: 'reference_fallback',
      debug_reason: 'no_reference_images'
    };
  }

  console.log(`🎯 [DEBUG] Found ${matchedItems.length} reference images for flatlay generation`);

  // Categorize items for proper flatlay arrangement
  const categorizedItems = {
    tops: matchedItems.filter(item => ['Tops', 'shirts', 'sweaters', 'jackets'].some(cat => 
      item.category?.toLowerCase().includes(cat.toLowerCase()))),
    bottoms: matchedItems.filter(item => ['Bottoms', 'pants', 'jeans', 'trousers', 'shorts'].some(cat => 
      item.category?.toLowerCase().includes(cat.toLowerCase()))),
    shoes: matchedItems.filter(item => ['shoes', 'footwear', 'sneakers', 'boots'].some(cat => 
      item.category?.toLowerCase().includes(cat.toLowerCase()))),
    accessories: matchedItems.filter(item => ['accessories', 'bags', 'belts', 'hats'].some(cat => 
      item.category?.toLowerCase().includes(cat.toLowerCase())))
  };

  console.log(`📋 [DEBUG] Categorized items:`, {
    tops: categorizedItems.tops.length,
    bottoms: categorizedItems.bottoms.length,
    shoes: categorizedItems.shoes.length,
    accessories: categorizedItems.accessories.length
  });

  try {
    // Create ultra-specific flatlay prompt with precise spatial instructions
    const flatlayPrompt = `Create a PROFESSIONAL FLATLAY COMPOSITION - single unified image photographed from directly overhead (bird's eye view) showing these clothing items arranged as one complete outfit:

ITEMS TO ARRANGE IN FLATLAY STYLE:
${matchedItems.map((item, idx) => `${idx + 1}. ${item.name} (${item.color}) - ${item.category}`).join('\n')}

CRITICAL SPATIAL ARRANGEMENT REQUIREMENTS:
- SINGLE UNIFIED IMAGE - all items must appear in ONE cohesive photograph
- Shot from 90-degree overhead angle (top-down bird's eye view)
- Clean white background with soft, even lighting
- All items laid completely flat on surface (no 3D perspective)

PRECISE LAYOUT STRUCTURE:
${categorizedItems.tops.length > 0 ? `- TOP SECTION: ${categorizedItems.tops.map(t => t.name).join(', ')} positioned in upper portion of frame` : ''}
${categorizedItems.bottoms.length > 0 ? `- MIDDLE SECTION: ${categorizedItems.bottoms.map(b => b.name).join(', ')} positioned below tops, legs extended downward` : ''}
${categorizedItems.shoes.length > 0 ? `- BOTTOM SECTION: ${categorizedItems.shoes.map(s => s.name).join(', ')} positioned at bottom of frame` : ''}
${categorizedItems.accessories.length > 0 ? `- SIDE PLACEMENT: ${categorizedItems.accessories.map(a => a.name).join(', ')} positioned alongside main items` : ''}

VISUAL REPLICATION REQUIREMENTS:
- Replicate exact colors: ${matchedItems.map(item => `${item.name} in ${item.color}`).join(', ')}
- Maintain authentic fabric textures and patterns from reference items
- Show realistic wrinkles and fabric draping as items would naturally lay flat
- Ensure items touch or nearly touch to show they belong together as one outfit

PROFESSIONAL FLATLAY PHOTOGRAPHY STYLE:
- High-end fashion magazine quality
- Soft, diffused lighting with no harsh shadows
- Perfect white balance and color accuracy
- Sharp focus across entire composition
- Professional styling with attention to detail

COMPOSITION GUIDELINES:
- Items should form a cohesive visual flow from top to bottom
- Maintain proportional sizing between items
- Create visual balance and harmony
- Style as if prepared by professional fashion stylist

OCCASION CONTEXT: ${occasion} | TIME: ${timeOfDay} | WEATHER: ${weather}

OUTPUT: One unified professional flatlay photograph showing complete outfit arrangement in perfect overhead composition.`;

    console.log(`🤖 [DEBUG] Generated prompt (length: ${flatlayPrompt.length})`);
    console.log(`🤖 [DEBUG] Prompt preview:`, flatlayPrompt.substring(0, 300) + '...');

    console.log(`📡 [DEBUG] Making OpenAI API call to generate flatlay image...`);

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: flatlayPrompt,
        n: 1,
        size: '1024x1024',
        quality: 'high'
      }),
    });

    console.log(`📡 [DEBUG] OpenAI API response status:`, response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ [DEBUG] OpenAI Image API error details:`, {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      
      return {
        generated_image: null,
        reference_images: matchedItems.map(item => item.image_url),
        item_details: matchedItems,
        item_count: matchedItems.length,
        composition_type: 'reference_fallback',
        debug_reason: 'api_error',
        debug_details: { status: response.status, error: errorText }
      };
    }

    const imageData = await response.json();
    console.log(`🎨 [DEBUG] OpenAI response received`);
    
    // Extract and properly format the base64 image data
    const generatedImageData = imageData.data[0];
    let generatedImageUrl = null;
    
    if (generatedImageData && generatedImageData.b64_json) {
      // Properly format the base64 data as data URL
      const base64Data = generatedImageData.b64_json;
      generatedImageUrl = `data:image/png;base64,${base64Data}`;
      console.log(`✅ [DEBUG] Successfully converted base64 image (size: ${base64Data.length} chars)`);
      console.log(`✅ [DEBUG] Data URL preview: ${generatedImageUrl.substring(0, 100)}...`);
    } else if (generatedImageData && generatedImageData.url) {
      generatedImageUrl = generatedImageData.url;
      console.log(`✅ [DEBUG] Received image URL: ${generatedImageUrl}`);
    } else {
      console.error(`❌ [DEBUG] No image data found in response:`, generatedImageData);
      return {
        generated_image: null,
        reference_images: matchedItems.map(item => item.image_url),
        item_details: matchedItems,
        item_count: matchedItems.length,
        composition_type: 'reference_fallback',
        debug_reason: 'no_image_in_response'
      };
    }

    if (!generatedImageUrl) {
      console.error(`❌ [DEBUG] Failed to extract image from OpenAI response`);
      return {
        generated_image: null,
        reference_images: matchedItems.map(item => item.image_url),
        item_details: matchedItems,
        item_count: matchedItems.length,
        composition_type: 'reference_fallback',
        debug_reason: 'no_image_url_generated'
      };
    }

    console.log(`✅ [DEBUG] Successfully generated flatlay composition for outfit ${index + 1}`);
    console.log(`🎯 [DEBUG] Final composition type: professional_flatlay`);

    return {
      generated_image: generatedImageUrl,
      reference_images: matchedItems.map(item => item.image_url),
      item_details: matchedItems,
      item_count: matchedItems.length,
      composition_type: 'professional_flatlay',
      debug_reason: 'success'
    };

  } catch (error) {
    console.error(`❌ [DEBUG] Exception during flatlay generation:`, {
      error: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Fallback: return reference images for manual composition
    return {
      generated_image: null,
      reference_images: matchedItems.map(item => item.image_url),
      item_details: matchedItems,
      item_count: matchedItems.length,
      composition_type: 'reference_fallback',
      debug_reason: 'exception',
      debug_details: { error: error.message }
    };
  }
};

