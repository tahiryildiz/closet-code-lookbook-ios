
export const generateOutfitImage = async (outfit: any, wardrobeItems: any[], occasion: string, timeOfDay: string, weather: string, openAIApiKey: string, index: number) => {
  console.log(`🖼️  Generating professional flatlay composition for outfit ${index + 1}`);
  
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

  console.log(`🎯 Found ${matchedItems.length} reference images for professional flatlay generation`);

  try {
    // Organize items by category for proper flatlay arrangement
    const tops = matchedItems.filter(item => 
      item.category?.toLowerCase().includes('top') || 
      item.category?.toLowerCase().includes('shirt') || 
      item.category?.toLowerCase().includes('jacket') ||
      item.category?.toLowerCase().includes('blazer') ||
      item.category?.toLowerCase().includes('sweater')
    );
    
    const bottoms = matchedItems.filter(item => 
      item.category?.toLowerCase().includes('bottom') || 
      item.category?.toLowerCase().includes('pant') || 
      item.category?.toLowerCase().includes('jean') ||
      item.category?.toLowerCase().includes('trouser') ||
      item.category?.toLowerCase().includes('short')
    );
    
    const shoes = matchedItems.filter(item => 
      item.category?.toLowerCase().includes('shoe') || 
      item.category?.toLowerCase().includes('sneaker') ||
      item.category?.toLowerCase().includes('boot')
    );
    
    const accessories = matchedItems.filter(item => 
      !tops.includes(item) && !bottoms.includes(item) && !shoes.includes(item)
    );

    // Create detailed descriptions for each category
    const topDescriptions = tops.map(item => 
      `${item.name} (${item.color}) - reference: ${item.image_url}`
    ).join(', ');
    
    const bottomDescriptions = bottoms.map(item => 
      `${item.name} (${item.color}) - reference: ${item.image_url}`
    ).join(', ');
    
    const shoeDescriptions = shoes.map(item => 
      `${item.name} (${item.color}) - reference: ${item.image_url}`
    ).join(', ');
    
    const accessoryDescriptions = accessories.map(item => 
      `${item.name} (${item.color}) - reference: ${item.image_url}`
    ).join(', ');

    // Create ultra-specific flatlay prompt with spatial arrangement
    const flatlayPrompt = `Create a PROFESSIONAL FLATLAY COMPOSITION photographed from directly above with these EXACT clothing items:

SPATIAL ARRANGEMENT (CRITICAL):
${tops.length > 0 ? `- TOP SECTION: ${topDescriptions} - Position in UPPER portion of frame, laid flat, sleeves spread naturally` : ''}
${bottoms.length > 0 ? `- MIDDLE SECTION: ${bottomDescriptions} - Position BELOW the top, legs laid straight down, waistband aligned` : ''}
${shoes.length > 0 ? `- BOTTOM SECTION: ${shoeDescriptions} - Position at BOTTOM of frame, both shoes side by side, toes pointing up` : ''}
${accessories.length > 0 ? `- ACCESSORIES: ${accessoryDescriptions} - Position strategically around main items` : ''}

VISUAL REPLICATION REQUIREMENTS:
- Study each reference image URL to replicate EXACT colors, patterns, textures, and details
- Maintain authentic visual identity of each item (logos, stitching, fabric texture)
- NO generic items - each piece must match its reference image precisely

PROFESSIONAL FLATLAY STYLE:
- Shot from directly overhead (90-degree top-down view)
- Clean white background, studio lighting
- Items laid completely flat as if pressed
- Natural shadows for depth
- Balanced, harmonious composition
- Professional fashion photography quality
- Items should touch or nearly touch to show relationship
- Overall composition fills frame efficiently

CONTEXT: Occasion: ${occasion}, Time: ${timeOfDay}, Weather: ${weather}

OUTPUT: Single cohesive flatlay image showing complete outfit layout, NOT separate item photos.`;

    console.log(`🤖 Generating structured flatlay with enhanced prompt`);

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

    console.log(`✅ Successfully generated structured flatlay composition for outfit ${index + 1}`);

    return {
      generated_image: generatedImageUrl,
      reference_images: matchedItems.map(item => item.image_url),
      item_details: matchedItems,
      item_count: matchedItems.length,
      composition_type: 'professional_flatlay'
    };

  } catch (error) {
    console.error('❌ Error generating professional flatlay composition:', error);
    
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
