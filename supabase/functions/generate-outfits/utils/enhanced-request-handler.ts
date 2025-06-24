
import { validateRequestData } from './validation.ts';
import { generateEnhancedPrompt } from './enhanced-prompt-generator.ts';
import { handleOpenAIRequest } from './enhanced-processor.ts';
import { generateAdvancedFallbackOutfits } from './advanced-fallback-generator.ts';

export async function handleEnhancedOutfitGeneration(requestData: any, openAIApiKey: string) {
  console.log('🎯 Starting enhanced outfit generation with advanced metadata');
  
  // Validate request data
  const validationResult = validateRequestData(requestData);
  if (!validationResult.isValid) {
    throw new Error(`Validation failed: ${validationResult.errors.join(', ')}`);
  }

  const { wardrobeItems, occasion, timeOfDay, weather, userGender, isPremium = false } = requestData;
  
  console.log(`📊 Processing ${wardrobeItems.length} wardrobe items with rich metadata`);
  console.log(`🎨 Available metadata fields: ${Object.keys(wardrobeItems[0] || {}).join(', ')}`);
  console.log(`👤 User type: ${isPremium ? 'Premium' : 'Free'}`);

  try {
    // Generate enhanced prompt with advanced styling rules
    const prompt = generateEnhancedPrompt(wardrobeItems, occasion, timeOfDay, weather, userGender, isPremium);
    
    console.log('🤖 Attempting OpenAI request with enhanced prompt');
    const response = await handleOpenAIRequest(prompt, openAIApiKey);
    
    if (response.success) {
      console.log('✅ Enhanced OpenAI request successful');
      
      // Validate that generated outfits only use available items
      const generatedOutfits = response.data.outfits || [];
      const availableItemNames = wardrobeItems.map((item: any) => item.name.toLowerCase());
      
      const validatedOutfits = generatedOutfits.map((outfit: any) => {
        // Ensure all outfit items exist in user's wardrobe
        const validItems = outfit.items.filter((itemName: string) => 
          availableItemNames.some(available => 
            available.includes(itemName.toLowerCase()) || 
            itemName.toLowerCase().includes(available)
          )
        );
        
        // Map to correct item IDs
        const validItemIds = validItems.map((itemName: string) => {
          const matchedItem = wardrobeItems.find((item: any) => 
            item.name.toLowerCase().includes(itemName.toLowerCase()) ||
            itemName.toLowerCase().includes(item.name.toLowerCase())
          );
          return matchedItem ? matchedItem.id : null;
        }).filter(Boolean);
        
        return {
          ...outfit,
          items: validItems,
          item_ids: validItemIds
        };
      }).filter((outfit: any) => outfit.items.length >= 3);
      
      return { outfits: validatedOutfits };
    } else {
      console.log('⚠️ OpenAI request failed, using advanced fallback');
      const fallbackOutfits = generateAdvancedFallbackOutfits(wardrobeItems, occasion, timeOfDay, weather, isPremium);
      return { outfits: fallbackOutfits };
    }
    
  } catch (error) {
    console.error('❌ Error in enhanced outfit generation:', error);
    
    // Fallback to advanced local generation
    console.log('🔄 Using advanced fallback outfit generation');
    const fallbackOutfits = generateAdvancedFallbackOutfits(wardrobeItems, occasion, timeOfDay, weather, isPremium);
    return { outfits: fallbackOutfits };
  }
}
