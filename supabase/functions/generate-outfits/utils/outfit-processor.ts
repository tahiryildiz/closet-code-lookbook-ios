
import { generateOutfitImage } from './image-generator.ts';

export const processOutfits = async (outfits: any[], wardrobeItems: any[], occasion: string, timeOfDay: string, weather: string, openAIApiKey: string) => {
  return await Promise.all(outfits.slice(0, 3).map(async (outfit: any, index: number) => {
    const itemIds = outfit.items.map((itemName: string) => {
      const cleanedItemName = itemName.replace(/^colorless\s+/i, '').trim();
      const foundItem = wardrobeItems.find((item: any) => {
        const cleanWardrobeName = item.name?.replace(/^colorless\s+/i, '').trim() || '';
        return cleanWardrobeName.toLowerCase().includes(cleanedItemName.toLowerCase()) ||
               cleanedItemName.toLowerCase().includes(cleanWardrobeName.toLowerCase()) ||
               item.subcategory?.toLowerCase().includes(cleanedItemName.toLowerCase());
      });
      return foundItem ? foundItem.id : null;
    }).filter(Boolean);
    
    // Generate professional flatlay image
    const generatedImageUrl = await generateOutfitImage(
      outfit, 
      wardrobeItems, 
      occasion, 
      timeOfDay, 
      weather, 
      openAIApiKey, 
      index
    );
    
    // Clean item names for display
    const cleanItems = outfit.items.map((item: string) => 
      item.replace(/^colorless\s+/i, '').trim()
    );
    
    return {
      ...outfit,
      items: cleanItems,
      item_ids: itemIds,
      images: generatedImageUrl ? [generatedImageUrl] : ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop'],
      occasion: occasion,
      generated_image: generatedImageUrl
    };
  }));
};
