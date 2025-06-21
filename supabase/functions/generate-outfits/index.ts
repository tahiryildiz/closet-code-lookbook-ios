
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { occasion, timeOfDay, weather } = await req.json();

    if (!occasion || !timeOfDay || !weather) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const prompt = `Generate 3 outfit recommendations in Turkish for the following criteria:
    - Occasion: ${occasion}
    - Time of day: ${timeOfDay}
    - Weather: ${weather}

    Please provide exactly 3 outfit suggestions. For each outfit, include:
    1. A creative Turkish name for the outfit
    2. A list of 3-4 clothing items that make up the outfit
    3. A confidence score (80-100)
    4. Brief styling tips in Turkish

    Return the response as a JSON object with this exact structure:
    {
      "outfits": [
        {
          "id": 1,
          "name": "Outfit name in Turkish",
          "items": ["item1", "item2", "item3"],
          "confidence": 95,
          "styling_tips": "styling tip in Turkish"
        }
      ]
    }`;

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
            content: 'You are a professional fashion stylist who creates outfit recommendations. Always respond with valid JSON only, no additional text.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    try {
      const parsedOutfits = JSON.parse(generatedContent);
      return new Response(JSON.stringify(parsedOutfits), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      
      // Fallback response
      const fallbackOutfits = {
        outfits: [
          {
            id: 1,
            name: "Klasik Profesyonel",
            items: ["Lacivert Blazer", "Beyaz Gömlek", "Siyah Pantolon", "Deri Ayakkabı"],
            confidence: 90,
            styling_tips: "Temiz ve profesyonel bir görünüm için mükemmel"
          },
          {
            id: 2,
            name: "Rahat Şık",
            items: ["Kazak", "Kot Pantolon", "Beyaz Sneaker", "Denim Ceket"],
            confidence: 85,
            styling_tips: "Günlük aktiviteler için ideal bir kombinasyon"
          },
          {
            id: 3,
            name: "Akşam Zarafeti",
            items: ["Elbise", "Topuklu Ayakkabı", "Küçük Çanta", "Şık Aksesuar"],
            confidence: 88,
            styling_tips: "Özel günler ve akşam etkinlikleri için"
          }
        ]
      };

      return new Response(JSON.stringify(fallbackOutfits), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error in generate-outfits function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
