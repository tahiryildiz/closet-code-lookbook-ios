
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
  console.log('🔍 Starting strict outfit validation process...');
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
      // COMPLETELY REJECT invalid outfits - no partial fixes
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
  
  // Step 3: Process final outfits with complete product image collection
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
        return null; // Skip this outfit
      }
      
      const itemIds = exactMatches.map(item => item.id);
      const exactItemNames = exactMatches.map(item => item.name || item.subcategory);
      
      console.log(`✅ Exact matches found:`, exactItemNames);
      
      // Collect ALL product images for complete outfit visualization
      const outfitImageData = await generateOutfitImage(
        { ...outfit, items: exactItemNames }, 
        wardrobeItems, 
        occasion, 
        timeOfDay, 
        weather, 
        openAIApiKey, 
        index
      );
      
      console.log(`🖼️  Complete outfit images collected: ${outfitImageData.item_count} items`);
      
      return {
        ...outfit,
        items: exactItemNames,
        item_ids: itemIds,
        images: outfitImageData.all_images, // ALL product images for complete outfit
        primary_image: outfitImageData.primary_image, // Primary image for backwards compatibility
        product_images: outfitImageData.all_images, // Complete set of product images
        item_details: outfitImageData.item_details, // Full item details with images
        occasion: occasion,
        generated_image: outfitImageData.primary_image, // For backwards compatibility
        validated: true,
        validation_passed: true,
        uses_real_images: true,
        complete_outfit_images: true, // Flag indicating we have all item images
        image_count: outfitImageData.item_count
      };
    })
  );
  
  const finalOutfits = processedOutfits.filter(Boolean);
  
  console.log(`🎉 Successfully processed ${finalOutfits.length} validated outfits with complete product image sets`);
  finalOutfits.forEach((outfit, index) => {
    console.log(`   Outfit ${index + 1}: ${outfit.image_count} product images collected`);
  });
  
  return finalOutfits;
};
