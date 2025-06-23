
export const generateOutfitImage = async (outfit: any, wardrobeItems: any[], occasion: string, timeOfDay: string, weather: string, openAIApiKey: string, index: number) => {
  console.log(`🖼️  Generating outfit image ${index + 1} using actual product images`);
  
  // Find actual wardrobe items that match the outfit items
  const matchedItems = outfit.items.map((itemName: string) => {
    const cleanedItemName = itemName.trim();
    const wardrobeItem = wardrobeItems.find((item: any) => {
      const wardrobeName = (item.name || item.subcategory || '').trim();
      return wardrobeName === cleanedItemName;
    });
    
    if (wardrobeItem && wardrobeItem.image_url) {
      console.log(`✅ Found actual image for "${itemName}": ${wardrobeItem.image_url}`);
      return {
        name: wardrobeItem.name,
        image_url: wardrobeItem.image_url,
        category: wardrobeItem.category
      };
    } else {
      console.log(`⚠️  No image found for "${itemName}"`);
      return null;
    }
  }).filter(Boolean);

  if (matchedItems.length === 0) {
    console.log('❌ No actual product images found for outfit items');
    return null;
  }

  // For now, return the first available product image as the main outfit image
  // In a more advanced implementation, you could create a composite flatlay image
  // by combining multiple product images using a separate image processing service
  
  console.log(`🎯 Using primary product image: ${matchedItems[0].image_url}`);
  
  // Return the URL of the first matched item's image
  // This ensures we're showing actual wardrobe items, not AI-generated images
  return matchedItems[0].image_url;
};
