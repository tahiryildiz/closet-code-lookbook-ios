import { parseColor, calculateColorHarmony, calculateContrastBalance, isNeutralColor } from './color-theory.ts';
import { analyzePattern, canMixPatterns, analyzePatternMixing } from './pattern-analysis.ts';
import { analyzeDesignProfile, assessDesignCoordination } from './design-coordination.ts';

export const generateAdvancedFallbackOutfits = (
  wardrobeItems: any[], 
  occasion: string, 
  timeOfDay: string, 
  weather: string, 
  isPremium: boolean = false
) => {
  console.log('🔄 Generating advanced fallback outfits with sophisticated styling rules');
  
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

  // Generate outfits with advanced styling intelligence
  for (let i = 0; i < 3 && outfits.length < 3; i++) {
    const outfit = generateSophisticatedOutfit(
      { tops, bottoms, outerwear, shoes, dresses, accessories },
      wardrobeItems, // Pass wardrobeItems to the outfit generator
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

const generateSophisticatedOutfit = (
  categorizedItems: any,
  wardrobeItems: any[], // Add wardrobeItems parameter
  occasion: string,
  timeOfDay: string,
  weather: string,
  index: number,
  isPremium: boolean
) => {
  const { tops, bottoms, outerwear, shoes, dresses, accessories } = categorizedItems;
  
  // Strategy selection with advanced coordination
  const strategies = [
    () => createColorHarmonyOutfit(dresses, tops, bottoms, outerwear, shoes, accessories, occasion, weather),
    () => createPatternMixingOutfit(tops, bottoms, outerwear, shoes, accessories, occasion, weather),
    () => createContrastBalancedOutfit(tops, bottoms, outerwear, shoes, accessories, wardrobeItems, occasion, weather) // Pass wardrobeItems
  ];

  const strategy = strategies[index % strategies.length];
  const outfit = strategy();

  if (!outfit) return null;

  // Apply advanced analysis
  const colorAnalysis = analyzeColorCoordination(outfit.items);
  const patternAnalysis = analyzePatternMixing(outfit.items);
  const designAnalysis = assessDesignCoordination(outfit.items);
  const contrastAnalysis = calculateContrastBalance(outfit.items);

  // Calculate sophisticated confidence score
  const confidence = calculateAdvancedConfidence(
    colorAnalysis, patternAnalysis, designAnalysis, contrastAnalysis
  );

  return {
    id: index + 1,
    name: generateSophisticatedOutfitName(outfit.items, occasion, colorAnalysis.harmonyType),
    items: outfit.items.map(item => item.name),
    item_ids: outfit.items.map(item => item.id),
    confidence: confidence,
    styling_tips: generateSophisticatedStylingTips(outfit.items, colorAnalysis, patternAnalysis, designAnalysis, occasion, isPremium),
    color_story: colorAnalysis.description,
    silhouette_notes: analyzeSophisticatedSilhouette(outfit.items, contrastAnalysis),
    pattern_analysis: patternAnalysis.mixingAnalysis,
    design_coordination: designAnalysis.coordination,
    occasion: occasion
  };
};

const createColorHarmonyOutfit = (dresses: any[], tops: any[], bottoms: any[], outerwear: any[], shoes: any[], accessories: any[], occasion: string, weather: string) => {
  // Start with a base piece and build harmonious colors around it
  let baseItem = null;
  let items: any[] = [];
  
  if (dresses.length > 0 && Math.random() > 0.5) {
    baseItem = selectItemByColorComplexity(dresses, 'medium');
    items = [baseItem];
  } else if (tops.length > 0 && bottoms.length > 0) {
    baseItem = selectItemByColorComplexity(tops, 'medium');
    const coordinatingBottom = selectHarmoniousItem(bottoms, baseItem);
    if (coordinatingBottom) {
      items = [baseItem, coordinatingBottom];
    }
  }
  
  if (items.length === 0) return null;
  
  // Add coordinating pieces with color theory
  if (outerwear.length > 0 && (weather === 'cold' || weather === 'cool')) {
    const jacket = selectHarmoniousItem(outerwear, baseItem);
    if (jacket) items.push(jacket);
  }
  
  if (shoes.length > 0) {
    const shoe = selectHarmoniousItem(shoes, baseItem);
    if (shoe) items.push(shoe);
  }
  
  return { items };
};

const createPatternMixingOutfit = (tops: any[], bottoms: any[], outerwear: any[], shoes: any[], accessories: any[], occasion: string, weather: string) => {
  // Find items with patterns for sophisticated mixing
  const patternedTops = tops.filter(item => item.pattern && item.pattern !== 'Solid');
  const patternedBottoms = bottoms.filter(item => item.pattern && item.pattern !== 'Solid');
  const solidTops = tops.filter(item => !item.pattern || item.pattern === 'Solid');
  const solidBottoms = bottoms.filter(item => !item.pattern || item.pattern === 'Solid');
  
  let items: any[] = [];
  
  // Strategy: One patterned piece with solid coordinates
  if (patternedTops.length > 0 && solidBottoms.length > 0) {
    const patternedTop = patternedTops[0];
    const solidBottom = selectCoordinatingPiece(solidBottoms, patternedTop, 'bottom');
    if (solidBottom) items = [patternedTop, solidBottom];
  } else if (patternedBottoms.length > 0 && solidTops.length > 0) {
    const patternedBottom = patternedBottoms[0];
    const solidTop = selectCoordinatingPiece(solidTops, patternedBottom, 'top');
    if (solidTop) items = [solidTop, patternedBottom];
  }
  
  // If we can mix patterns safely, try it
  if (items.length === 0 && patternedTops.length > 0 && patternedBottoms.length > 0) {
    for (const top of patternedTops) {
      for (const bottom of patternedBottoms) {
        const topPattern = analyzePattern(top.pattern, top.pattern_type);
        const bottomPattern = analyzePattern(bottom.pattern, bottom.pattern_type);
        const mixing = canMixPatterns(topPattern, bottomPattern);
        
        if (mixing.canMix && mixing.confidence >= 7) {
          items = [top, bottom];
          break;
        }
      }
      if (items.length > 0) break;
    }
  }
  
  if (items.length === 0) return null;
  
  // Add coordinating solid pieces
  if (shoes.length > 0) {
    const neutralShoe = shoes.find(shoe => 
      !shoe.pattern || shoe.pattern === 'Solid'
    ) || shoes[0];
    items.push(neutralShoe);
  }
  
  return { items };
};

const createContrastBalancedOutfit = (tops: any[], bottoms: any[], outerwear: any[], shoes: any[], accessories: any[], wardrobeItems: any[], occasion: string, weather: string) => {
  // Create intentional light/dark contrast
  const lightItems = wardrobeItems.filter(item => {
    if (!item.primary_color) return false;
    const colorInfo = parseColor(item.primary_color, item.color_tone);
    return colorInfo.lightness > 60;
  });
  
  const darkItems = wardrobeItems.filter(item => {
    if (!item.primary_color) return false;
    const colorInfo = parseColor(item.primary_color, item.color_tone);
    return colorInfo.lightness < 40;
  });
  
  let items: any[] = [];
  
  // Try light top + dark bottom or vice versa
  const lightTops = lightItems.filter(item => tops.includes(item));
  const darkBottoms = darkItems.filter(item => bottoms.includes(item));
  const darkTops = darkItems.filter(item => tops.includes(item));
  const lightBottoms = lightItems.filter(item => bottoms.includes(item));
  
  if (lightTops.length > 0 && darkBottoms.length > 0) {
    items = [lightTops[0], darkBottoms[0]];
  } else if (darkTops.length > 0 && lightBottoms.length > 0) {
    items = [darkTops[0], lightBottoms[0]];
  }
  
  if (items.length === 0) return null;
  
  // Add neutral accessories
  if (shoes.length > 0) {
    const neutralShoe = shoes.find(shoe => isNeutralColor(shoe.primary_color || '')) || shoes[0];
    items.push(neutralShoe);
  }
  
  return { items };
};

const selectItemByColorComplexity = (items: any[], complexity: 'simple' | 'medium' | 'complex') => {
  return items.find(item => {
    const hasPattern = item.pattern && item.pattern !== 'Solid';
    const hasMultipleColors = item.secondary_colors && item.secondary_colors.length > 0;
    
    switch (complexity) {
      case 'simple':
        return !hasPattern && !hasMultipleColors;
      case 'medium':
        return hasPattern || hasMultipleColors;
      case 'complex':
        return hasPattern && hasMultipleColors;
      default:
        return true;
    }
  }) || items[0];
};

const selectHarmoniousItem = (items: any[], anchor: any) => {
  if (!anchor.primary_color) return items[0];
  
  const anchorColor = parseColor(anchor.primary_color, anchor.color_tone);
  
  return items.find(item => {
    if (!item.primary_color) return false;
    
    const itemColor = parseColor(item.primary_color, item.color_tone);
    const harmony = calculateColorHarmony(anchorColor, itemColor);
    
    return harmony.compatibility >= 7;
  }) || items[0];
};

const analyzeColorCoordination = (items: any[]) => {
  const colors = items.map(item => 
    item.primary_color ? parseColor(item.primary_color, item.color_tone) : null
  ).filter(Boolean);
  
  if (colors.length < 2) {
    return {
      harmonyType: 'monochromatic',
      compatibility: 8,
      description: 'Single color focus'
    };
  }
  
  // Find the best harmony between any two colors
  let bestHarmony = { harmonyType: 'neutral', compatibility: 5, description: 'Neutral coordination' };
  
  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      const harmony = calculateColorHarmony(colors[i], colors[j]);
      if (harmony.compatibility > bestHarmony.compatibility) {
        bestHarmony = harmony;
      }
    }
  }
  
  return bestHarmony;
};

const calculateAdvancedConfidence = (
  colorAnalysis: any,
  patternAnalysis: any,
  designAnalysis: any,
  contrastAnalysis: any
) => {
  const colorScore = colorAnalysis.compatibility;
  const patternScore = patternAnalysis.score;
  const designScore = designAnalysis.score;
  const contrastScore = contrastAnalysis.score;
  
  // Weighted average with color and design being most important
  const weightedScore = (
    colorScore * 0.3 +
    patternScore * 0.25 +
    designScore * 0.3 +
    contrastScore * 0.15
  );
  
  return Math.round(Math.max(1, Math.min(10, weightedScore)));
};

const generateSophisticatedOutfitName = (items: any[], occasion: string, harmonyType: string) => {
  const adjectives = {
    'monochromatic': ['Refined', 'Elegant', 'Sophisticated'],
    'analogous': ['Harmonious', 'Balanced', 'Coordinated'],
    'complementary': ['Bold', 'Dynamic', 'Striking'],
    'triadic': ['Vibrant', 'Creative', 'Modern'],
    'neutral': ['Classic', 'Timeless', 'Versatile']
  };
  
  const adjectiveList = adjectives[harmonyType as keyof typeof adjectives] || adjectives.neutral;
  const adjective = adjectiveList[Math.floor(Math.random() * adjectiveList.length)];
  const noun = occasion.charAt(0).toUpperCase() + occasion.slice(1);
  
  return `${adjective} ${noun} Ensemble`;
};

const generateSophisticatedStylingTips = (
  items: any[], 
  colorAnalysis: any, 
  patternAnalysis: any, 
  designAnalysis: any, 
  occasion: string, 
  isPremium: boolean
) => {
  const tips = [];
  
  // Color theory explanation
  tips.push(`This outfit demonstrates ${colorAnalysis.description.toLowerCase()} creating visual ${colorAnalysis.harmonyType === 'complementary' ? 'contrast' : 'harmony'}.`);
  
  // Pattern analysis
  if (patternAnalysis.patterns.length > 0) {
    tips.push(`${patternAnalysis.mixingAnalysis} with thoughtful scale relationships.`);
  }
  
  // Design coordination
  if (designAnalysis.suggestions.length === 0) {
    tips.push(`Design elements are well-coordinated with ${designAnalysis.complexityBalance} detailing.`);
  } else if (isPremium) {
    tips.push(`Consider: ${designAnalysis.suggestions[0]}`);
  }
  
  if (isPremium) {
    tips.push(`For ${occasion}, the formality range of ${designAnalysis.formalityRange} creates appropriate sophistication.`);
    tips.push(`The color temperature and tonal relationships follow advanced color theory principles for maximum visual impact.`);
    
    // Add specific styling techniques
    const materials = items.map(item => item.material).filter(Boolean);
    if (materials.length > 1) {
      tips.push(`Textural interplay between ${materials.slice(0, 2).join(' and ')} adds dimensional interest.`);
    }
  }
  
  return tips.join(' ') || `Thoughtfully coordinated ensemble perfect for ${occasion}.`;
};

const analyzeSophisticatedSilhouette = (items: any[], contrastAnalysis: any) => {
  const fits = items.map(item => item.fit).filter(Boolean);
  const silhouetteNote = fits.length > 1 ? 
    `${fits.join(' and ')} fits create proportional balance` : 
    'balanced silhouette';
  
  return `${silhouetteNote} with ${contrastAnalysis.balance} contrast distribution`;
};

const createBasicFallbackOutfit = (wardrobeItems: any[], occasion: string, isPremium: boolean) => {
  const selectedItems = wardrobeItems.slice(0, 3);
  
  return {
    id: 1,
    name: `Classic ${occasion.charAt(0).toUpperCase() + occasion.slice(1)} Look`,
    items: selectedItems.map(item => item.name),
    item_ids: selectedItems.map(item => item.id),
    confidence: 6,
    styling_tips: generateSophisticatedStylingTips(selectedItems, 
      { harmonyType: 'neutral', compatibility: 6, description: 'Neutral coordination' },
      { score: 6, patterns: [], mixingAnalysis: 'Clean aesthetic', recommendations: [] },
      { score: 6, coordination: 'basic coordination', suggestions: [] },
      occasion, 
      isPremium
    ),
    color_story: 'Versatile neutral palette',
    silhouette_notes: 'Balanced proportions',
    pattern_analysis: 'Solid foundation',
    design_coordination: 'Coordinated elements',
    occasion: occasion
  };
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
  
  const color1 = parseColor(item1.primary_color, item1.color_tone);
  const color2 = parseColor(item2.primary_color, item2.color_tone);
  const harmony = calculateColorHarmony(color1, color2);
  
  return harmony.compatibility >= 6;
};

const checkStyleCoherence = (item1: any, item2: any) => {
  if (!item1.style_tags?.length || !item2.style_tags?.length) return true;
  
  // Check for overlapping style tags
  return item1.style_tags.some((tag: string) => item2.style_tags.includes(tag));
};

const checkFormalityLevel = (item1: any, item2: any) => {
  const profile1 = analyzeDesignProfile(item1);
  const profile2 = analyzeDesignProfile(item2);
  
  // Allow mixing if formality difference is reasonable
  return Math.abs(profile1.formalityLevel - profile2.formalityLevel) <= 3;
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
