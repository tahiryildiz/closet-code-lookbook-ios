
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
    ? "Provide comprehensive styling advice including advanced color theory (analogous, complementary, triadic schemes), sophisticated pattern mixing rules, design detail coordination, contrast balancing, and micro-aesthetic cohesion with specific fashion principles (250-350 words)."
    : "Provide focused styling tips on color coordination, fit balance, pattern mixing basics, and occasion appropriateness (100-150 words).";
  
  return `You are an expert fashion stylist with advanced knowledge of color theory, pattern mixing, design coordination, and visual balance. Create 3 sophisticated outfit combinations from this detailed wardrobe:

${itemDescriptions}

Context:
- Occasion: ${occasion}
- Time of day: ${timeOfDay}
- Weather: ${weather}
${genderContext}

ADVANCED STYLING RULES:

1. COLOR THEORY MASTERY:
   - Apply advanced color harmony: analogous (adjacent hues), complementary (opposite hues), triadic (120° apart), split-complementary
   - Consider color temperature: avoid mixing warm and cool tones unless creating intentional contrast
   - Use neutral colors (black, white, gray, navy, beige) as anchors for bold color combinations
   - Factor in color tone (light, dark, bright, muted, pastel) for sophisticated coordination

2. PATTERN MIXING EXPERTISE:
   - Maximum 2 patterns per outfit with strategic scale contrast (fine + large, medium + large)
   - Mix pattern types thoughtfully: geometric with organic, or same pattern in different scales
   - Avoid similar complexity patterns competing for attention
   - Use solid colors to ground patterned pieces and create visual rest

3. DESIGN DETAIL COORDINATION:
   - Balance formality levels across pieces (formal vs casual elements should complement, not clash)
   - Coordinate necklines and collar styles for upper body harmony in layered looks
   - Limit decorative elements (ruffles, embroidery, beading) to 1-2 pieces maximum
   - Consider structural elements (pleats, darts, tailoring) for sophisticated silhouettes

4. CONTRAST AND BALANCE:
   - Create light/dark contrast for visual interest (light top + dark bottom or vice versa)
   - Balance oversized pieces with fitted counterparts for proportional harmony
   - Mix textures thoughtfully: smooth with textured, matte with shine
   - Consider garment weights: heavy materials (wool, denim) with lighter ones (silk, cotton)

5. SILHOUETTE SOPHISTICATION:
   - Combine different fits strategically (structured + flowy, oversized + slim-fit)
   - Create visual interest through proportion play while maintaining balance
   - Consider body shape and create flattering lines through fit combinations

6. CONSTRUCTION HARMONY:
   - Match closure types and design details for coherent aesthetic
   - Consider button counts and hardware consistency
   - Factor in lining and construction quality for overall sophistication

7. CONTEXTUAL APPROPRIATENESS:
   - Ensure all pieces align with weather requirements and event formality
   - Consider lighting conditions and venue appropriateness
   - Match lifestyle and practical wearability needs

REQUIREMENTS:
- Each outfit must include 3-5 items that create a visually cohesive and fashion-forward look
- All items MUST be from the provided wardrobe (use exact item names)
- Apply advanced color theory principles in combinations
- Demonstrate sophisticated pattern mixing when applicable
- Show design detail coordination and contrast balancing
- ${stylingTipsDetail}
- Rate outfit confidence based on color harmony, pattern coordination, design balance, and overall sophistication (1-10 scale)
- Include specific explanations of color theory and pattern mixing choices

Return a JSON array with this exact structure:
[
  {
    "id": 1,
    "name": "Descriptive Outfit Name",
    "items": ["exact item name 1", "exact item name 2", "exact item name 3"],
    "item_ids": ["item_id_1", "item_id_2", "item_id_3"],
    "confidence": 9,
    "styling_tips": "Advanced styling advice with specific color theory, pattern mixing, and design coordination principles...",
    "color_story": "Detailed analysis of color harmony type (analogous/complementary/etc) and reasoning",
    "silhouette_notes": "How pieces work together proportionally with contrast and balance details",
    "pattern_analysis": "Pattern mixing strategy and scale relationships if applicable",
    "design_coordination": "How design details, formality levels, and construction elements complement each other",
    "occasion": "${occasion}"
  }
]

Focus on creating outfits that demonstrate sophisticated fashion knowledge, advanced color theory application, and expert-level styling coordination. Each combination should represent high-fashion thinking with practical wearability.

Make sure the response is valid JSON only, no additional text.`;
}
