
export function generateFallbackOutfits(
  wardrobeItems: any[], 
  occasion: string, 
  timeOfDay: string, 
  weather: string,
  isPremium: boolean = false
) {
  console.log('🔄 Generating fallback outfits');
  
  // Group items by category for better combinations
  const tops = wardrobeItems.filter(item => 
    item.category === 'Tops' || item.category === 'Shirts' || item.category === 'Sweaters'
  );
  const bottoms = wardrobeItems.filter(item => 
    item.category === 'Bottoms' || item.category === 'Pants' || item.category === 'Jeans'
  );
  const dresses = wardrobeItems.filter(item => 
    item.category === 'Dresses & Suits' || item.category === 'Dresses'
  );
  const outerwear = wardrobeItems.filter(item => 
    item.category === 'Outerwear' || item.category === 'Jackets'
  );
  const footwear = wardrobeItems.filter(item => 
    item.category === 'Footwear' || item.category === 'Shoes'
  );
  
  const outfits = [];
  
  // Generate up to 3 outfit combinations
  for (let i = 0; i < Math.min(3, wardrobeItems.length); i++) {
    const outfit: any = {
      id: i + 1,
      name: `${occasion} Kombinasyonu ${i + 1}`,
      items: [],
      item_ids: [],
      confidence: Math.floor(Math.random() * 3) + 7, // 7-9 confidence
      occasion: occasion
    };
    
    // Try to create a complete outfit
    if (dresses.length > 0 && Math.random() > 0.5) {
      // Dress-based outfit
      const dress = dresses[i % dresses.length];
      outfit.items.push(dress.name);
      outfit.item_ids.push(dress.id);
      
      if (footwear.length > 0) {
        const shoe = footwear[i % footwear.length];
        outfit.items.push(shoe.name);
        outfit.item_ids.push(shoe.id);
      }
      
      if (outerwear.length > 0 && (weather === 'cold' || weather === 'cool')) {
        const jacket = outerwear[i % outerwear.length];
        outfit.items.push(jacket.name);
        outfit.item_ids.push(jacket.id);
      }
    } else {
      // Top + Bottom combination
      if (tops.length > 0) {
        const top = tops[i % tops.length];
        outfit.items.push(top.name);
        outfit.item_ids.push(top.id);
      }
      
      if (bottoms.length > 0) {
        const bottom = bottoms[i % bottoms.length];
        outfit.items.push(bottom.name);
        outfit.item_ids.push(bottom.id);
      }
      
      if (footwear.length > 0) {
        const shoe = footwear[i % footwear.length];
        outfit.items.push(shoe.name);
        outfit.item_ids.push(shoe.id);
      }
      
      if (outerwear.length > 0 && (weather === 'cold' || weather === 'cool')) {
        const jacket = outerwear[i % outerwear.length];
        outfit.items.push(jacket.name);
        outfit.item_ids.push(jacket.id);
      }
    }
    
    // Generate appropriate styling tips based on subscription
    if (isPremium) {
      outfit.styling_tips = generateDetailedStylingTips(occasion, timeOfDay, weather, outfit.items);
    } else {
      outfit.styling_tips = generateBasicStylingTips(occasion, outfit.items);
    }
    
    if (outfit.items.length > 0) {
      outfits.push(outfit);
    }
  }
  
  console.log(`✅ Generated ${outfits.length} fallback outfits`);
  return outfits;
}

function generateDetailedStylingTips(occasion: string, timeOfDay: string, weather: string, items: string[]): string {
  const tips = [
    `Bu ${occasion} kombinasyonu ${timeOfDay} vakti için mükemmel bir seçim.`,
    `${weather} hava koşulları için uygun katmanlama teknikleri kullanılmış.`,
    `Renk uyumu açısından tamamlayıcı tonlar tercih edilmiş.`,
    `Aksesuarlar ekleyerek kombinasyonu kişiselleştirebilirsiniz.`,
    `Kumaş kalitesi ve kesim uyumuna dikkat edilerek seçilmiş parçalar.`,
    `Bu kombin size özgüven vererek doğal görünmenizi sağlayacak.`,
    `Mevsimsel uyum ve fonksiyonellik göz önünde bulundurulmuş.`,
    `Modern stil anlayışıyla klasik parçaların harmoni içinde kullanımı.`
  ];
  
  return tips.slice(0, 5).join(' ');
}

function generateBasicStylingTips(occasion: string, items: string[]): string {
  const tips = [
    `${occasion} için uygun bir kombinasyon.`,
    `Parçaların renk uyumuna dikkat edin.`,
    `Rahat ve şık bir görünüm sunar.`,
    `Aksesuarlarla tamamlayabilirsiniz.`
  ];
  
  return tips.slice(0, 2).join(' ');
}
