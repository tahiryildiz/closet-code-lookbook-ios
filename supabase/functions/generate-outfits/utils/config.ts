
export function validateEnvironment() {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openAIApiKey) {
    console.error('❌ OpenAI API key not found');
    throw new Error('OpenAI API key not configured');
  }
  
  return { openAIApiKey };
}
