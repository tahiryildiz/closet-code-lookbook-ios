
import { createItemDescription } from './item-description.ts';

export function generatePrompt(
  wardrobeItems: any[], 
  occasion: string, 
  timeOfDay: string, 
  weather: string,
  userGender?: string,
  isPremium: boolean = false
): string {
  const itemDescriptions = wardrobeItems.map(createItemDescription).join('\n');
  
  const genderContext = userGender ? `Gender preference: ${userGender}` : '';
  const stylingTipsDetail = isPremium 
    ? "Provide detailed styling tips including specific fashion advice, color coordination principles, layering techniques, and seasonal appropriateness (150-200 words)."
    : "Provide brief styling tips focusing on basic coordination and fit (50-80 words).";
  
  // Add weather-specific guidance
  const weatherGuidance = getWeatherGuidance(weather);
  const occasionGuidance = getOccasionGuidance(occasion, timeOfDay);
  
  return `You are a professional fashion stylist. Create 3 stylish outfit combinations from these wardrobe items:

${itemDescriptions}

Context:
- Occasion: ${occasion}
- Time of day: ${timeOfDay}  
- Weather: ${weather}
${genderContext}

IMPORTANT WEATHER REQUIREMENTS:
${weatherGuidance}

OCCASION REQUIREMENTS:
${occasionGuidance}

Requirements:
1. Each outfit should include 3-5 items that work well together
2. Consider color coordination, style compatibility, and appropriateness for the occasion
3. STRICTLY follow weather appropriateness - no heavy items for hot weather, no light items for cold weather
4. ${stylingTipsDetail}
5. Ensure outfits are practical and fashionable
6. Rate confidence on a scale of 1-10

Return a JSON array with this exact structure:
[
  {
    "id": 1,
    "name": "Outfit Name",
    "items": ["item name 1", "item name 2", "item name 3"],
    "item_ids": ["item_id_1", "item_id_2", "item_id_3"],
    "confidence": 8,
    "styling_tips": "Detailed styling advice...",
    "weather_appropriateness": "Explanation of why this outfit works for ${weather} weather",
    "occasion": "${occasion}"
  }
]

Make sure the response is valid JSON only, no additional text.`;
}

function getWeatherGuidance(weather: string): string {
  const weatherMap: { [key: string]: string } = {
    'hot': `
- ABSOLUTELY AVOID: sweatshirts, hoodies, thick sweaters, wool items, heavy jackets
- MUST USE: lightweight fabrics like cotton, linen, silk, chiffon
- PREFER: tank tops, t-shirts, light blouses, shorts, light skirts, sandals
- FOCUS: breathable materials, light colors, minimal layers`,
    
    'warm': `
- AVOID: heavy wool, thick winter items
- SUITABLE: light cotton, silk, light cardigans, light jackets
- GOOD: light sweaters, long pants, skirts with light tops`,
    
    'mild': `
- BALANCE: light to medium weight fabrics work well
- SUITABLE: cotton, light wool, denim, blazers, cardigans
- FLEXIBLE: most wardrobe items appropriate`,
    
    'cool': `
- PREFER: warmer materials like wool, cashmere, thicker cotton
- SUITABLE: sweaters, cardigans, jackets, boots, long pants
- CONSIDER: layering for comfort`,
    
    'cold': `
- REQUIRE: warm materials like wool, cashmere, fleece
- NECESSARY: sweaters, coats, warm boots, long pants
- FOCUS: multiple layers for warmth`,
    
    'rainy': `
- CONSIDER: water-resistant materials where available
- PREFER: closed shoes, jackets, longer hemlines
- PRACTICAL: items that work well in wet conditions`
  };

  return weatherMap[weather.toLowerCase()] || weatherMap['mild'];
}

function getOccasionGuidance(occasion: string, timeOfDay: string): string {
  const occasionMap: { [key: string]: string } = {
    'party': `
- Style should be elevated and festive
- Consider statement pieces and interesting textures
- Appropriate for dancing and socializing
- ${timeOfDay === 'night' ? 'Evening party: can be more glamorous' : 'Day party: festive but lighter'}`,
    
    'work': `
- Professional and polished appearance
- Structured pieces preferred
- Appropriate coverage and clean lines`,
    
    'dinner': `
- Smart casual to dressy depending on venue
- Put-together but not overly formal
- ${timeOfDay === 'evening' ? 'Evening: more elevated styling' : 'Lunch: relaxed but nice'}`,
    
    'casual': `
- Comfortable and relaxed everyday wear
- Still put-together and stylish`,
    
    'date': `
- Attractive and confidence-boosting
- Balance style with personal authenticity
- ${timeOfDay === 'evening' ? 'Evening: can be more romantic' : 'Day: casual but attractive'}`
  };

  return occasionMap[occasion.toLowerCase()] || occasionMap['casual'];
}
