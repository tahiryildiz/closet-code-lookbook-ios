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
    
    // Check if outfit has both üst (top) and alt (bottom) parts
    const hasTop = validItems.some(item => {
      const lowerItem = item.toLowerCase();
      return lowerItem.includes('tişört') || lowerItem.includes('gömlek') || 
             lowerItem.includes('kazak') || lowerItem.includes('sweatshirt') ||
             lowerItem.includes('bluz') || lowerItem.includes('crop') ||
             lowerItem.includes('tank') || lowerItem.includes('polo');
    });

    const hasBottom = validItems.some(item => {
      const lowerItem = item.toLowerCase();
      return lowerItem.includes('pantolon') || lowerItem.includes('şort') || 
             lowerItem.includes('etek') || lowerItem.includes('jean') ||
             lowerItem.includes('eşofman') || lowerItem.includes('pijama');
    });

    if (!hasTop) {
      validationErrors.push('INVALID: Outfit missing üst (top) clothing item');
    }
    if (!hasBottom) {
      validationErrors.push('INVALID: Outfit missing alt (bottom) clothing item');
    }

    // Be strict - only accept outfits with ALL valid items AND both top and bottom
    if (validItems.length >= 2 && validationErrors.length === 0 && hasTop && hasBottom) {
      console.log(`✅ Outfit ${i + 1} ACCEPTED (${validItems.length} valid items, has both üst and alt)`);
      
      // Create Turkish outfit name and complete styling tips
      const turkishOutfitName = generateTurkishOutfitName(occasion, i + 1);
      const completeTurkishStylingTip = generateCompleteTurkishStylingTip(outfit, occasion, timeOfDay, weather, validItems.length);
      
      const validatedOutfit = {
        ...outfit,
        name: turkishOutfitName,
        items: validItems,
        item_ids: validItemIds,
        confidence: Math.min(outfit.confidence || 8, 9), // Cap confidence for validated outfits
        styling_tips: completeTurkishStylingTip,
      };
      
      validatedOutfits.push(validatedOutfit);
    } else {
      console.log(`❌ Outfit ${i + 1} REJECTED:`);
      console.log(`Valid items (${validItems.length}):`, validItems);
      console.log(`Has top: ${hasTop}, Has bottom: ${hasBottom}`);
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
  
  // NOW GENERATE FLATLAY IMAGES FOR VALIDATED OUTFITS USING ACTUAL WARDROBE IMAGES
  console.log('🎨 Starting flatlay image generation for validated outfits...');
  
  const outfitsWithImages = await Promise.all(
    validatedOutfits.map(async (outfit, index) => {
      console.log(`🖼️ Generating flatlay image for outfit ${index + 1}: "${outfit.name}"`);
      
      try {
        // Generate professional flatlay image using actual wardrobe items
        const generatedImageUrl = await generateOutfitFlatlayWithActualItems(
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
          console.log(`⚠️ Failed to generate flatlay image for outfit ${index + 1}, using reference images`);
          // Get reference images for the matched items
          const referenceImages = outfit.items.map((itemName: string) => {
            const wardrobeItem = wardrobeItems.find(item => item.name === itemName);
            return wardrobeItem?.image_url;
          }).filter(Boolean);
          
          return {
            ...outfit,
            reference_images: referenceImages,
            composition_type: 'reference_images',
          };
        }
      } catch (error) {
        console.error(`❌ Error generating flatlay for outfit ${index + 1}:`, error);
        // Get reference images for the matched items
        const referenceImages = outfit.items.map((itemName: string) => {
          const wardrobeItem = wardrobeItems.find(item => item.name === itemName);
          return wardrobeItem?.image_url;
        }).filter(Boolean);
        
        return {
          ...outfit,
          reference_images: referenceImages,
          composition_type: 'reference_images',
        };
      }
    })
  );
  
  console.log(`🎨 Flatlay generation complete. ${outfitsWithImages.filter(o => o.generated_image).length} outfits have images`);
  
  return outfitsWithImages;
};

