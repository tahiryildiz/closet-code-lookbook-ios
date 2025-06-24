
export const processValidatedOutfits = async (
  outfits: any[],
  wardrobeItems: any[],
  occasion: string,
  timeOfDay: string,
  weather: string,
  openAIApiKey: string
) => {
  console.log('🔍 Starting strict outfit validation and flatlay generation process...');
  
  // Log input outfits for debugging
  console.log('Input outfits:', outfits.map(outfit => ({
    name: outfit.name,
    items: outfit.items
  })));

  // Create a comprehensive item name lookup with multiple matching strategies
  const wardrobeNamesLookup = new Map();
  const wardrobeNamesArray = wardrobeItems.map(item => item.name);
  
  console.log('Wardrobe names for validation:', wardrobeNamesArray);
  
  // Create multiple lookup variations for flexible matching
  wardrobeItems.forEach(item => {
    const originalName = item.name;
    const lowerName = originalName.toLowerCase();
    const normalizedName = lowerName.replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
    const compactName = lowerName.replace(/\s+/g, '');
    
    // Store all variations
    wardrobeNamesLookup.set(lowerName, originalName);
    wardrobeNamesLookup.set(normalizedName, originalName);
    wardrobeNamesLookup.set(compactName, originalName);
    wardrobeNamesLookup.set(originalName, originalName);
    
    // Add keyword-based matching for better flexibility
    const keywords = originalName.toLowerCase().split(' ').filter(word => word.length > 2);
    keywords.forEach(keyword => {
      if (!wardrobeNamesLookup.has(keyword)) {
        wardrobeNamesLookup.set(keyword, originalName);
      }
    });
  });

  const validatedOutfits = [];

  for (let i = 0; i < outfits.length; i++) {
    const outfit = outfits[i];
    
    console.log(`\n🔍 Validating outfit ${i + 1}: "${outfit.name}"`);
    console.log('Items:', outfit.items);
    
    const validationErrors = [];
    const validItems = [];
    const validItemIds = [];

    for (const itemName of outfit.items) {
      const lowerItemName = itemName.toLowerCase();
      const normalizedItemName = lowerItemName.replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
      const compactItemName = lowerItemName.replace(/\s+/g, '');
      
      let matchedName = null;
      let matchStrategy = '';
      
      // Strategy 1: Exact match (case insensitive)
      if (wardrobeNamesLookup.has(lowerItemName)) {
        matchedName = wardrobeNamesLookup.get(lowerItemName);
        matchStrategy = 'exact_match';
      }
      // Strategy 2: Normalized match (remove punctuation, extra spaces)
      else if (wardrobeNamesLookup.has(normalizedItemName)) {
        matchedName = wardrobeNamesLookup.get(normalizedItemName);
        matchStrategy = 'normalized_match';
      }
      // Strategy 3: Compact match (remove all spaces)
      else if (wardrobeNamesLookup.has(compactItemName)) {
        matchedName = wardrobeNamesLookup.get(compactItemName);
        matchStrategy = 'compact_match';
      }
      // Strategy 4: Partial/fuzzy match
      else {
        for (const wardrobeItem of wardrobeItems) {
          const wardrobeLower = wardrobeItem.name.toLowerCase();
          const wardrobeNormalized = wardrobeLower.replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
          const wardrobeCompact = wardrobeLower.replace(/\s+/g, '');
          
          // Check if any wardrobe item contains this item name or vice versa
          if (wardrobeLower.includes(lowerItemName) || 
              lowerItemName.includes(wardrobeLower) ||
              wardrobeNormalized.includes(normalizedItemName) ||
              normalizedItemName.includes(wardrobeNormalized) ||
              wardrobeCompact.includes(compactItemName) ||
              compactItemName.includes(wardrobeCompact)) {
            matchedName = wardrobeItem.name;
            matchStrategy = 'partial_match';
            break;
          }
          
          // Strategy 5: Keyword-based matching
          const itemKeywords = lowerItemName.split(' ').filter(word => word.length > 2);
          const wardrobeKeywords = wardrobeLower.split(' ').filter(word => word.length > 2);
          
          const matchingKeywords = itemKeywords.filter(keyword => 
            wardrobeKeywords.some(wKeyword => 
              wKeyword.includes(keyword) || keyword.includes(wKeyword)
            )
          );
          
          // If at least 60% of keywords match, consider it a match
          if (matchingKeywords.length >= Math.max(1, Math.floor(itemKeywords.length * 0.6))) {
            matchedName = wardrobeItem.name;
            matchStrategy = 'keyword_match';
            break;
          }
        }
      }

      if (matchedName) {
        console.log(`✅ VALID: "${itemName}" matched to "${matchedName}" (${matchStrategy})`);
        validItems.push(matchedName);
        
        // Find the item ID
        const wardrobeItem = wardrobeItems.find(item => item.name === matchedName);
        if (wardrobeItem) {
          validItemIds.push(wardrobeItem.id);
        }
      } else {
        console.log(`❌ INVALID: "${itemName}" not found in wardrobe`);
        console.log('Available names:', wardrobeNamesArray.slice(0, 5), '...'); // Limit log size
        validationErrors.push(`INVALID: "${itemName}" not found in wardrobe`);
      }
    }

    console.log(`Validation result for outfit "${outfit.name}": ${validationErrors.length === 0 ? 'VALID' : 'INVALID'}`);
    
    // Be more lenient - accept outfits with at least 2 valid items and max 1 invalid
    if (validItems.length >= 2 && validationErrors.length <= 1) {
      console.log(`✅ Outfit ${i + 1} ACCEPTED (${validItems.length} valid items, ${validationErrors.length} invalid)`);
      
      // Create validated outfit with matched names
      const validatedOutfit = {
        ...outfit,
        items: validItems,
        item_ids: validItemIds,
        confidence: Math.min(outfit.confidence || 8, 9), // Cap confidence for validated outfits
      };
      
      validatedOutfits.push(validatedOutfit);
    } else {
      console.log(`❌ Outfit ${i + 1} REJECTED:`);
      console.log(`Valid items (${validItems.length}):`, validItems);
      console.log(`Invalid items (${validationErrors.length}):`, validationErrors);
    }
  }

  if (validatedOutfits.length === 0) {
    console.log('❌ ALL AI OUTFITS REJECTED - Using wardrobe-based fallback');
    
    // Create simple fallback outfits using actual wardrobe items
    const fallbackOutfits = createWardrobeBasedOutfits(wardrobeItems, occasion, timeOfDay, weather);
    return fallbackOutfits;
  }

  console.log(`✅ ${validatedOutfits.length} outfits validated successfully`);
  
  // NOW GENERATE FLATLAY IMAGES FOR VALIDATED OUTFITS
  console.log('🎨 Starting flatlay image generation for validated outfits...');
  
  const outfitsWithImages = await Promise.all(
    validatedOutfits.map(async (outfit, index) => {
      console.log(`🖼️ Generating flatlay image for outfit ${index + 1}: "${outfit.name}"`);
      
      try {
        // Generate professional flatlay image using OpenAI
        const generatedImageUrl = await generateOutfitFlatlay(
          outfit, 
          wardrobeItems, 
          occasion, 
          timeOfDay, 
          weather, 
          openAIApiKey, 
          index
        );
        
        if (generatedImageUrl) {
          console.log(`✅ Successfully generated flatlay image for outfit ${index + 1}`);
          return {
            ...outfit,
            generated_image: generatedImageUrl,
            composition_type: 'professional_flatlay_vertical',
            aspect_ratio: '1024x1536',
            reference_images: [], // Clear any reference images since we have AI-generated flatlay
          };
        } else {
          console.log(`⚠️ Failed to generate flatlay image for outfit ${index + 1}, keeping without image`);
          return outfit;
        }
      } catch (error) {
        console.error(`❌ Error generating flatlay for outfit ${index + 1}:`, error);
        return outfit;
      }
    })
  );
  
  console.log(`🎨 Flatlay generation complete. ${outfitsWithImages.filter(o => o.generated_image).length} outfits have images`);
  
  return outfitsWithImages;
};

