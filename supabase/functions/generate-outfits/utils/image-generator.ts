
export const generateOutfitImage = async (outfit: any, wardrobeItems: any[], occasion: string, timeOfDay: string, weather: string, openAIApiKey: string, index: number) => {
  console.log(`🖼️  [DEBUG] Starting image generation for outfit ${index + 1}`);
  console.log(`🖼️  [DEBUG] Outfit items:`, outfit.items);
  console.log(`🖼️  [DEBUG] Available wardrobe items:`, wardrobeItems.map(item => item.name));
  console.log(`🖼️  [DEBUG] OpenAI API Key present:`, !!openAIApiKey);
  
  // Enhanced item matching with better Turkish text matching
  const matchedItems = outfit.items.map((itemName: string) => {
    const cleanedItemName = itemName.trim().toLowerCase();
    console.log(`🔍 [DEBUG] Looking for match for: "${itemName}"`);
    
    // Try multiple matching strategies
    let wardrobeItem = null;
    
    // Strategy 1: Exact name match (case insensitive)
    wardrobeItem = wardrobeItems.find((item: any) => {
      return item.name && item.name.toLowerCase() === cleanedItemName;
    });
    
    if (wardrobeItem) {
      console.log(`✅ [DEBUG] Exact match found: "${wardrobeItem.name}"`);
    } else {
      // Strategy 2: Partial name match
      wardrobeItem = wardrobeItems.find((item: any) => {
        const wardrobeName = (item.name || '').toLowerCase();
        return wardrobeName.includes(cleanedItemName) || cleanedItemName.includes(wardrobeName);
      });
      
      if (wardrobeItem) {
        console.log(`✅ [DEBUG] Partial match found: "${wardrobeItem.name}" for "${itemName}"`);
      } else {
        // Strategy 3: Category + color matching
        const colorKeywords = ['beyaz', 'siyah', 'mavi', 'yeşil', 'kırmızı', 'sarı', 'mor', 'turuncu', 'pembe', 'gri', 'kahverengi', 'lacivert', 'bej', 'haki'];
        const categoryKeywords = ['tişört', 'gömlek', 'pantolon', 'etek', 'kazak', 'sweatshirt', 'ayakkabı', 'blazer', 'ceket', 'şort', 'elbise'];
        
        const itemColors = colorKeywords.filter(color => cleanedItemName.includes(color));
        const itemCategories = categoryKeywords.filter(cat => cleanedItemName.includes(cat));
        
        if (itemColors.length > 0 || itemCategories.length > 0) {
          wardrobeItem = wardrobeItems.find((item: any) => {
            const wardrobeName = (item.name || '').toLowerCase();
            const wardromeCategory = (item.category || '').toLowerCase();
            const wardrobeColor = (item.primary_color || item.color || '').toLowerCase();
            
            const colorMatch = itemColors.some(color => 
              wardrobeName.includes(color) || wardrobeColor.includes(color)
            );
            const categoryMatch = itemCategories.some(cat => 
              wardrobeName.includes(cat) || wardromeCategory.includes(cat)
            );
            
            return colorMatch || categoryMatch;
          });
          
          if (wardrobeItem) {
            console.log(`✅ [DEBUG] Category/color match found: "${wardrobeItem.name}" for "${itemName}"`);
          }
        }
      }
    }
    
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
    console.log('📋 [DEBUG] Available wardrobe items:', wardrobeItems.map(item => ({ name: item.name, hasImage: !!item.image_url })));
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
    tops: matchedItems.filter(item => ['Tops', 'shirts', 'sweaters', 'jackets', 'tişört', 'gömlek', 'kazak', 'sweatshirt', 'blazer', 'ceket'].some(cat => 
      (item.category || '').toLowerCase().includes(cat.toLowerCase()))),
    bottoms: matchedItems.filter(item => ['Bottoms', 'pants', 'jeans', 'trousers', 'shorts', 'pantolon', 'şort', 'etek'].some(cat => 
      (item.category || '').toLowerCase().includes(cat.toLowerCase()))),
    shoes: matchedItems.filter(item => ['shoes', 'footwear', 'sneakers', 'boots', 'ayakkabı'].some(cat => 
      (item.category || '').toLowerCase().includes(cat.toLowerCase()))),
    accessories: matchedItems.filter(item => ['accessories', 'bags', 'belts', 'hats', 'aksesuar', 'çanta', 'kemer', 'şapka'].some(cat => 
      (item.category || '').toLowerCase().includes(cat.toLowerCase())))
  };

  console.log(`📋 [DEBUG] Categorized items:`, {
    tops: categorizedItems.tops.length,
    bottoms: categorizedItems.bottoms.length,
    shoes: categorizedItems.shoes.length,
    accessories: categorizedItems.accessories.length
  });

  try {
    // Create ENHANCED flatlay prompt with layered styling for tops
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

    const flatlayPrompt = `CREATE PROFESSIONAL LAYERED FLATLAY COMPOSITION - EXACT ITEM REPLICATION

🚨 CRITICAL RULE: ONLY use the exact clothing items listed below. NO generic items, NO similar items, NO imagined items. You MUST replicate the EXACT items from the reference images provided.

EXACT WARDROBE ITEMS TO REPLICATE:
${itemDescriptions}

MANDATORY REPLICATION REQUIREMENTS:
- EXACT COLOR MATCHING: Replicate the precise colors from reference images
- EXACT SHAPE & CUT: Match the silhouette, fit, and proportions exactly
- EXACT TEXTURE & PATTERN: Reproduce fabric texture, prints, logos, details
- EXACT BRAND ELEMENTS: Include any visible branding, labels, or design elements
- NO SUBSTITUTIONS: Do not use similar or generic versions

VERTICAL LAYERED FLATLAY COMPOSITION (1024x1536):
- Shot from perfect 90-degree overhead angle (bird's eye view)
- Clean white background with professional studio lighting
- Vertical arrangement to utilize the tall canvas effectively

PRECISE LAYERED LAYOUT:
${categorizedItems.tops.length > 1 ? `- TOP SECTION: Layer ${categorizedItems.tops.map(t => t.name).join(' OVER ')}
  Position: ${categorizedItems.tops[0]?.name} as base layer, ${categorizedItems.tops[1]?.name} layered on top showing both items naturally as they would be worn together` : 
  categorizedItems.tops.length === 1 ? `- TOP SECTION: ${categorizedItems.tops[0].name}
  Position: Laid flat, shoulders aligned horizontally, centered` : ''}
${categorizedItems.bottoms.length > 0 ? `- MIDDLE SECTION: ${categorizedItems.bottoms.map(b => b.name).join(', ')}
  Position: Waistband touching or slightly overlapping the bottom edge of top items, legs extended downward` : ''}
${categorizedItems.shoes.length > 0 ? `- BOTTOM SECTION: ${categorizedItems.shoes.map(s => s.name).join(', ')}
  Position: Placed at the bottom, parallel to each other, toes pointing up` : ''}
${categorizedItems.accessories.length > 0 ? `- SIDE PLACEMENT: ${categorizedItems.accessories.map(a => a.name).join(', ')}
  Position: Strategically placed alongside main items without overlapping` : ''}

PROFESSIONAL LAYERED FLATLAY PHOTOGRAPHY STYLE:
- High-end fashion magazine quality with sharp focus
- Soft, diffused lighting eliminating harsh shadows
- Perfect white balance and color accuracy
- Show how items naturally layer together when worn
- Professional styling demonstrating outfit coordination
- Items should appear as if thoughtfully arranged by a stylist

LAYERING TECHNIQUE:
- When multiple tops are present, show them layered as they would be worn
- Blazers/jackets should be positioned over shirts/t-shirts showing both items
- Maintain natural fabric draping and realistic positioning
- Create visual depth while keeping the overhead flatlay perspective

COMPOSITION COHESION:
- Items should touch or nearly touch to show they belong together
- Maintain visual balance and harmony throughout the vertical space
- Create natural flow from top to bottom showing complete outfit
- Utilize the full vertical canvas (1024x1536) effectively

CONTEXT: ${occasion} occasion, ${timeOfDay} time, ${weather} weather

OUTPUT REQUIREMENT: Single unified professional layered flatlay photograph in vertical 1024x1536 format showing ONLY the exact items specified above in perfect overhead composition with natural layering.`;

    console.log(`🤖 [DEBUG] Generated enhanced layered prompt (length: ${flatlayPrompt.length})`);
    console.log(`🤖 [DEBUG] Prompt preview:`, flatlayPrompt.substring(0, 400) + '...');

    console.log(`📡 [DEBUG] Making OpenAI API call with supported vertical canvas...`);

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
        size: '1024x1536',
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
    console.log(`🎨 [DEBUG] OpenAI response received successfully`);
    
    // Extract and properly format the base64 image data
    const generatedImageData = imageData.data[0];
    let generatedImageUrl = null;
    let base64Data = null;
    
    if (generatedImageData && generatedImageData.b64_json) {
      base64Data = generatedImageData.b64_json;
      generatedImageUrl = `data:image/png;base64,${base64Data}`;
      
      console.log(`✅ [DEBUG] Successfully converted base64 image`);
      console.log(`📊 [DEBUG] Base64 data stats:`, {
        size: base64Data.length,
        start: base64Data.substring(0, 50),
        end: base64Data.substring(base64Data.length - 50),
        checksum: base64Data.length + base64Data.charCodeAt(0) + base64Data.charCodeAt(base64Data.length - 1)
      });
      console.log(`🔗 [DEBUG] Data URL preview: ${generatedImageUrl.substring(0, 100)}...`);
      
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

    console.log(`✅ [DEBUG] Successfully generated vertical layered flatlay composition for outfit ${index + 1}`);

    return {
      generated_image: generatedImageUrl,
      reference_images: matchedItems.map(item => item.image_url),
      item_details: matchedItems,
      item_count: matchedItems.length,
      composition_type: 'professional_flatlay_vertical',
      aspect_ratio: '1024x1536',
      debug_reason: 'success',
      debug_info: {
        base64_size: base64Data?.length || 0,
        exact_items_used: matchedItems.length,
        vertical_canvas: true,
        layered_composition: true
      }
    };

  } catch (error) {
    console.error(`❌ [DEBUG] Exception during flatlay generation:`, {
      error: error.message,
      stack: error.stack,
      name: error.name
    });
    
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