const generateTurkishOutfitName = (occasion: string, index: number): string => {
  const occasionMap: { [key: string]: string[] } = {
    'work': ['İş Kombinasyonu', 'Ofis Stili', 'Profesyonel Görünüm'],
    'dinner': ['Yemek Kombinasyonu', 'Akşam Yemeği Stili', 'Şık Yemek Kıyafeti'],
    'date': ['Randevu Kombinasyonu', 'Romantik Stil', 'Buluşma Kıyafeti'],
    'shopping': ['Alışveriş Kombinasyonu', 'Rahat Şık Stil', 'Günlük Gezinti'],
    'coffee': ['Kahve Kombinasyonu', 'Rahat Buluşma', 'Günlük Şıklık'],
    'party': ['Parti Kombinasyonu', 'Eğlence Stili', 'Şık Parti Kıyafeti'],
    'casual': ['Günlük Kombinasyon', 'Rahat Stil', 'Konforlu Şıklık'],
  };

  const names = occasionMap[occasion.toLowerCase()] || occasionMap['casual'];
  return names[index % names.length] + ` ${index}`;
};

const generateCompleteTurkishStylingTip = (outfit: any, occasion: string, timeOfDay: string, weather: string, itemCount: number): string => {
  const occasionMap: { [key: string]: string } = {
    'work': 'iş',
    'business': 'iş',
    'dinner': 'yemek',
    'date': 'randevu',
    'shopping': 'alışveriş',
    'coffee': 'kahve',
    'party': 'parti',
    'casual': 'günlük'
  };

  const timeMap: { [key: string]: string } = {
    'morning': 'sabah',
    'day': 'gündüz',
    'afternoon': 'öğleden sonra',
    'evening': 'akşam',
    'night': 'gece'
  };

  const weatherMap: { [key: string]: string } = {
    'sunny': 'güneşli',
    'rainy': 'yağmurlu',
    'cold': 'soğuk',
    'warm': 'sıcak',
    'hot': 'çok sıcak',
    'mild': 'ılık',
    'cool': 'serin'
  };

  const turkishOccasion = occasionMap[occasion.toLowerCase()] || occasion;
  const turkishTime = timeMap[timeOfDay.toLowerCase()] || timeOfDay;
  const turkishWeather = weatherMap[weather.toLowerCase()] || weather;

  const completeTips = [
    `Bu ${turkishOccasion} kombinasyonu ${turkishTime} vakti için mükemmel bir seçim. ${itemCount} parçanın uyumlu karışımı ile hem rahat hem de şık görüneceksiniz. ${turkishWeather} hava koşulları için ideal olan bu kombin, tarzınızı yansıtırken konforunuzdan da ödün vermez.`,
    `${turkishTime} vakti için hazırlanmış bu ${turkishOccasion} kombininde renk uyumu ve stil dengesine dikkat edilmiştir. ${turkishWeather} havalar göz önünde bulundurularak seçilen ${itemCount} parça, size özgüven veren şık bir görünüm sağlar.`,
    `Bu ${itemCount} parçalık kombin ${turkishOccasion} aktiviteleriniz için harika bir tercihtir. ${turkishTime} vakti giyilebilecek bu stil, ${turkishWeather} hava şartlarında kendinizi hem rahat hem de şık hissetmenizi sağlayacak. Klasik ve modern detayların uyumlu birleşimi dikkat çekici.`,
    `${turkishWeather} hava koşulları için özenle seçilmiş bu ${turkishOccasion} kombinasyonu, ${turkishTime} vakti için ideal bir seçimdir. ${itemCount} parçanın uyumu size zarif ve rahat bir görünüm kazandırırken, tarzınızı da ortaya çıkarır.`
  ];

  return completeTips[Math.floor(Math.random() * completeTips.length)];
};

