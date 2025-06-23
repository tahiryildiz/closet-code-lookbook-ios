
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { handleCorsPreflightRequest, createResponse } from './utils/cors.ts';
import { validateEnvironment } from './utils/config.ts';
import { handleOutfitGeneration } from './utils/request-handler.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest();
  }

  try {
    const { openAIApiKey } = validateEnvironment();
    const requestData = await req.json();
    
    const result = await handleOutfitGeneration(requestData, openAIApiKey);
    
    return createResponse(result);
    
  } catch (error) {
    console.error('❌ Error in generate-outfits function:', error);
    return createResponse(
      { error: 'Internal server error', details: error.message },
      500
    );
  }
});
