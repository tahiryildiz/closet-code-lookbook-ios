
import { validateRequestData } from './validation.ts';
import { generateEnhancedPrompt } from './enhanced-prompt-generator.ts';
import { processValidatedOutfits } from './enhanced-processor.ts';
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
    
    // Make the OpenAI API call directly
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional fashion stylist with expertise in color theory, pattern mixing, and design coordination. Return only valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (response.ok) {
      console.log('✅ Enhanced OpenAI request successful');
      const data = await response.json();
      const generatedOutfits = data.choices[0].message.content;
      
      try {
        const parsedOutfits = JSON.parse(generatedOutfits);
        
        // Process the outfits with validation and image generation
        const processedOutfits = await processValidatedOutfits(
          parsedOutfits,
          wardrobeItems,
          occasion,
          timeOfDay,
          weather,
          openAIApiKey
        );
        
        return { outfits: processedOutfits };
        
      } catch (parseError) {
        console.log('⚠️ JSON parsing failed, using advanced fallback');
        const fallbackOutfits = generateAdvancedFallbackOutfits(wardrobeItems, occasion, timeOfDay, weather, isPremium);
        return { outfits: fallbackOutfits };
      }
      
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
