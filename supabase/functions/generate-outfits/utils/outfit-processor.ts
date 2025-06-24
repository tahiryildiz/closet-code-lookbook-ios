
import { generateOutfitImage } from './image-generator.ts';
import { uploadFlatlayImage } from './image-storage.ts';

export const processOutfits = async (
  outfits: any[], 
  wardrobeItems: any[], 
  occasion: string, 
  timeOfDay: string, 
  weather: string, 
  openAIApiKey: string,
  userId: string,
  supabaseUrl: string,
  supabaseServiceKey: string
) => {
  console.log(`🔧 [DEBUG] Processing ${outfits.length} outfits`);
  console.log(`👕 [DEBUG] Available wardrobe items:`, wardrobeItems.length);
  console.log(`📋 [DEBUG] Wardrobe item names:`, wardrobeItems.map(item => item.name));

  return await Promise.all(outfits.slice(0, 3).map(async (outfit: any, index: number) => {
    console.log(`\n🔄 [DEBUG] Processing outfit ${index + 1}: "${outfit.name}"`);
    console.log(`📝 [DEBUG] Outfit items:`, outfit.items);

    // Enhanced item matching with better Turkish support
    const itemIds = outfit.items.map((itemName: string) => {
      const cleanedItemName = itemName.trim().toLowerCase();
      
      // Try multiple matching strategies
      let foundItem = null;
      
      // Strategy 1: Exact match
      foundItem = wardrobeItems.find((item: any) => {
        return item.name && item.name.toLowerCase() === cleanedItemName;
      });
      
      if (!foundItem) {
        // Strategy 2: Partial match
        foundItem = wardrobeItems.find((item: any) => {
          const wardrobeName = (item.name || '').toLowerCase();
          return wardrobeName.includes(cleanedItemName) || cleanedItemName.includes(wardrobeName);
        });
      }
      
      if (!foundItem) {
        // Strategy 3: Category and color based matching
        const colorKeywords = ['beyaz', 'siyah', 'mavi', 'yeşil', 'kırmızı', 'sarı', 'mor', 'turuncu', 'pembe', 'gri', 'kahverengi', 'lacivert', 'bej', 'haki'];
        const categoryKeywords = ['tişört', 'gömlek', 'pantolon', 'etek', 'kazak', 'sweatshirt', 'ayakkabı', 'blazer', 'ceket', 'şort', 'elbise'];
        
        const itemColors = colorKeywords.filter(color => cleanedItemName.includes(color));
        const itemCategories = categoryKeywords.filter(cat => cleanedItemName.includes(cat));
        
        if (itemColors.length > 0 || itemCategories.length > 0) {
          foundItem = wardrobeItems.find((item: any) => {
            const wardrobeName = (item.name || '').toLowerCase();
            const wardromeCategory = (item.category || '').toLowerCase();
            const wardrobeColor = (item.primary_color || item.color || '').toLowerCase();
            
            const colorMatch = itemColors.some(color => 
              wardrobeName.includes(color) || wardrobeColor.includes(color)
            );
            const categoryMatch = itemCategories.some(cat => 
              wardrobeName.includes(cat) || wardromeCategory.includes(cat)
            );
            
            return colorMatch || categoryMatch;
          });
        }
      }
      
      if (foundItem) {
        console.log(`✅ [DEBUG] Matched "${itemName}" to "${foundItem.name}"`);
        return foundItem.id;
      } else {
        console.log(`❌ [DEBUG] No match found for "${itemName}"`);
        return null;
      }
    }).filter(Boolean);
    
    console.log(`🎯 [DEBUG] Found ${itemIds.length} matching items for outfit ${index + 1}`);
    
    // Generate professional flatlay image
    const imageResult = await generateOutfitImage(
      outfit, 
      wardrobeItems, 
      occasion, 
      timeOfDay, 
      weather, 
      openAIApiKey, 
      index
    );
    
    let publicImageUrl = null;
    
    // If we have a generated image (base64), upload it to storage
    if (imageResult?.generated_image && imageResult.generated_image.startsWith('data:image/')) {
      console.log(`🔄 [DEBUG] Converting base64 image to storage for outfit ${index + 1}`);
      
      // Generate a temporary outfit ID for the filename
      const tempOutfitId = `temp_${Date.now()}_${index}`;
      
      publicImageUrl = await uploadFlatlayImage(
        imageResult.generated_image,
        userId,
        tempOutfitId,
        supabaseUrl,
        supabaseServiceKey
      );
      
      if (publicImageUrl) {
        console.log(`✅ [DEBUG] Successfully uploaded flatlay image: ${publicImageUrl}`);
      } else {
        console.log(`❌ [DEBUG] Failed to upload flatlay image, falling back to reference images`);
      }
    }
    
    // Clean item names for display
    const cleanItems = outfit.items.map((item: string) => 
      item.replace(/^colorless\s+/i, '').trim()
    );
    
    return {
      ...outfit,
      items: cleanItems,
      item_ids: itemIds,
      images: publicImageUrl ? [publicImageUrl] : (imageResult?.reference_images || ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop']),
      reference_images: imageResult?.reference_images || [],
      occasion: occasion,
      generated_image: publicImageUrl,
      image_url: publicImageUrl,
      composition_type: imageResult?.composition_type || 'reference_fallback',
      aspect_ratio: imageResult?.aspect_ratio || '4:5',
      item_count: imageResult?.item_count || itemIds.length
    };
  }));
};
