
export function parseAndValidateAnalysis(content: string): any {
  if (!content) {
    throw new Error('No content received from OpenAI')
  }

  // Parse the JSON response with enhanced error handling
  let analysisResult
  try {
    // Clean the content and parse
    const cleanContent = content.replace(/```json\s?|\s?```/g, '').trim()
    analysisResult = JSON.parse(cleanContent)
    
    // Validate critical fields
    if (!analysisResult.name || !analysisResult.category || !analysisResult.primary_color) {
      console.error('Missing critical fields in analysis result:', analysisResult)
      throw new Error('Incomplete analysis - missing critical fields')
    }
    
    // Ensure confidence is within valid range
    if (analysisResult.confidence && (analysisResult.confidence < 1 || analysisResult.confidence > 100)) {
      console.warn('Invalid confidence score, setting to 50')
      analysisResult.confidence = 50
    }
    
    console.log('Analysis completed successfully:', {
      name: analysisResult.name,
      category: analysisResult.category,
      subcategory: analysisResult.subcategory,
      color: analysisResult.primary_color,
      confidence: analysisResult.confidence,
      material: analysisResult.material
    })
    
  } catch (parseError) {
    console.error('Failed to parse analysis result:', parseError)
    console.error('Raw content:', content)
    throw new Error('Failed to parse AI analysis result')
  }

  return analysisResult
}
