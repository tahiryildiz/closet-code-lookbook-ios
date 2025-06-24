
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

  // Verify OpenAI API key
  if (!openAIApiKey) {
    console.error('❌ OpenAI API key is missing');
    console.log('🔄 Using advanced fallback due to missing API key');
    const fallbackOutfits = generateAdvancedFallbackOutfits(wardrobeItems, occasion, timeOfDay, weather, isPremium);
    return { outfits: fallbackOutfits };
  }

  try {
    // Generate enhanced prompt with advanced styling rules
    const prompt = generateEnhancedPrompt(wardrobeItems, occasion, timeOfDay, weather, userGender, isPremium);
    
    console.log('🤖 Making OpenAI API request with enhanced prompt');
    console.log(`📝 Prompt length: ${prompt.length} characters`);
    
    // Make the OpenAI API call directly with detailed logging
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

    console.log(`📡 OpenAI API response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ OpenAI API error (${response.status}): ${errorText}`);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ OpenAI API response received successfully');
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('❌ Invalid OpenAI response structure:', data);
      throw new Error('Invalid OpenAI response structure');
    }
    
    const generatedOutfits = data.choices[0].message.content;
    console.log(`📝 Generated content length: ${generatedOutfits.length} characters`);
    console.log(`📦 Raw AI response preview: ${generatedOutfits.substring(0, 200)}...`);
    
    try {
      const parsedOutfits = JSON.parse(generatedOutfits);
      console.log(`🎯 Successfully parsed ${parsedOutfits.length} AI-generated outfits`);
      
      // Process the outfits with validation and image generation
      const processedOutfits = await processValidatedOutfits(
        parsedOutfits,
        wardrobeItems,
        occasion,
        timeOfDay,
        weather,
        openAIApiKey
      );
      
      console.log(`✅ Final processed outfits count: ${processedOutfits.length}`);
      return { outfits: processedOutfits };
      
    } catch (parseError) {
      console.error('❌ JSON parsing failed:', parseError);
      console.error('🔍 Failed content:', generatedOutfits);
      console.log('🔄 Using advanced fallback due to JSON parsing failure');
      const fallbackOutfits = generateAdvancedFallbackOutfits(wardrobeItems, occasion, timeOfDay, weather, isPremium);
      return { outfits: fallbackOutfits };
    }
    
  } catch (error) {
    console.error('❌ Error in enhanced outfit generation:', error);
    console.error('📊 Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack?.substring(0, 500)
    });
    
    // Fallback to advanced local generation
    console.log('🔄 Using advanced fallback outfit generation due to error');
    const fallbackOutfits = generateAdvancedFallbackOutfits(wardrobeItems, occasion, timeOfDay, weather, isPremium);
    return { outfits: fallbackOutfits };
  }
}
