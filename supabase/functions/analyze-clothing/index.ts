
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders, handleCorsPreflightRequest, createResponse } from './utils/cors.ts'
import { callOpenAIVision } from './utils/openai.ts'
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

    const openaiData = await callOpenAIVision(imageUrl)
    const content = openaiData.choices[0]?.message?.content
    const analysisResult = parseAndValidateAnalysis(content)

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
