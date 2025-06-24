
export const generateAdvancedFallbackOutfits = (
  wardrobeItems: any[], 
  occasion: string, 
  timeOfDay: string, 
  weather: string, 
  isPremium: boolean = false
) => {
  console.log('🔄 Generating advanced fallback outfits');
  
  // Group items by category for strategic selection
  const itemsByCategory = wardrobeItems.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  const tops = itemsByCategory['Tops'] || [];
  const bottoms = itemsByCategory['Bottoms'] || [];
  const outerwear = itemsByCategory['Outerwear'] || [];
  const shoes = itemsByCategory['Footwear'] || [];
  const dresses = itemsByCategory['Dresses & Suits'] || [];
  const accessories = itemsByCategory['Accessories'] || [];

  const outfits = [];

  // Advanced outfit generation with style coherence
  for (let i = 0; i < 3 && outfits.length < 3; i++) {
    const outfit = generateCoherentOutfit(
      { tops, bottoms, outerwear, shoes, dresses, accessories },
      occasion,
      timeOfDay,
      weather,
      i,
      isPremium
    );
    
    if (outfit && outfit.items.length >= 3) {
      outfits.push(outfit);
    }
  }

  return outfits.length > 0 ? outfits : [createBasicFallbackOutfit(wardrobeItems, occasion, isPremium)];
};

const generateCoherentOutfit = (
  categorizedItems: any,
  occasion: string,
  timeOfDay: string,
  weather: string,
  index: number,
  isPremium: boolean
) => {
  const { tops, bottoms, outerwear, shoes, dresses, accessories } = categorizedItems;
  
  // Strategy selection based on available items and context
  const strategies = [
    () => createDressBasedOutfit(dresses, outerwear, shoes, accessories, occasion, weather),
    () => createTopBottomCombo(tops, bottoms, outerwear, shoes, accessories, occasion, weather),
    () => createLayeredLook(tops, bottoms, outerwear, shoes, accessories, occasion, weather)
  ];

  const strategy = strategies[index % strategies.length];
  const outfit = strategy();

  if (!outfit) return null;

  return {
    id: index + 1,
    name: generateOutfitName(outfit.items, occasion),
    items: outfit.items.map(item => item.name),
    item_ids: outfit.items.map(item => item.id),
    confidence: calculateCoherenceScore(outfit.items),
    styling_tips: generateAdvancedStylingTips(outfit.items, occasion, isPremium),
    color_story: analyzeColorStory(outfit.items),
    silhouette_notes: analyzeSilhouette(outfit.items),
    occasion: occasion
  };
};

const createDressBasedOutfit = (dresses: any[], outerwear: any[], shoes: any[], accessories: any[], occasion: string, weather: string) => {
  if (dresses.length === 0) return null;
  
  const dress = selectBestMatch(dresses, { occasion, weather });
  const items = [dress];
  
  // Add complementary pieces
  if (outerwear.length > 0 && (weather === 'cold' || weather === 'cool')) {
    const jacket = selectCoordinatingPiece(outerwear, dress, 'outerwear');
    if (jacket) items.push(jacket);
  }
  
  if (shoes.length > 0) {
    const shoe = selectCoordinatingPiece(shoes, dress, 'footwear');
    if (shoe) items.push(shoe);
  }
  
  if (accessories.length > 0 && items.length < 5) {
    const accessory = selectCoordinatingPiece(accessories, dress, 'accessory');
    if (accessory) items.push(accessory);
  }
  
  return { items };
};

const createTopBottomCombo = (tops: any[], bottoms: any[], outerwear: any[], shoes: any[], accessories: any[], occasion: string, weather: string) => {
  if (tops.length === 0 || bottoms.length === 0) return null;
  
  const top = selectBestMatch(tops, { occasion, weather });
  const bottom = selectCoordinatingPiece(bottoms, top, 'bottom');
  
  if (!top || !bottom) return null;
  
  const items = [top, bottom];
  
  // Add coordinating pieces with style coherence
  if (outerwear.length > 0 && (weather === 'cold' || weather === 'cool' || occasion === 'work')) {
    const jacket = selectCoordinatingPiece(outerwear, { primary: top, secondary: bottom }, 'outerwear');
    if (jacket) items.push(jacket);
  }
  
  if (shoes.length > 0) {
    const shoe = selectCoordinatingPiece(shoes, { primary: top, secondary: bottom }, 'footwear');
    if (shoe) items.push(shoe);
  }
  
  return { items };
};

