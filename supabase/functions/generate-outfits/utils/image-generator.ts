
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
        brand: wardrobeItem.brand,
        material: wardrobeItem.material,
        pattern: wardrobeItem.pattern,
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
    // Create ULTRA-STRICT flatlay prompt with precise item binding
    const itemDescriptions = matchedItems.map((item, idx) => {
      return `${idx + 1}. ${item.name} - EXACT SPECIFICATIONS:
   - Color: ${item.color}
   - Category: ${item.category}
   ${item.brand ? `- Brand: ${item.brand}` : ''}
   ${item.material ? `- Material: ${item.material}` : ''}
   ${item.pattern ? `- Pattern: ${item.pattern}` : ''}
   - Reference Image: ${item.image_url}
   - Description: ${item.description}`;
    }).join('\n\n');

    const flatlayPrompt = `CREATE PROFESSIONAL FLATLAY COMPOSITION - STRICT ITEM REPLICATION REQUIRED

🚨 CRITICAL RULE: ONLY use the exact clothing items listed below. NO generic items, NO similar items, NO imagined items. You MUST replicate the EXACT items from the reference images provided.

EXACT WARDROBE ITEMS TO REPLICATE:
${itemDescriptions}

MANDATORY REPLICATION REQUIREMENTS:
- EXACT COLOR MATCHING: Replicate the precise colors from reference images
- EXACT SHAPE & CUT: Match the silhouette, fit, and proportions exactly
- EXACT TEXTURE & PATTERN: Reproduce fabric texture, prints, logos, details
- EXACT BRAND ELEMENTS: Include any visible branding, labels, or design elements
- NO SUBSTITUTIONS: Do not use similar or generic versions

VERTICAL FLATLAY COMPOSITION (1024x1792):
- Shot from perfect 90-degree overhead angle (bird's eye view)
- Clean white background with professional studio lighting
- Vertical arrangement to utilize the tall canvas effectively

PRECISE SPATIAL LAYOUT:
${categorizedItems.tops.length > 0 ? `- TOP SECTION (upper 1/3): ${categorizedItems.tops.map(t => t.name).join(', ')}
  Position: Laid flat, shoulders aligned horizontally, centered` : ''}
${categorizedItems.bottoms.length > 0 ? `- MIDDLE SECTION (center 1/3): ${categorizedItems.bottoms.map(b => b.name).join(', ')}
  Position: Waistband touching or overlapping bottom of top item, legs extended downward` : ''}
${categorizedItems.shoes.length > 0 ? `- BOTTOM SECTION (lower 1/3): ${categorizedItems.shoes.map(s => s.name).join(', ')}
  Position: Placed at the bottom, parallel to each other, toes pointing up` : ''}
${categorizedItems.accessories.length > 0 ? `- SIDE PLACEMENT: ${categorizedItems.accessories.map(a => a.name).join(', ')}
  Position: Strategically placed alongside main items without overlapping` : ''}

PROFESSIONAL FLATLAY PHOTOGRAPHY STYLE:
- High-end fashion magazine quality with sharp focus
- Soft, diffused lighting eliminating harsh shadows
- Perfect white balance and color accuracy
- Items laid completely flat with natural fabric draping
- Professional styling showing items as if prepared by expert stylist

COMPOSITION COHESION:
- Items should touch or nearly touch to show they belong together
- Maintain visual balance and harmony throughout the vertical space
- Create natural flow from top to bottom
- Utilize the full vertical canvas (1024x1792) effectively

CONTEXT: ${occasion} occasion, ${timeOfDay} time, ${weather} weather

OUTPUT REQUIREMENT: Single unified professional flatlay photograph in vertical 1024x1792 format showing ONLY the exact items specified above in perfect overhead composition.`;

    console.log(`🤖 [DEBUG] Generated strict prompt (length: ${flatlayPrompt.length})`);
    console.log(`🤖 [DEBUG] Prompt preview:`, flatlayPrompt.substring(0, 400) + '...');

    console.log(`📡 [DEBUG] Making OpenAI API call with vertical canvas...`);

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
        size: '1024x1792', // Vertical canvas for better flatlay composition
        quality: 'high'
        // Note: gpt-image-1 doesn't support response_format parameter - always returns base64
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
    console.log(`🎨 [DEBUG] OpenAI response received successfully`);
    
    // Extract and properly format the base64 image data
    const generatedImageData = imageData.data[0];
    let generatedImageUrl = null;
    
    if (generatedImageData && generatedImageData.b64_json) {
      const base64Data = generatedImageData.b64_json;
      generatedImageUrl = `data:image/png;base64,${base64Data}`;
      
      // Enhanced logging for debugging
      console.log(`✅ [DEBUG] Successfully converted base64 image`);
      console.log(`📊 [DEBUG] Base64 data stats:`, {
        size: base64Data.length,
        start: base64Data.substring(0, 50),
        end: base64Data.substring(base64Data.length - 50),
        checksum: base64Data.length + base64Data.charCodeAt(0) + base64Data.charCodeAt(base64Data.length - 1)
      });
      console.log(`🔗 [DEBUG] Data URL preview: ${generatedImageUrl.substring(0, 100)}...`);
      
      // Verify data URL format
      if (!generatedImageUrl.startsWith('data:image/png;base64,')) {
        console.error(`❌ [DEBUG] Invalid data URL format`);
        return {
          generated_image: null,
          reference_images: matchedItems.map(item => item.image_url),
          item_details: matchedItems,
          item_count: matchedItems.length,
          composition_type: 'reference_fallback',
          debug_reason: 'invalid_data_url_format'
        };
      }
      
    } else {
      console.error(`❌ [DEBUG] No base64 data found in response:`, generatedImageData);
      return {
        generated_image: null,
        reference_images: matchedItems.map(item => item.image_url),
        item_details: matchedItems,
        item_count: matchedItems.length,
        composition_type: 'reference_fallback',
        debug_reason: 'no_base64_in_response'
      };
    }

    console.log(`✅ [DEBUG] Successfully generated vertical flatlay composition for outfit ${index + 1}`);
    console.log(`🎯 [DEBUG] Final composition type: professional_flatlay_vertical`);

    return {
      generated_image: generatedImageUrl,
      reference_images: matchedItems.map(item => item.image_url),
      item_details: matchedItems,
      item_count: matchedItems.length,
      composition_type: 'professional_flatlay_vertical',
      aspect_ratio: '1024x1792',
      debug_reason: 'success',
      debug_info: {
        base64_size: base64Data.length,
        exact_items_used: matchedItems.length,
        vertical_canvas: true
      }
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
