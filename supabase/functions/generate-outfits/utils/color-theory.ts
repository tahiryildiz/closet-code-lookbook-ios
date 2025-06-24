
export interface ColorInfo {
  hue: number;
  saturation: number;
  lightness: number;
  name: string;
  tone: string;
}

export const parseColor = (colorName: string, tone?: string): ColorInfo => {
  const colorMap: Record<string, { hue: number; saturation: number; lightness: number }> = {
    'red': { hue: 0, saturation: 80, lightness: 50 },
    'orange': { hue: 30, saturation: 80, lightness: 50 },
    'yellow': { hue: 60, saturation: 80, lightness: 70 },
    'green': { hue: 120, saturation: 60, lightness: 50 },
    'blue': { hue: 240, saturation: 80, lightness: 50 },
    'purple': { hue: 280, saturation: 70, lightness: 50 },
    'pink': { hue: 320, saturation: 70, lightness: 70 },
    'brown': { hue: 30, saturation: 40, lightness: 30 },
    'black': { hue: 0, saturation: 0, lightness: 10 },
    'white': { hue: 0, saturation: 0, lightness: 90 },
    'gray': { hue: 0, saturation: 0, lightness: 50 },
    'navy': { hue: 240, saturation: 60, lightness: 25 },
    'beige': { hue: 45, saturation: 20, lightness: 75 },
    'cream': { hue: 50, saturation: 15, lightness: 85 },
    'burgundy': { hue: 0, saturation: 60, lightness: 30 },
    'olive': { hue: 80, saturation: 30, lightness: 40 },
    'teal': { hue: 180, saturation: 60, lightness: 40 },
    'coral': { hue: 15, saturation: 70, lightness: 65 },
    'mint': { hue: 150, saturation: 40, lightness: 80 },
    'lavender': { hue: 280, saturation: 40, lightness: 80 }
  };

  const baseColor = colorMap[colorName.toLowerCase()] || { hue: 0, saturation: 0, lightness: 50 };
  
  // Adjust based on tone
  let adjustedColor = { ...baseColor };
  if (tone) {
    switch (tone.toLowerCase()) {
      case 'light':
        adjustedColor.lightness = Math.min(90, baseColor.lightness + 30);
        adjustedColor.saturation = Math.max(10, baseColor.saturation - 20);
        break;
      case 'dark':
        adjustedColor.lightness = Math.max(10, baseColor.lightness - 30);
        adjustedColor.saturation = Math.min(100, baseColor.saturation + 10);
        break;
      case 'bright':
        adjustedColor.saturation = Math.min(100, baseColor.saturation + 20);
        break;
      case 'muted':
        adjustedColor.saturation = Math.max(10, baseColor.saturation - 30);
        break;
      case 'pastel':
        adjustedColor.lightness = Math.min(85, baseColor.lightness + 25);
        adjustedColor.saturation = Math.max(15, baseColor.saturation - 40);
        break;
    }
  }

  return {
    ...adjustedColor,
    name: colorName,
    tone: tone || 'medium'
  };
};

export const calculateColorHarmony = (color1: ColorInfo, color2: ColorInfo): {
  harmonyType: string;
  compatibility: number;
  description: string;
} => {
  const hueDiff = Math.abs(color1.hue - color2.hue);
  const normalizedDiff = Math.min(hueDiff, 360 - hueDiff);
  
  // Monochromatic (same hue family)
  if (normalizedDiff <= 30) {
    return {
      harmonyType: 'monochromatic',
      compatibility: 9,
      description: 'Sophisticated monochromatic palette'
    };
  }
  
  // Analogous (adjacent colors)
  if (normalizedDiff <= 60) {
    return {
      harmonyType: 'analogous',
      compatibility: 8,
      description: 'Harmonious analogous color scheme'
    };
  }
  
  // Complementary (opposite colors)
  if (normalizedDiff >= 150 && normalizedDiff <= 210) {
    return {
      harmonyType: 'complementary',
      compatibility: 7,
      description: 'Bold complementary contrast'
    };
  }
  
  // Triadic (120 degrees apart)
  if (normalizedDiff >= 90 && normalizedDiff <= 150) {
    return {
      harmonyType: 'triadic',
      compatibility: 6,
      description: 'Dynamic triadic color combination'
    };
  }
  
  // Split-complementary
  if (normalizedDiff >= 60 && normalizedDiff <= 90) {
    return {
      harmonyType: 'split-complementary',
      compatibility: 6,
      description: 'Balanced split-complementary scheme'
    };
  }
  
  return {
    harmonyType: 'neutral',
    compatibility: 5,
    description: 'Neutral color pairing'
  };
};

export const calculateContrastBalance = (items: any[]): {
  score: number;
  lightItems: any[];
  darkItems: any[];
  balance: string;
} => {
  const lightItems: any[] = [];
  const darkItems: any[] = [];
  
  items.forEach(item => {
    if (item.primary_color) {
      const colorInfo = parseColor(item.primary_color, item.color_tone);
      if (colorInfo.lightness > 60) {
        lightItems.push(item);
      } else if (colorInfo.lightness < 40) {
        darkItems.push(item);
      }
    }
  });
  
  const totalItems = lightItems.length + darkItems.length;
  if (totalItems === 0) return { score: 5, lightItems: [], darkItems: [], balance: 'neutral' };
  
  const lightRatio = lightItems.length / totalItems;
  const darkRatio = darkItems.length / totalItems;
  
  let score = 5;
  let balance = 'neutral';
  
  // Ideal balance is having both light and dark elements
  if (lightItems.length > 0 && darkItems.length > 0) {
    if (Math.abs(lightRatio - 0.5) < 0.2) {
      score = 9;
      balance = 'perfectly balanced';
    } else if (Math.abs(lightRatio - 0.3) < 0.1 || Math.abs(lightRatio - 0.7) < 0.1) {
      score = 8;
      balance = 'well balanced';
    } else {
      score = 7;
      balance = 'moderately balanced';
    }
  } else if (lightItems.length === 0) {
    score = 6;
    balance = 'dark-toned';
  } else if (darkItems.length === 0) {
    score = 6;
    balance = 'light-toned';
  }
  
  return { score, lightItems, darkItems, balance };
};

export const isNeutralColor = (colorName: string): boolean => {
  const neutrals = ['black', 'white', 'gray', 'grey', 'beige', 'cream', 'navy', 'brown'];
  return neutrals.includes(colorName.toLowerCase());
};
