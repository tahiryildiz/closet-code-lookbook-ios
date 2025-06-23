
export function parseAndValidateAnalysis(content: string): any {
  if (!content) {
    throw new Error('No content received from AI provider')
  }

  // Parse the JSON response with enhanced error handling
  let analysisResult
  try {
    // Clean the content and parse - handle both OpenAI and Gemini formats
    let cleanContent = content.trim();
    
    // Remove markdown code blocks if present
    cleanContent = cleanContent.replace(/```json\s?|\s?```/g, '').trim();
    
    // For Gemini responses, sometimes there might be extra text before/after JSON
    const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanContent = jsonMatch[0];
    }
    
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
    
    // Ensure arrays are properly formatted
    if (!Array.isArray(analysisResult.secondary_colors)) {
      analysisResult.secondary_colors = [];
    }
    if (!Array.isArray(analysisResult.design_details)) {
      analysisResult.design_details = [];
    }
    if (!Array.isArray(analysisResult.season_suitability)) {
      analysisResult.season_suitability = ['All Seasons'];
    }
    if (!Array.isArray(analysisResult.occasions)) {
      analysisResult.occasions = ['Casual'];
    }
    if (!Array.isArray(analysisResult.style_tags)) {
      analysisResult.style_tags = ['basic'];
    }
    if (!Array.isArray(analysisResult.accessories)) {
      analysisResult.accessories = [];
    }
    
    console.log('Analysis completed successfully:', {
      name: analysisResult.name,
      category: analysisResult.category,
      subcategory: analysisResult.subcategory,
      color: analysisResult.primary_color,
      confidence: analysisResult.confidence,
      material: analysisResult.material,
      provider: analysisResult.analysis_provider || 'Unknown'
    })
    
  } catch (parseError) {
    console.error('Failed to parse analysis result:', parseError)
    console.error('Raw content:', content)
    throw new Error('Failed to parse AI analysis result')
  }

  return analysisResult
}
