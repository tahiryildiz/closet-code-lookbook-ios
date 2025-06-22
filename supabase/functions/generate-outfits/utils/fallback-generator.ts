
import { createDetailedItemDescription } from './item-description.ts';

export const createSmartOutfitCombination = (items: any[], index: number, occasion: string, weather: string) => {
  // Categorize items for better combinations
  const tops = items.filter(item => 
    ['Tops', 'Topwear'].includes(item.category) || 
    ['TShirt', 'Shirt', 'Blouse', 'Polo'].includes(item.subcategory)
  );
  const bottoms = items.filter(item => 
    ['Bottoms'].includes(item.category) || 
    ['Jeans', 'Trousers', 'Pants', 'Shorts'].includes(item.subcategory)
  );
  const outerwear = items.filter(item => 
    ['Outerwear'].includes(item.category) || 
    ['Jacket', 'Blazer', 'Cardigan', 'Coat'].includes(item.subcategory)
  );
  
  let selectedItems = [];
  
  // Smart selection based on occasion and weather
  if (tops.length > 0) {
    const appropriateTop = tops.find(item => {
      if (occasion === 'office' && item.subcategory === 'Shirt') return true;
      if (occasion === 'casual' && item.subcategory === 'TShirt') return true;
      return true;
    }) || tops[Math.floor(Math.random() * tops.length)];
    selectedItems.push(appropriateTop);
  }
  
  if (bottoms.length > 0) {
    const appropriateBottom = bottoms.find(item => {
      if (occasion === 'office' && item.subcategory === 'Trousers') return true;
      if (weather === 'sunny' && item.subcategory === 'Shorts') return true;
      return true;
    }) || bottoms[Math.floor(Math.random() * bottoms.length)];
    selectedItems.push(appropriateBottom);
  }
  
  // Add outerwear if weather suggests it
  if (outerwear.length > 0 && (weather === 'cool' || weather === 'cold' || weather === 'windy')) {
    selectedItems.push(outerwear[Math.floor(Math.random() * outerwear.length)]);
  }
  
  // Ensure we have at least 2 items
  if (selectedItems.length < 2) {
    const remaining = items.filter(item => !selectedItems.includes(item));
    while (selectedItems.length < 2 && remaining.length > 0) {
      const randomItem = remaining.splice(Math.floor(Math.random() * remaining.length), 1)[0];
      selectedItems.push(randomItem);
    }
  }
  
  return {
    id: index + 1,
    name: `Günlük Kombin ${index + 1}`,
    items: selectedItems.map((item: any) => item.name?.replace(/^colorless\s+/i, '').trim() || item.subcategory),
    item_ids: selectedItems.map((item: any) => item.id),
    confidence: Math.floor(Math.random() * 20) + 75,
    styling_tips: `Bu kombinasyon ${selectedItems.map(item => createDetailedItemDescription(item)).join(' ve ')} parçalarından oluşuyor`,
    images: selectedItems.map((item: any) => item.image_url).filter(Boolean),
    occasion: occasion
  };
};

export const generateFallbackOutfits = (wardrobeItems: any[], occasion: string, weather: string) => {
  return [
    createSmartOutfitCombination(wardrobeItems, 0, occasion, weather),
    createSmartOutfitCombination(wardrobeItems, 1, occasion, weather),
    createSmartOutfitCombination(wardrobeItems, 2, occasion, weather)
  ].filter(outfit => outfit.items.length > 0);
};
