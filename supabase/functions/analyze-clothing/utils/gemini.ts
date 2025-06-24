
export async function callGeminiVision(imageUrl: string, customPrompt?: string) {
  const geminiApiKey = Deno.env.get('GOOGLE_GEMINI_API_KEY')
  
  if (!geminiApiKey) {
    throw new Error('Google Gemini API key not configured')
  }

  const prompt = customPrompt || generateClothingAnalysisPrompt();

  let imageData: string
  let mimeType: string

  if (imageUrl.startsWith('data:')) {
    // Handle base64 data URLs
    const [header, base64Data] = imageUrl.split(',')
    mimeType = header.split(':')[1].split(';')[0]
    imageData = base64Data
  } else {
    // Handle regular URLs - fetch and convert to base64
    console.log('Fetching image from URL for Gemini...')
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.status}`)
    }
    
    const imageBuffer = await imageResponse.arrayBuffer()
    imageData = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)))
    mimeType = imageResponse.headers.get('content-type') || 'image/jpeg'
  }

  const payload = {
    contents: [{
      parts: [
        { text: prompt },
        {
          inline_data: {
            mime_type: mimeType,
            data: imageData
          }
        }
      ]
    }],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 2000,
    }
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`
  
  console.log('Making Gemini API request...')
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Gemini API error response:', errorText)
    throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${errorText}`)
  }

  const data = await response.json()
  console.log('Gemini API response received successfully')
  
  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
    throw new Error('Invalid response structure from Gemini API')
  }

  return data.candidates[0].content.parts[0].text
}
