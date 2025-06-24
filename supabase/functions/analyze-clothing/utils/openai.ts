
export async function callOpenAIVision(imageUrl: string, customPrompt?: string) {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
  
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured')
  }

  const prompt = customPrompt || generateClothingAnalysisPrompt();

  const payload = {
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt
          },
          {
            type: "image_url",
            image_url: {
              url: imageUrl,
              detail: "high"
            }
          }
        ]
      }
    ],
    max_tokens: 2000,
    temperature: 0.1
  }

  console.log('Making OpenAI API request...')
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('OpenAI API error response:', errorText)
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${errorText}`)
  }

  const data = await response.json()
  console.log('OpenAI API response received successfully')
  
  return data
}
