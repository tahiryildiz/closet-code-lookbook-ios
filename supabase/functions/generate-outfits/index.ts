
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createWardrobeDescription } from './utils/item-description.ts';
import { createOutfitPrompt } from './utils/prompt-generator.ts';
import { processValidatedOutfits } from './utils/enhanced-processor.ts';
import { generateFallbackOutfits } from './utils/fallback-generator.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { occasion, timeOfDay, weather, wardrobeItems } = await req.json();

    console.log('KombinAI: Strict outfit generation started', { 
      occasion, timeOfDay, weather, wardrobeCount: wardrobeItems?.length 
    });

    if (!occasion || !timeOfDay || !weather) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!wardrobeItems || wardrobeItems.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No wardrobe items provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create strict prompt with exact item list
    const prompt = createOutfitPrompt(wardrobeItems, occasion, timeOfDay, weather);

    console.log('KombinAI: Sending strict validation prompt to AI...');

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
            content: 'Sen KombinAI profesyonel stil danışmanısın. SADECE verilen gardroba ürünlerini kullan. Başka ürün EKLEME. Ürün isimlerini TAM OLARAK kullan. SADECE geçerli JSON döndür.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3, // Lower temperature for more consistent results
        max_tokens: 1500,
      }),
    });

    console.log('AI response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    let generatedContent = data.choices[0].message.content;

    // Clean JSON response
    generatedContent = generatedContent.trim();
    if (generatedContent.startsWith('```json')) {
      generatedContent = generatedContent.replace(/```json\n?/, '').replace(/\n?```$/, '');
    }
    if (generatedContent.startsWith('```')) {
      generatedContent = generatedContent.replace(/```\n?/, '').replace(/\n?```$/, '');
    }

    try {
      const parsedOutfits = JSON.parse(generatedContent);
      
      if (!parsedOutfits.outfits || parsedOutfits.outfits.length === 0) {
        throw new Error('No outfits generated');
      }

      console.log('AI generated outfits count:', parsedOutfits.outfits.length);

      // Process with strict validation
      const validatedOutfits = await processValidatedOutfits(
        parsedOutfits.outfits, 
        wardrobeItems, 
        occasion, 
        timeOfDay, 
        weather, 
        openAIApiKey
      );

      if (validatedOutfits.length === 0) {
        console.log('All AI outfits were invalid - using fallback');
        const fallbackOutfits = generateFallbackOutfits(wardrobeItems, occasion, weather);
        
        return new Response(JSON.stringify({
          outfits: fallbackOutfits,
          warning: 'AI kombinleri geçersizdi, gardırobunuzdan güvenli kombinler oluşturuldu.'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('KombinAI: Strict validation successful!');
      
      return new Response(JSON.stringify({ 
        outfits: validatedOutfits,
        validation_passed: true 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
      
    } catch (parseError) {
      console.error('Failed to parse or validate AI response:', parseError);
      
      // Enhanced fallback with exact wardrobe items
      const fallbackOutfits = generateFallbackOutfits(wardrobeItems, occasion, weather);

      return new Response(JSON.stringify({
        outfits: fallbackOutfits,
        warning: 'AI servisi kullanılamadı, gardırobunuzdan güvenli kombinler oluşturuldu.'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error in generate-outfits function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