const createLayeredLook = (tops: any[], bottoms: any[], outerwear: any[], shoes: any[], accessories: any[], occasion: string, weather: string) => {
  if (tops.length < 2 || bottoms.length === 0) return null;
  
  const baseTop = selectBestMatch(tops, { occasion, weather });
  const layerTop = tops.find(t => t.id !== baseTop.id && canLayer(baseTop, t));
  const bottom = selectCoordinatingPiece(bottoms, baseTop, 'bottom');
  
  if (!baseTop || !layerTop || !bottom) return null;
  
  const items = [baseTop, layerTop, bottom];
  
  if (shoes.length > 0) {
    const shoe = selectCoordinatingPiece(shoes, baseTop, 'footwear');
    if (shoe) items.push(shoe);
  }
  
  return { items };
};

const selectBestMatch = (items: any[], context: { occasion?: string, weather?: string }) => {
  return items.find(item => 
    (item.occasions?.includes(context.occasion) || !item.occasions?.length) &&
    (item.seasons?.some((season: string) => isSeasonallyAppropriate(season, context.weather)) || !item.seasons?.length)
  ) || items[0];
};

const selectCoordinatingPiece = (items: any[], anchor: any | { primary: any, secondary: any }, type: string) => {
  const anchorItem = anchor.primary || anchor;
  
  return items.find(item => {
    // Color coordination
    const colorMatch = checkColorHarmony(anchorItem, item);
    
    // Style coherence
    const styleMatch = checkStyleCoherence(anchorItem, item);
    
    // Formality level
    const formalityMatch = checkFormalityLevel(anchorItem, item);
    
    return colorMatch && styleMatch && formalityMatch;
  }) || items[0];
};

const checkColorHarmony = (item1: any, item2: any) => {
  if (!item1.primary_color || !item2.primary_color) return true;
  
  // Simple color harmony rules
  const color1 = item1.primary_color.toLowerCase();
  const color2 = item2.primary_color.toLowerCase();
  
  // Same color family
  if (color1 === color2) return true;
  
  // Neutral combinations
  const neutrals = ['black', 'white', 'gray', 'beige', 'navy'];
  if (neutrals.includes(color1) || neutrals.includes(color2)) return true;
  
  // Avoid clashing warm/cool if both have tone info
  if (item1.color_tone && item2.color_tone) {
    return item1.color_tone === item2.color_tone;
  }
  
  return true;
};

const checkStyleCoherence = (item1: any, item2: any) => {
  if (!item1.style_tags?.length || !item2.style_tags?.length) return true;
  
  // Check for overlapping style tags
  return item1.style_tags.some((tag: string) => item2.style_tags.includes(tag));
};

const checkFormalityLevel = (item1: any, item2: any) => {
  const formal1 = isItemFormal(item1);
  const formal2 = isItemFormal(item2);
  
  // Allow mixing if one is neutral formality
  return Math.abs(formal1 - formal2) <= 1;
};

const isItemFormal = (item: any) => {
  const formalKeywords = ['suit', 'blazer', 'dress shirt', 'tie', 'formal'];
  const casualKeywords = ['jeans', 'sneakers', 't-shirt', 'hoodie'];
  
  const itemText = `${item.name} ${item.category} ${item.style_tags?.join(' ') || ''}`.toLowerCase();
  
  if (formalKeywords.some(keyword => itemText.includes(keyword))) return 2;
  if (casualKeywords.some(keyword => itemText.includes(keyword))) return 0;
  return 1; // Neutral
};

const canLayer = (base: any, layer: any) => {
  // Simple layering rules
  const baseWeight = getItemWeight(base);
  const layerWeight = getItemWeight(layer);
  
  return layerWeight > baseWeight;
};

const getItemWeight = (item: any) => {
  const heavyMaterials = ['wool', 'leather', 'denim'];
  const lightMaterials = ['cotton', 'silk', 'linen'];
  
  if (heavyMaterials.some(material => item.material?.toLowerCase().includes(material))) return 2;
  if (lightMaterials.some(material => item.material?.toLowerCase().includes(material))) return 0;
  return 1;
};