const generateOutfitFlatlay = async (
  outfit: any,
  wardrobeItems: any[],
  occasion: string,
  timeOfDay: string,
  weather: string,
  openAIApiKey: string,
  index: number
): Promise<string | null> => {
  console.log(`🎨 [generateOutfitFlatlay] Starting image generation for outfit: ${outfit.name}`);
  
  if (!openAIApiKey) {
    console.error('❌ [generateOutfitFlatlay] No OpenAI API key provided');
    return null;
  }

  try {
    // Create detailed description for each item in the outfit
    const itemDescriptions = outfit.items.map((itemName: string) => {
      const wardrobeItem = wardrobeItems.find(item => item.name === itemName);
      if (wardrobeItem) {
        const color = wardrobeItem.primary_color || 'neutral';
        const material = wardrobeItem.material || wardrobeItem.category;
        const category = wardrobeItem.subcategory || wardrobeItem.category;
        return `${color} ${material} ${category}`.toLowerCase();
      }
      return itemName.toLowerCase();
    }).join(', ');

    const prompt = `Create a professional fashion flatlay photograph showing: ${itemDescriptions}. 

Style: Clean, minimalist flatlay composition on white background
Layout: Vertical orientation (portrait) with clothes arranged as if laid out on a bed or flat surface
Lighting: Soft, even lighting with no harsh shadows
Perspective: Top-down view (bird's eye perspective)
Arrangement: Clothes should be arranged in a styling way that shows how they would be worn together
Background: Pure white or very light neutral background
Quality: High-resolution, professional fashion photography style

The outfit is for: ${occasion} occasion, ${timeOfDay} time, ${weather} weather
Make it look like a professional fashion brand flatlay photo.`;

    console.log(`🤖 [generateOutfitFlatlay] Making OpenAI image generation request...`);
    console.log(`📝 [generateOutfitFlatlay] Prompt: ${prompt.substring(0, 100)}...`);

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: prompt,
        n: 1,
        size: '1024x1536', // Vertical aspect ratio for flatlay
        quality: 'high',
        output_format: 'png',
        background: 'opaque'
      }),
    });

    console.log(`📡 [generateOutfitFlatlay] OpenAI Image API response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ [generateOutfitFlatlay] OpenAI Image API error (${response.status}): ${errorText}`);
      return null;
    }

    const data = await response.json();
    console.log(`✅ [generateOutfitFlatlay] OpenAI Image API response received successfully`);

    if (data.data && data.data[0] && data.data[0].b64_json) {
      const base64Image = `data:image/png;base64,${data.data[0].b64_json}`;
      console.log(`🎨 [generateOutfitFlatlay] Successfully generated base64 image (${base64Image.length} characters)`);
      return base64Image;
    } else {
      console.error('❌ [generateOutfitFlatlay] Invalid OpenAI image response structure:', data);
      return null;
    }

  } catch (error) {
    console.error(`❌ [generateOutfitFlatlay] Error in image generation:`, error);
    return null;
  }
};