const generateOutfitFlatlayWithActualItems = async (
  outfit: any,
  wardrobeItems: any[],
  occasion: string,
  timeOfDay: string,
  weather: string,
  openAIApiKey: string,
  index: number
): Promise<string | null> => {
  console.log(`🎨 [generateOutfitFlatlayWithActualItems] Starting image generation for outfit: ${outfit.name}`);
  
  if (!openAIApiKey) {
    console.error('❌ [generateOutfitFlatlayWithActualItems] No OpenAI API key provided');
    return null;
  }

  try {
    // Find actual wardrobe items with their detailed descriptions
    const actualItems = outfit.items.map((itemName: string) => {
      const wardrobeItem = wardrobeItems.find(item => item.name === itemName);
      if (wardrobeItem && wardrobeItem.image_url) {
        return {
          name: wardrobeItem.name,
          image_url: wardrobeItem.image_url,
          category: wardrobeItem.category,
          primary_color: wardrobeItem.primary_color || wardrobeItem.color || 'neutral',
          material: wardrobeItem.material || 'fabric',
          detailed_description: wardrobeItem.prompt_description || wardrobeItem.image_description || `${wardrobeItem.category} in ${wardrobeItem.primary_color || wardrobeItem.color || 'neutral'}`,
          fit: wardrobeItem.fit,
          pattern_type: wardrobeItem.pattern_type,
          style_tags: wardrobeItem.style_tags || []
        };
      }
      return null;
    }).filter(Boolean);

    if (actualItems.length === 0) {
      console.log('❌ [generateOutfitFlatlayWithActualItems] No items with valid descriptions found');
      return null;
    }

    console.log(`🎯 [generateOutfitFlatlayWithActualItems] Found ${actualItems.length} items with detailed descriptions`);

    // Create highly detailed description based on actual wardrobe items with their specific details
    const detailedItemDescriptions = actualItems.map((item: any, idx: number) => {
      const colorDesc = item.primary_color ? `${item.primary_color} colored` : '';
      const materialDesc = item.material ? `made of ${item.material}` : '';
      const patternDesc = item.pattern_type && item.pattern_type !== 'solid' ? `with ${item.pattern_type} pattern` : '';
      const fitDesc = item.fit ? `with ${item.fit} fit` : '';
      
      return `${idx + 1}. ${item.detailed_description} - ${colorDesc} ${materialDesc} ${patternDesc} ${fitDesc}`.replace(/\s+/g, ' ').trim();
    }).join(', ');

    // Create a comprehensive prompt that describes the exact items from the user's wardrobe
    const prompt = `Create a professional fashion flatlay photograph showing exactly these specific clothing items from a real wardrobe: ${detailedItemDescriptions}. 

CRITICAL REQUIREMENTS:
- Show ONLY the exact items described above with their specific colors, materials, and details
- DO NOT add any items not mentioned in the description
- DO NOT change colors or materials from what's specified
- Arrange in clean vertical flatlay composition (portrait orientation)
- Clean white background with soft, even lighting
- Top-down bird's eye view perspective
- Items should be arranged as if laid out for wearing
- Professional fashion photography style with minimal shadows
- Each item should be clearly visible and recognizable

Context: This outfit is for ${occasion} occasion, ${timeOfDay} time, ${weather} weather
Style: Clean, minimalist, professional flatlay photography
Size: 1024x1536 (vertical orientation)

Focus on accuracy to the actual wardrobe items described.`;

    console.log(`🤖 [generateOutfitFlatlayWithActualItems] Making OpenAI image generation request with detailed item descriptions...`);

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
        size: '1024x1536',
        quality: 'high'
      }),
    });

    console.log(`📡 [generateOutfitFlatlayWithActualItems] OpenAI Image API response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ [generateOutfitFlatlayWithActualItems] OpenAI Image API error (${response.status}): ${errorText}`);
      return null;
    }

    const data = await response.json();
    console.log(`✅ [generateOutfitFlatlayWithActualItems] OpenAI Image API response received successfully`);

    if (data.data && data.data[0] && data.data[0].b64_json) {
      const base64Image = `data:image/png;base64,${data.data[0].b64_json}`;
      console.log(`🎨 [generateOutfitFlatlayWithActualItems] Successfully generated base64 image with specific wardrobe items`);
      return base64Image;
    } else {
      console.error('❌ [generateOutfitFlatlayWithActualItems] Invalid OpenAI image response structure:', data);
      return null;
    }

  } catch (error) {
    console.error(`❌ [generateOutfitFlatlayWithActualItems] Error in image generation:`, error);
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
      const turkishOutfitName = generateTurkishOutfitName(occasion, i + 1);
      const completeTurkishStylingTip = generateCompleteTurkishStylingTip(
        { items: selectedItems.map(item => item.name) }, 
        occasion, 
        timeOfDay, 
        weather, 
        selectedItems.length
      );

      const outfit = {
        id: i + 1,
        name: turkishOutfitName,
        items: selectedItems.map(item => item.name),
        item_ids: selectedItems.map(item => item.id),
        confidence: 7 + Math.floor(Math.random() * 2),
        styling_tips: completeTurkishStylingTip,
        occasion: occasion,
        reference_images: selectedItems.map(item => item.image_url).filter(Boolean)
      };
      
      outfits.push(outfit);
    }
  }
  
  console.log(`✅ Generated ${outfits.length} wardrobe-based fallback outfits`);
  return outfits;
};