const isSeasonallyAppropriate = (season: string, weather: string) => {
  const seasonWeatherMap: Record<string, string[]> = {
    'spring': ['mild', 'warm', 'cool'],
    'summer': ['hot', 'warm', 'mild'],
    'fall': ['cool', 'mild', 'cold'],
    'winter': ['cold', 'cool']
  };
  
  return seasonWeatherMap[season.toLowerCase()]?.includes(weather) || false;
};

const calculateCoherenceScore = (items: any[]) => {
  let score = 5; // Base score
  
  // Color harmony bonus
  const colors = items.map(item => item.primary_color).filter(Boolean);
  const uniqueColors = new Set(colors);
  if (uniqueColors.size <= 3) score += 1;
  
  // Style consistency bonus
  const allStyles = items.flatMap(item => item.style_tags || []);
  const commonStyles = allStyles.filter((style, index) => allStyles.indexOf(style) !== index);
  if (commonStyles.length > 0) score += 1;
  
  // Formality consistency bonus
  const formalityLevels = items.map(isItemFormal);
  const formalityRange = Math.max(...formalityLevels) - Math.min(...formalityLevels);
  if (formalityRange <= 1) score += 1;
  
  return Math.min(10, Math.max(1, score));
};

const generateOutfitName = (items: any[], occasion: string) => {
  const adjectives = ['Chic', 'Elegant', 'Casual', 'Modern', 'Classic', 'Stylish', 'Sophisticated'];
  const noun = occasion.charAt(0).toUpperCase() + occasion.slice(1);
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${noun} Look`;
};

const generateAdvancedStylingTips = (items: any[], occasion: string, isPremium: boolean) => {
  const tips = [];
  
  // Color analysis
  const colors = items.map(item => item.primary_color).filter(Boolean);
  if (colors.length > 0) {
    tips.push(`This combination uses a ${colors.length === 1 ? 'monochromatic' : 'coordinated'} color palette with ${colors.join(', ').toLowerCase()}.`);
  }
  
  // Silhouette analysis
  const fits = items.map(item => item.fit).filter(Boolean);
  if (fits.length > 1) {
    tips.push(`The silhouette balances ${fits.join(' and ')} fits for visual interest.`);
  }
  
  // Material coordination
  const materials = items.map(item => item.material).filter(Boolean);
  if (materials.length > 0) {
    tips.push(`Materials include ${materials.join(', ').toLowerCase()} for textural harmony.`);
  }
  
  if (isPremium) {
    tips.push(`For ${occasion}, ensure the overall formality level matches the event. Consider the lighting and venue when choosing this combination.`);
    tips.push(`The proportions work well together - the key is maintaining balance between structured and relaxed elements.`);
  }
  
  return tips.join(' ') || `Perfect for ${occasion} - the pieces complement each other beautifully.`;
};

const analyzeColorStory = (items: any[]) => {
  const colors = items.map(item => item.primary_color).filter(Boolean);
  if (colors.length === 0) return 'Neutral and versatile palette';
  
  const uniqueColors = [...new Set(colors)];
  if (uniqueColors.length === 1) return `Monochromatic ${uniqueColors[0].toLowerCase()} theme`;
  if (uniqueColors.length === 2) return `${uniqueColors.join(' and ').toLowerCase()} color duo`;
  return `Multi-tonal palette featuring ${uniqueColors.join(', ').toLowerCase()}`;
};

const analyzeSilhouette = (items: any[]) => {
  const fits = items.map(item => item.fit).filter(Boolean);
  if (fits.length === 0) return 'Balanced proportions';
  
  const uniqueFits = [...new Set(fits)];
  if (uniqueFits.length === 1) return `Consistent ${uniqueFits[0]} silhouette`;
  return `Mixed silhouette combining ${uniqueFits.join(' and ')} fits`;
};

const createBasicFallbackOutfit = (wardrobeItems: any[], occasion: string, isPremium: boolean) => {
  const selectedItems = wardrobeItems.slice(0, 3);
  
  return {
    id: 1,
    name: `Simple ${occasion.charAt(0).toUpperCase() + occasion.slice(1)} Look`,
    items: selectedItems.map(item => item.name),
    item_ids: selectedItems.map(item => item.id),
    confidence: 6,
    styling_tips: generateAdvancedStylingTips(selectedItems, occasion, isPremium),
    color_story: analyzeColorStory(selectedItems),
    silhouette_notes: analyzeSilhouette(selectedItems),
    occasion: occasion
  };
};
