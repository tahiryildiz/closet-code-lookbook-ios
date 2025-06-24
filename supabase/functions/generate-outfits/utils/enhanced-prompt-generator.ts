
import { createDetailedWardrobeDescription } from './advanced-item-description.ts';

export function generateEnhancedPrompt(
  wardrobeItems: any[], 
  occasion: string, 
  timeOfDay: string, 
  weather: string,
  userGender?: string,
  isPremium: boolean = false
): string {
  const itemDescriptions = createDetailedWardrobeDescription(wardrobeItems);
  
  const genderContext = userGender ? `Gender preference: ${userGender}` : '';
  const stylingTipsDetail = isPremium 
    ? "Provide comprehensive styling advice including color theory, silhouette balance, texture mixing, layering techniques, and seasonal appropriateness with specific fashion principles (200-300 words)."
    : "Provide focused styling tips on color coordination, fit balance, and occasion appropriateness (80-120 words).";
  
  return `You are an expert fashion stylist with deep knowledge of color theory, silhouette balance, and style coherence. Create 3 sophisticated outfit combinations from this detailed wardrobe:

${itemDescriptions}

Context:
- Occasion: ${occasion}
- Time of day: ${timeOfDay}
- Weather: ${weather}
${genderContext}

ADVANCED STYLING RULES:
1. COLOR HARMONY: Ensure color palettes are cohesive (complementary, analogous, or monochromatic schemes). Avoid mixing warm and cool tones unless intentionally creating contrast.

2. SILHOUETTE BALANCE: Combine different fits strategically (oversized + fitted, structured + flowy). Create visual interest through proportion play.

3. TEXTURE & MATERIAL COORDINATION: Mix textures thoughtfully - avoid clashing materials (satin with denim) unless creating intentional contrast. Consider fabric weight and formality levels.

4. PATTERN MIXING RULES: 
   - Maximum 2 patterns per outfit
   - Mix different scales (large + small patterns)
   - Keep one pattern dominant, others as accents
   - Use solid colors to ground patterned pieces

5. DESIGN DETAIL BALANCE: Balance ornate pieces (ruffles, embellishments) with simpler counterparts. Avoid overwhelming detail competition.

6. CONSTRUCTION HARMONY: Consider necklines, collar styles, and sleeve types for upper body cohesion. Match formality levels across pieces.

7. SEASONAL & OCCASION APPROPRIATENESS: Ensure all pieces align with weather requirements and event formality.

REQUIREMENTS:
- Each outfit must include 3-5 items that create a cohesive look
- All items MUST be from the provided wardrobe (use exact item names)
- ${stylingTipsDetail}
- Rate outfit confidence based on style coherence, color harmony, and appropriateness (1-10 scale)
- Consider the wearer's lifestyle and the practical wearability

Return a JSON array with this exact structure:
[
  {
    "id": 1,
    "name": "Descriptive Outfit Name",
    "items": ["exact item name 1", "exact item name 2", "exact item name 3"],
    "item_ids": ["item_id_1", "item_id_2", "item_id_3"],
    "confidence": 9,
    "styling_tips": "Detailed styling advice with specific fashion principles...",
    "color_story": "Brief description of the color palette and harmony",
    "silhouette_notes": "How the pieces work together proportionally",
    "occasion": "${occasion}"
  }
]

Focus on creating outfits that demonstrate sophisticated fashion knowledge and practical wearability. Each combination should tell a coherent style story.

Make sure the response is valid JSON only, no additional text.`;
}
