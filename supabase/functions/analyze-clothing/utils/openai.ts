
import { generateClothingAnalysisPrompt } from './prompt.ts'

export async function callOpenAIVision(imageUrl: string): Promise<any> {
  const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: generateClothingAnalysisPrompt()
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl
              }
            }
          ]
        }
      ],
      max_tokens: 2000,
      temperature: 0.05  // Very low temperature for maximum consistency
    })
  })

  if (!openaiResponse.ok) {
    const errorText = await openaiResponse.text()
    console.error('OpenAI API error:', openaiResponse.status, errorText)
    throw new Error(`OpenAI API error: ${openaiResponse.status} - ${errorText}`)
  }

  return await openaiResponse.json()
}
