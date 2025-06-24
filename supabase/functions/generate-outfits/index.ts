
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { handleCorsPreflightRequest, createResponse } from './utils/cors.ts';
import { validateEnvironment } from './utils/config.ts';
import { handleEnhancedOutfitGeneration } from './utils/enhanced-request-handler.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest();
  }

  try {
    const { openAIApiKey } = validateEnvironment();
    const requestData = await req.json();
    
    console.log('🎯 Starting advanced outfit generation with sophisticated styling intelligence');
    console.log('📊 Advanced features: color theory, pattern mixing, design coordination, contrast balancing');
    
    const result = await handleEnhancedOutfitGeneration(requestData, openAIApiKey);
    
    return createResponse(result);
    
  } catch (error) {
    console.error('❌ Error in generate-outfits function:', error);
    return createResponse(
      { error: 'Internal server error', details: error.message },
      500
    );
  }
});
