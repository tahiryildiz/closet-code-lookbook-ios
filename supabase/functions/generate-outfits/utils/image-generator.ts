
export const generateOutfitImage = async (outfit: any, wardrobeItems: any[], occasion: string, timeOfDay: string, weather: string, openAIApiKey: string, index: number) => {
  console.log(`🖼️  Generating flatlay composition for outfit ${index + 1}`);
  
  // Find actual wardrobe items that match the outfit items
  const matchedItems = outfit.items.map((itemName: string) => {
    const cleanedItemName = itemName.trim();
    const wardrobeItem = wardrobeItems.find((item: any) => {
      const wardrobeName = (item.name || item.subcategory || '').trim();
      return wardrobeName === cleanedItemName;
    });
    
    if (wardrobeItem && wardrobeItem.image_url) {
      console.log(`✅ Found reference image for "${itemName}": ${wardrobeItem.image_url}`);
      return {
        name: wardrobeItem.name,
        image_url: wardrobeItem.image_url,
        category: wardrobeItem.category,
        color: wardrobeItem.primary_color || wardrobeItem.color,
        description: wardrobeItem.prompt_description || `${wardrobeItem.category} in ${wardrobeItem.primary_color || wardrobeItem.color}`
      };
    } else {
      console.log(`⚠️  No reference image found for "${itemName}"`);
      return null;
    }
  }).filter(Boolean);

  if (matchedItems.length === 0) {
    console.log('❌ No reference images found for outfit items');
    return {
      generated_image: null,
      reference_images: [],
      item_count: 0
    };
  }

  console.log(`🎯 Found ${matchedItems.length} reference images for flatlay generation`);

  try {
    // Create detailed prompt for flatlay generation using reference images
    const itemDescriptions = matchedItems.map(item => 
      `${item.category} (${item.color}) - reference image: ${item.image_url} - ${item.description}`
    ).join(', ');

    const flatlayPrompt = `Create a professional flatlay composition showing these exact clothing items arranged elegantly on a clean white background:

${itemDescriptions}

CRITICAL INSTRUCTIONS:
- Use the reference images to replicate each item's exact visual appearance (colors, patterns, details, silhouette)
- DO NOT create generic items - replicate the specific items from the reference images
- Arrange all items in a cohesive, balanced flatlay composition
- Clean, studio-quality lighting and presentation
- Items should be laid flat as if professionally photographed from above
- Maintain the authentic visual identity of each reference item
- Occasion: ${occasion}, Time: ${timeOfDay}, Weather: ${weather}

Style: Professional fashion flatlay photography, clean white background, even lighting, balanced composition.`;

    console.log(`🤖 Generating flatlay composition with prompt:`, flatlayPrompt.substring(0, 200) + '...');

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

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI Image API error:', response.status, errorText);
      throw new Error(`OpenAI Image API error: ${response.status}`);
    }

    const imageData = await response.json();
    
    // gpt-image-1 returns base64 data, not URL
    const generatedImageData = imageData.data[0];
    let generatedImageUrl = null;
    
    if (generatedImageData.b64_json) {
      generatedImageUrl = `data:image/png;base64,${generatedImageData.b64_json}`;
    } else if (generatedImageData.url) {
      generatedImageUrl = generatedImageData.url;
    }

    console.log(`✅ Successfully generated flatlay composition for outfit ${index + 1}`);

    return {
      generated_image: generatedImageUrl,
      reference_images: matchedItems.map(item => item.image_url),
      item_details: matchedItems,
      item_count: matchedItems.length,
      composition_type: 'flatlay'
    };

  } catch (error) {
    console.error('❌ Error generating flatlay composition:', error);
    
    // Fallback: return reference images for manual composition
    return {
      generated_image: null,
      reference_images: matchedItems.map(item => item.image_url),
      item_details: matchedItems,
      item_count: matchedItems.length,
      composition_type: 'reference_fallback'
    };
  }
};
