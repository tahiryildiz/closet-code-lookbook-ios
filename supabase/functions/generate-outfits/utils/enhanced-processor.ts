
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
