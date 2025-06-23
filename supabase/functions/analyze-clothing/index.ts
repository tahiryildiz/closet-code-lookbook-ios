
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders, handleCorsPreflightRequest, createResponse } from './utils/cors.ts'
import { callOpenAIVision } from './utils/openai.ts'
import { callGeminiVision } from './utils/gemini.ts'
import { parseAndValidateAnalysis } from './utils/validation.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return handleCorsPreflightRequest()
  }

  try {
    const { imageUrl } = await req.json()

    if (!imageUrl) {
      return createResponse(
        { error: 'Image URL is required' },
        400
      )
    }

    console.log('Starting clothing analysis for:', imageUrl)

    let analysisResult;
    let usedProvider = 'OpenAI';

    try {
      // Try OpenAI first
      console.log('Attempting OpenAI analysis...')
      const openaiData = await callOpenAIVision(imageUrl)
      const content = openaiData.choices[0]?.message?.content
      analysisResult = parseAndValidateAnalysis(content)
      console.log('OpenAI analysis successful')
    } catch (openaiError) {
      console.error('OpenAI analysis failed:', openaiError)
      
      // Check if it's a rate limit or other recoverable error
      const errorMessage = openaiError.message.toLowerCase();
      const isRateLimit = errorMessage.includes('429') || 
                         errorMessage.includes('quota') ||
                         errorMessage.includes('rate limit');
      
      const isServerError = errorMessage.includes('500') ||
                           errorMessage.includes('502') ||
                           errorMessage.includes('503') ||
                           errorMessage.includes('timeout');

      if (isRateLimit || isServerError) {
        console.log('Falling back to Google Gemini due to OpenAI issue:', openaiError.message)
        
        try {
          const geminiContent = await callGeminiVision(imageUrl)
          analysisResult = parseAndValidateAnalysis(geminiContent)
          usedProvider = 'Gemini';
          console.log('Gemini fallback analysis successful')
        } catch (geminiError) {
          console.error('Both OpenAI and Gemini failed:', { 
            openaiError: openaiError.message, 
            geminiError: geminiError.message 
          })
          throw new Error(`Analysis failed. OpenAI: ${openaiError.message}. Gemini fallback: ${geminiError.message}`)
        }
      } else {
        // For non-recoverable OpenAI errors, don't try fallback
        throw openaiError
      }
    }

    // Add metadata about which provider was used
    analysisResult.analysis_provider = usedProvider;
    analysisResult.analysis_timestamp = new Date().toISOString();

    console.log(`Analysis completed successfully using ${usedProvider}`)
    return createResponse(analysisResult)

  } catch (error) {
    console.error('Error analyzing clothing:', error)
    return createResponse(
      { 
        error: error.message,
        details: 'Analysis failed. Please ensure the image clearly shows a clothing item and try again with better lighting or angle.'
      },
      500
    )
  }
})
