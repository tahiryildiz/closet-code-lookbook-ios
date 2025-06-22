
import { createDetailedItemDescription } from './item-description.ts';

export const generateOutfitImage = async (outfit: any, wardrobeItems: any[], occasion: string, timeOfDay: string, weather: string, openAIApiKey: string, index: number) => {
  const enhancedItemDescriptions = outfit.items.map((itemName: string) => {
    const cleanedItemName = itemName.replace(/^colorless\s+/i, '').trim();
    const wardrobeItem = wardrobeItems.find((item: any) => {
      const cleanWardrobeName = item.name?.replace(/^colorless\s+/i, '').trim() || '';
      return cleanWardrobeName.toLowerCase().includes(cleanedItemName.toLowerCase()) ||
             cleanedItemName.toLowerCase().includes(cleanWardrobeName.toLowerCase()) ||
             item.subcategory?.toLowerCase().includes(cleanedItemName.toLowerCase());
    });
    
    if (wardrobeItem) {
      return createDetailedItemDescription(wardrobeItem);
    }
    return cleanedItemName;
  });

  const imagePrompt = `PROFESSIONAL FASHION FLATLAY PHOTOGRAPHY: Create a single, cohesive outfit layout on a clean white background.

OUTFIT COMPOSITION (arrange as one complete look):
${enhancedItemDescriptions.map((item, i) => `${i + 1}. ${item}`).join('\n')}

VISUAL REQUIREMENTS:
- Professional magazine-style flatlay photography
- Clean white/cream background (like Zara, COS, or Everlane)
- Arrange items as they would be worn (top items above, bottom items below)
- Slightly overlapping placement for natural styling
- High-end fashion photography lighting
- Square format (1024x1024)
- No human figures, mannequins, or hangers
- No additional props or accessories not listed
- Soft, even shadows for depth

STYLING CONTEXT: ${occasion} - ${timeOfDay} - ${weather}

Generate exactly ONE cohesive outfit image that looks like professional fashion brand photography.`;
  
  console.log(`Generating professional flatlay image ${index + 1}`);
  
  try {
    const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: imagePrompt,
        n: 1,
        size: '1024x1024',
        quality: 'hd',
        style: 'natural'
      }),
    });

    if (imageResponse.ok) {
      const imageData = await imageResponse.json();
      console.log('Image generation response status: success');
      
      if (imageData.data && imageData.data[0] && imageData.data[0].url) {
        console.log(`Generated professional flatlay image for outfit ${index + 1}: success`);
        return imageData.data[0].url;
      }
    } else {
      const errorText = await imageResponse.text();
      console.error(`Failed to generate image for outfit ${index + 1}:`, errorText);
    }
  } catch (imageError) {
    console.error(`Error generating image for outfit ${index + 1}:`, imageError);
  }
  
  return null;
};
