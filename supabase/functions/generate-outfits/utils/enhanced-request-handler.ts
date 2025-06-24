
import { validateEnvironment } from './config.ts';
import { processOutfits } from './outfit-processor.ts';
import { generateEnhancedOutfitPrompt } from './enhanced-prompt-generator.ts';

export const handleEnhancedOutfitGeneration = async (requestData: any, openAIApiKey: string) => {
  console.log('🎯 Starting enhanced outfit generation with sophisticated styling intelligence');
  
  const { 
    wardrobeItems, 
    occasion, 
    timeOfDay, 
    weather, 
    userGender, 
    isPremium,
    userId 
  } = requestData;

  if (!wardrobeItems || wardrobeItems.length === 0) {
    throw new Error('No wardrobe items provided');
  }

  if (!userId) {
    throw new Error('User ID is required');
  }

  // Get Supabase environment variables for storage operations
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase configuration for storage operations');
  }

  try {
    // Generate enhanced outfit combinations using AI
    const enhancedPrompt = generateEnhancedOutfitPrompt(
      wardrobeItems,
      occasion,
      timeOfDay,
      weather,
      userGender,
      isPremium
    );

    console.log('🤖 Making OpenAI API call for outfit generation...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a professional fashion stylist and outfit coordinator with expertise in color theory, seasonal styling, and occasion-appropriate dressing.'
          },
          {
            role: 'user',
            content: enhancedPrompt
          }
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const completion = await response.json();
    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No outfit suggestions received from AI');
    }

    console.log('✅ Received outfit suggestions from AI');

    // Parse the AI response
    let outfits;
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        outfits = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No valid JSON found in AI response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      throw new Error('Invalid outfit suggestions format');
    }

    if (!Array.isArray(outfits) || outfits.length === 0) {
      throw new Error('No valid outfits generated');
    }

    console.log(`🎨 Processing ${outfits.length} outfits with advanced image generation...`);

    // Process outfits with enhanced image generation and storage
    const processedOutfits = await processOutfits(
      outfits,
      wardrobeItems,
      occasion,
      timeOfDay,
      weather,
      openAIApiKey,
      userId,
      supabaseUrl,
      supabaseServiceKey
    );

    console.log('✅ Enhanced outfit generation completed successfully');

    return {
      outfits: processedOutfits,
      totalGenerated: processedOutfits.length,
      enhancedFeatures: {
        advancedColorTheory: true,
        seasonalStyling: true,
        patternMixing: true,
        designCoordination: true,
        professionalFlatlayImages: true,
        cloudStorage: true
      }
    };

  } catch (error) {
    console.error('❌ Error in enhanced outfit generation:', error);
    throw error;
  }
};
