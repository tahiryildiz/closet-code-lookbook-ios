
export const generateOutfitImage = async (outfit: any, wardrobeItems: any[], occasion: string, timeOfDay: string, weather: string, openAIApiKey: string, index: number) => {
  console.log(`🖼️  Processing outfit image ${index + 1} - collecting all product images`);
  
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
    return {
      primary_image: null,
      all_images: [],
      item_count: 0
    };
  }

  console.log(`🎯 Found ${matchedItems.length} product images for complete outfit visualization`);
  
  // Return all product images for the complete outfit
  return {
    primary_image: matchedItems[0].image_url, // Keep primary for backward compatibility
    all_images: matchedItems.map(item => item.image_url),
    item_details: matchedItems,
    item_count: matchedItems.length
  };
};
