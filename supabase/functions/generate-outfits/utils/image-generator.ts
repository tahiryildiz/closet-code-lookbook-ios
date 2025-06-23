
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

  try {
    // Create ultra-specific flatlay prompt
    const flatlayPrompt = `Create a PROFESSIONAL FLATLAY COMPOSITION photographed from directly above showing these EXACT clothing items arranged as a complete outfit:

ITEMS TO INCLUDE:
${matchedItems.map((item, idx) => `${idx + 1}. ${item.name} (${item.color}) - ${item.category}`).join('\n')}

CRITICAL REQUIREMENTS:
- Shot from directly overhead (90-degree bird's eye view)
- All items laid completely flat on clean white background
- Professional fashion photography lighting
- Items arranged to show a complete outfit layout:
  * Shirt/top positioned in upper portion
  * Pants/bottoms positioned below the top, legs straight down
  * Shoes (if any) positioned at bottom of frame
- Items should be touching or nearly touching to show they belong together
- Maintain authentic colors and details from reference images
- Single cohesive image, NOT separate product photos
- Professional styling as if prepared for fashion magazine

OCCASION: ${occasion} | TIME: ${timeOfDay} | WEATHER: ${weather}

OUTPUT: One unified flatlay photograph showing complete outfit arrangement.`;

    console.log(`🤖 [DEBUG] Generated prompt (length: ${flatlayPrompt.length})`);
    console.log(`🤖 [DEBUG] Prompt preview:`, flatlayPrompt.substring(0, 200) + '...');

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
    console.log(`📡 [DEBUG] OpenAI API response headers:`, Object.fromEntries(response.headers.entries()));

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
    console.log(`🎨 [DEBUG] OpenAI response structure:`, {
      hasData: !!imageData.data,
      dataLength: imageData.data?.length,
      firstItemKeys: imageData.data?.[0] ? Object.keys(imageData.data[0]) : []
    });
    
    // gpt-image-1 returns base64 data, not URL
    const generatedImageData = imageData.data[0];
    let generatedImageUrl = null;
    
    if (generatedImageData.b64_json) {
      generatedImageUrl = `data:image/png;base64,${generatedImageData.b64_json}`;
      console.log(`✅ [DEBUG] Successfully converted base64 image (length: ${generatedImageData.b64_json.length})`);
    } else if (generatedImageData.url) {
      generatedImageUrl = generatedImageData.url;
      console.log(`✅ [DEBUG] Received image URL: ${generatedImageUrl}`);
    } else {
      console.error(`❌ [DEBUG] No image data found in response:`, generatedImageData);
    }

    if (!generatedImageUrl) {
      console.error(`❌ [DEBUG] Failed to extract image from OpenAI response`);
      return {
        generated_image: null,
        reference_images: matchedItems.map(item => item.image_url),
        item_details: matchedItems,
        item_count: matchedItems.length,
        composition_type: 'reference_fallback',
        debug_reason: 'no_image_in_response'
      };
    }

    console.log(`✅ [DEBUG] Successfully generated flatlay composition for outfit ${index + 1}`);

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
