
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
    let imageUrl: string;

    // Check content type to determine how to parse the request
    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      // Handle JSON request (with imageUrl)
      const body = await req.json()
      imageUrl = body.imageUrl;
      
      if (!imageUrl) {
        return createResponse(
          { error: 'Image URL is required' },
          400
        )
      }
    } else if (contentType.includes('multipart/form-data')) {
      // Handle FormData request (with image file)
      const formData = await req.formData()
      const imageFile = formData.get('image') as File
      
      if (!imageFile) {
        return createResponse(
          { error: 'Image file is required' },
          400
        )
      }

      // Convert file to base64 data URL for processing
      const arrayBuffer = await imageFile.arrayBuffer()
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
      imageUrl = `data:${imageFile.type};base64,${base64}`
    } else {
      return createResponse(
        { error: 'Invalid content type. Expected JSON or FormData' },
        400
      )
    }

    console.log('Starting clothing analysis for image')

    let analysisResult;
    let usedProvider = 'OpenAI';

    // Try OpenAI first
    try {
      console.log('Attempting OpenAI analysis...')
      const openaiData = await callOpenAIVision(imageUrl)
      const content = openaiData.choices[0]?.message?.content
      if (!content) {
        throw new Error('No content received from OpenAI')
      }
      analysisResult = parseAndValidateAnalysis(content)
      console.log('OpenAI analysis successful')
    } catch (openaiError) {
      console.error('OpenAI analysis failed:', openaiError.message)
      
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
          console.log('Starting Gemini fallback...')
          const geminiContent = await callGeminiVision(imageUrl)
          console.log('Gemini content received, parsing...')
          analysisResult = parseAndValidateAnalysis(geminiContent)
          usedProvider = 'Gemini';
          console.log('Gemini fallback analysis successful')
        } catch (geminiError) {
          console.error('Gemini fallback also failed:', geminiError.message)
          console.error('Gemini error stack:', geminiError.stack)
          
          return createResponse(
            { 
              error: 'Both AI providers failed',
              details: `OpenAI: ${openaiError.message}. Gemini: ${geminiError.message}`,
              openaiError: openaiError.message,
              geminiError: geminiError.message
            },
            500
          )
        }
      } else {
        console.error('Non-recoverable OpenAI error, not trying fallback:', openaiError.message)
        return createResponse(
          { 
            error: openaiError.message,
            details: 'OpenAI analysis failed with non-recoverable error. Please check your API key and quota.'
          },
          500
        )
      }
    }

    // Add metadata about which provider was used
    analysisResult.analysis_provider = usedProvider;
    analysisResult.analysis_timestamp = new Date().toISOString();

    console.log(`Analysis completed successfully using ${usedProvider}`)
    return createResponse(analysisResult)

  } catch (error) {
    console.error('Unexpected error in analyze-clothing function:', error.message)
    console.error('Error stack:', error.stack)
    return createResponse(
      { 
        error: 'Unexpected error occurred',
        details: error.message
      },
      500
    )
  }
})
