
import { validateOutfitAgainstWardrobe, detectDuplicateOutfits } from './validation.ts';
import { generateOutfitImage } from './image-generator.ts';

export const processValidatedOutfits = async (
  outfits: any[], 
  wardrobeItems: any[], 
  occasion: string, 
  timeOfDay: string, 
  weather: string, 
  openAIApiKey: string
) => {
  console.log('🔍 Starting strict outfit validation and flatlay generation process...');
  console.log('Input outfits:', outfits.map(o => ({ name: o.name, items: o.items })));
  
  // Step 1: STRICT validation - reject ANY outfit with non-wardrobe items
  const validatedOutfits = [];
  
  for (let i = 0; i < outfits.length; i++) {
    const outfit = outfits[i];
    console.log(`\n🔍 Validating outfit ${i + 1}: "${outfit.name}"`);
    console.log('Items:', outfit.items);
    
    const validation = validateOutfitAgainstWardrobe(outfit, wardrobeItems);
    
    if (validation.isValid) {
      console.log(`✅ Outfit ${i + 1} APPROVED`);
      validatedOutfits.push(outfit);
    } else {
      console.log(`❌ Outfit ${i + 1} REJECTED:`);
      validation.errors.forEach(error => console.log(`   - ${error}`));
    }
  }
  
  if (validatedOutfits.length === 0) {
    console.log('❌ ALL AI OUTFITS REJECTED - Contains hallucinated items');
    throw new Error('All AI outfits contain items not in wardrobe');
  }
  
  console.log(`✅ ${validatedOutfits.length} outfits passed strict validation`);
  
  // Step 2: Remove duplicates
  const duplicateIndices = detectDuplicateOutfits(validatedOutfits);
  const uniqueOutfits = validatedOutfits.filter((_, index) => !duplicateIndices.includes(index));
  
  console.log(`📝 Removed ${duplicateIndices.length} duplicate outfits`);
  console.log(`📝 Processing ${uniqueOutfits.length} unique, validated outfits`);
  
  // Step 3: Process final outfits with flatlay generation and enhanced styling tips
  const processedOutfits = await Promise.all(
    uniqueOutfits.slice(0, 3).map(async (outfit: any, index: number) => {
      console.log(`\n🎨 Processing final outfit ${index + 1}:`, outfit.items);
      
      // Find exact wardrobe matches for each item
      const exactMatches = outfit.items.map((itemName: string) => {
        const match = wardrobeItems.find((item: any) => {
          const wardrobeName = (item.name || item.subcategory || '').trim();
          return wardrobeName === itemName.trim();
        });
        return match;
      }).filter(Boolean);
      
      if (exactMatches.length !== outfit.items.length) {
        console.log(`⚠️  Warning: Could not find exact matches for all items in outfit ${index + 1}`);
        return null;
      }
      
      const itemIds = exactMatches.map(item => item.id);
      const exactItemNames = exactMatches.map(item => item.name || item.subcategory);
      
      console.log(`✅ Exact matches found:`, exactItemNames);
      
      // Generate flatlay composition using reference images
      const flatlayData = await generateOutfitImage(
        { ...outfit, items: exactItemNames }, 
        wardrobeItems, 
        occasion, 
        timeOfDay, 
        weather, 
        openAIApiKey, 
        index
      );
      
      console.log(`🖼️  Flatlay generation result: ${flatlayData.composition_type}`);
      
      // Generate enhanced styling tips with accessory suggestions
      const enhancedStylingTips = await generateEnhancedStylingTips(
        outfit.styling_tips,
        exactMatches,
        occasion,
        timeOfDay,
        weather,
        openAIApiKey
      );
      
      return {
        ...outfit,
        items: exactItemNames,
        item_ids: itemIds,
        generated_image: flatlayData.generated_image,
        reference_images: flatlayData.reference_images,
        item_details: flatlayData.item_details,
        occasion: occasion,
        validated: true,
        validation_passed: true,
        uses_reference_images: true,
        composition_type: flatlayData.composition_type,
        item_count: flatlayData.item_count,
        aspect_ratio: flatlayData.aspect_ratio,
        styling_tips: enhancedStylingTips,
        // Legacy compatibility
        images: flatlayData.generated_image ? [flatlayData.generated_image] : flatlayData.reference_images,
        primary_image: flatlayData.generated_image,
        product_images: flatlayData.reference_images
      };
    })
  );
  
  const finalOutfits = processedOutfits.filter(Boolean);
  
  console.log(`🎉 Successfully processed ${finalOutfits.length} validated outfits with vertical flatlay compositions`);
  finalOutfits.forEach((outfit, index) => {
    console.log(`   Outfit ${index + 1}: ${outfit.composition_type} - ${outfit.item_count} items - ${outfit.aspect_ratio || 'default ratio'}`);
  });
  
  return finalOutfits;
};

// Enhanced styling tips generator with accessory suggestions
const generateEnhancedStylingTips = async (
  originalTips: string,
  outfitItems: any[],
  occasion: string,
  timeOfDay: string,
  weather: string,
  openAIApiKey: string
): Promise<string> => {
  try {
    const itemDescriptions = outfitItems.map(item => 
      `${item.name} (${item.category}, ${item.primary_color || item.color})`
    ).join(', ');

    const enhancementPrompt = `Enhance this outfit styling tip with 1-2 specific accessory suggestions:

CURRENT OUTFIT: ${itemDescriptions}
CURRENT TIP: ${originalTips}
OCCASION: ${occasion}
TIME: ${timeOfDay}
WEATHER: ${weather}

Please rewrite the styling tip and add 1-2 specific accessory suggestions (like belts, watches, shoes, bags) that would elevate this outfit. Keep it concise and practical. Write in Turkish.

Example format: "Bu kombini tamamlamak için kahverengi deri kemer ve spor ayakkabı ekleyebilirsiniz. Serin havalarda ince bir hırka da güzel bir dokunuş olacaktır."`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Sen profesyonel bir stil danışmanısın. Kısa ve pratik aksesuar önerileri veriyorsun.' },
          { role: 'user', content: enhancementPrompt }
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const enhancedTips = data.choices[0].message.content.trim();
      console.log(`✨ [DEBUG] Enhanced styling tips generated`);
      return enhancedTips;
    } else {
      console.log(`⚠️  [DEBUG] Failed to enhance styling tips, using original`);
      return originalTips;
    }
  } catch (error) {
    console.log(`⚠️  [DEBUG] Error enhancing styling tips:`, error.message);
    return originalTips;
  }
};
