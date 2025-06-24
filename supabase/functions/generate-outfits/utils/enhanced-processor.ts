
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

  // Create a more flexible item name lookup
  const wardrobeNamesLookup = new Map();
  const wardrobeNamesArray = wardrobeItems.map(item => item.name);
  
  console.log('Wardrobe names for validation:', wardrobeNamesArray);
  
  // Create multiple lookup variations for flexible matching
  wardrobeItems.forEach(item => {
    const originalName = item.name;
    const lowerName = originalName.toLowerCase();
    const normalizedName = lowerName.replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
    
    wardrobeNamesLookup.set(lowerName, originalName);
    wardrobeNamesLookup.set(normalizedName, originalName);
    wardrobeNamesLookup.set(originalName, originalName);
  });

  const validatedOutfits = [];

  for (let i = 0; i < outfits.length; i++) {
    const outfit = outfits[i];
    
    console.log(`\n🔍 Validating outfit ${i + 1}: "${outfit.name}"`);
    console.log('Items:', outfit.items);
    console.log('Outfit items to validate:', outfit.items);
    
    const validationErrors = [];
    const validItems = [];
    const validItemIds = [];

    for (const itemName of outfit.items) {
      const lowerItemName = itemName.toLowerCase();
      const normalizedItemName = lowerItemName.replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
      
      // Try different matching strategies
      let matchedName = null;
      
      // 1. Exact match (case insensitive)
      if (wardrobeNamesLookup.has(lowerItemName)) {
        matchedName = wardrobeNamesLookup.get(lowerItemName);
      }
      // 2. Normalized match (remove punctuation, extra spaces)
      else if (wardrobeNamesLookup.has(normalizedItemName)) {
        matchedName = wardrobeNamesLookup.get(normalizedItemName);
      }
      // 3. Partial match - check if any wardrobe item contains this item name
      else {
        for (const wardrobeItem of wardrobeItems) {
          const wardrobeLower = wardrobeItem.name.toLowerCase();
          const wardrobeNormalized = wardrobeLower.replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
          
          if (wardrobeLower.includes(lowerItemName) || 
              lowerItemName.includes(wardrobeLower) ||
              wardrobeNormalized.includes(normalizedItemName) ||
              normalizedItemName.includes(wardrobeNormalized)) {
            matchedName = wardrobeItem.name;
            break;
          }
        }
      }

      if (matchedName) {
        console.log(`✅ VALID: "${itemName}" matched to "${matchedName}"`);
        validItems.push(matchedName);
        
        // Find the item ID
        const wardrobeItem = wardrobeItems.find(item => item.name === matchedName);
        if (wardrobeItem) {
          validItemIds.push(wardrobeItem.id);
        }
      } else {
        console.log(`✗ INVALID: "${itemName}" not found in wardrobe`);
        console.log('Available names:', wardrobeNamesArray);
        validationErrors.push(`INVALID: "${itemName}" not found in wardrobe`);
      }
    }

    console.log(`Validation result for outfit "${outfit.name}": ${validationErrors.length === 0 ? 'VALID' : 'INVALID'}`);
    
    if (validationErrors.length === 0 && validItems.length >= 2) {
      console.log(`✅ Outfit ${i + 1} ACCEPTED`);
      
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
      console.log('Invalid items:', outfit.items.filter((_, index) => 
        !validItems.includes(outfit.items[index])
      ));
      console.log('Validation errors:', validationErrors);
      
      // Log specific rejections
      validationErrors.forEach(error => {
        console.log(`   - ${error}`);
      });
    }
  }

  if (validatedOutfits.length === 0) {
    console.log('❌ ALL AI OUTFITS REJECTED - Using wardrobe-based fallback');
    
    // Create simple fallback outfits using actual wardrobe items
    const fallbackOutfits = createWardrobeBasedOutfits(wardrobeItems, occasion, timeOfDay, weather);
    return fallbackOutfits;
  }

  console.log(`✅ ${validatedOutfits.length} outfits validated successfully`);
  return validatedOutfits;
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
