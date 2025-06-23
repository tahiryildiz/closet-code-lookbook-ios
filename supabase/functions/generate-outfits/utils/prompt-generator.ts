
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
  
  return `You are a professional fashion stylist. Create 3 stylish outfit combinations from these wardrobe items:

${itemDescriptions}

Context:
- Occasion: ${occasion}
- Time of day: ${timeOfDay}  
- Weather: ${weather}
${genderContext}

Requirements:
1. Each outfit should include 3-5 items that work well together
2. Consider color coordination, style compatibility, and appropriateness for the occasion
3. ${stylingTipsDetail}
4. Ensure outfits are practical and fashionable
5. Rate confidence on a scale of 1-10

Return a JSON array with this exact structure:
[
  {
    "id": 1,
    "name": "Outfit Name",
    "items": ["item name 1", "item name 2", "item name 3"],
    "item_ids": ["item_id_1", "item_id_2", "item_id_3"],
    "confidence": 8,
    "styling_tips": "Detailed styling advice...",
    "occasion": "${occasion}"
  }
]

Make sure the response is valid JSON only, no additional text.`;
}
