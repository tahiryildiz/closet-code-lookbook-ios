
import { validateRequestData } from './validation.ts';
import { generatePrompt } from './prompt-generator.ts';
import { handleOpenAIRequest } from './enhanced-processor.ts';
import { generateFallbackOutfits } from './fallback-generator.ts';

export async function handleOutfitGeneration(requestData: any, openAIApiKey: string) {
  console.log('🎯 Starting outfit generation process');
  
  // Validate request data
  const validationResult = validateRequestData(requestData);
  if (!validationResult.isValid) {
    throw new Error(`Validation failed: ${validationResult.errors.join(', ')}`);
  }

  const { wardrobeItems, occasion, timeOfDay, weather, userGender, isPremium = false } = requestData;
  
  console.log(`📊 Processing ${wardrobeItems.length} wardrobe items for ${occasion} occasion`);
  console.log(`👤 User type: ${isPremium ? 'Premium' : 'Free'}`);

  try {
    // Generate the prompt for outfit combinations
    const prompt = generatePrompt(wardrobeItems, occasion, timeOfDay, weather, userGender, isPremium);
    
    console.log('🤖 Attempting OpenAI request');
    const response = await handleOpenAIRequest(prompt, openAIApiKey);
    
    if (response.success) {
      console.log('✅ OpenAI request successful');
      return response.data;
    } else {
      console.log('⚠️ OpenAI request failed, using fallback');
      const fallbackOutfits = generateFallbackOutfits(wardrobeItems, occasion, timeOfDay, weather, isPremium);
      return { outfits: fallbackOutfits };
    }
    
  } catch (error) {
    console.error('❌ Error in outfit generation:', error);
    
    // Fallback to local generation
    console.log('🔄 Using fallback outfit generation');
    const fallbackOutfits = generateFallbackOutfits(wardrobeItems, occasion, timeOfDay, weather, isPremium);
    return { outfits: fallbackOutfits };
  }
}
