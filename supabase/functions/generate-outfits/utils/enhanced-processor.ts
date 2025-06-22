
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
  console.log('Starting outfit validation process...');
  
  // Step 1: Validate each outfit against wardrobe
  const validatedOutfits = outfits.filter((outfit, index) => {
    console.log(`Validating outfit ${index + 1}:`, outfit.items);
    
    const validation = validateOutfitAgainstWardrobe(outfit, wardrobeItems);
    
    if (!validation.isValid) {
      console.log(`Outfit ${index + 1} REJECTED:`, validation.errors);
      return false;
    }
    
    console.log(`Outfit ${index + 1} VALIDATED`);
    return true;
  });
  
  if (validatedOutfits.length === 0) {
    console.log('No valid outfits found - all contained hallucinated items');
    throw new Error('AI generated invalid items not in wardrobe');
  }
  
  // Step 2: Remove duplicate/too similar outfits
  const duplicateIndices = detectDuplicateOutfits(validatedOutfits);
  const uniqueOutfits = validatedOutfits.filter((_, index) => !duplicateIndices.includes(index));
  
  console.log(`Removed ${duplicateIndices.length} duplicate outfits`);
  console.log(`Processing ${uniqueOutfits.length} unique, validated outfits`);
  
  // Step 3: Process with exact name matching
  const processedOutfits = await Promise.all(
    uniqueOutfits.slice(0, 3).map(async (outfit: any, index: number) => {
      // Find exact wardrobe matches for each item
      const exactMatches = outfit.items.map((itemName: string) => {
        const match = wardrobeItems.find((item: any) => {
          const wardrobeName = item.name || item.subcategory || '';
          return wardrobeName.toLowerCase().trim() === itemName.toLowerCase().trim() ||
                 wardrobeName.toLowerCase().includes(itemName.toLowerCase()) ||
                 itemName.toLowerCase().includes(wardrobeName.toLowerCase());
        });
        return match;
      }).filter(Boolean);
      
      const itemIds = exactMatches.map(item => item.id);
      const exactItemNames = exactMatches.map(item => item.name || item.subcategory);
      
      // Generate professional flatlay image
      const generatedImageUrl = await generateOutfitImage(
        { ...outfit, items: exactItemNames }, 
        wardrobeItems, 
        occasion, 
        timeOfDay, 
        weather, 
        openAIApiKey, 
        index
      );
      
      return {
        ...outfit,
        items: exactItemNames,
        item_ids: itemIds,
        images: generatedImageUrl ? [generatedImageUrl] : [],
        occasion: occasion,
        generated_image: generatedImageUrl,
        validated: true
      };
    })
  );
  
  console.log(`Successfully processed ${processedOutfits.length} validated outfits`);
  return processedOutfits;
};