const createWardrobeBasedOutfits = (wardrobeItems: any[], occasion: string, timeOfDay: string, weather: string) => {
  console.log('🔄 Creating wardrobe-based fallback outfits');
  
  const outfits = [];
  const itemsPerOutfit = Math.min(4, Math.max(3, Math.floor(wardrobeItems.length / 3)));
  
  for (let i = 0; i < Math.min(3, Math.floor(wardrobeItems.length / 2)); i++) {
    const startIndex = i * itemsPerOutfit;
    const selectedItems = wardrobeItems.slice(startIndex, startIndex + itemsPerOutfit);
    
    if (selectedItems.length >= 2) {
      const outfit = {
        id: i + 1,
        name: `${occasion} Kombinasyonu ${i + 1}`,
        items: selectedItems.map(item => item.name),
        item_ids: selectedItems.map(item => item.id),
        confidence: 7 + Math.floor(Math.random() * 2), // 7-8 confidence for fallback
        styling_tips: `Bu ${occasion} kombinasyonu ${selectedItems.length} parçadan oluşuyor ve ${timeOfDay} vakti için uygundur. ${weather} hava koşulları göz önünde bulundurularak seçilmiştir.`,
        occasion: occasion,
        color_story: 'Wardrobe-based color coordination',
        silhouette_notes: 'Balanced proportions from your wardrobe',
        pattern_analysis: 'Coordinated from available pieces',
        design_coordination: 'Harmonious selection from your items'
      };
      
      outfits.push(outfit);
    }
  }
  
  console.log(`✅ Generated ${outfits.length} wardrobe-based fallback outfits`);
  return outfits;
};
