
export interface DesignProfile {
  formalityLevel: number; // 1-10 scale
  structuralElements: string[];
  decorativeElements: string[];
  necklineStyle: string;
  closureType: string;
  overallComplexity: number;
}

export const analyzeDesignProfile = (item: any): DesignProfile => {
  let formalityLevel = 5;
  const structuralElements: string[] = [];
  const decorativeElements: string[] = [];
  
  // Analyze collar and neckline
  const necklineStyle = item.neckline || item.collar || 'standard';
  
  // Formal necklines/collars
  if (['spread collar', 'point collar', 'mandarin collar', 'mock neck', 'turtle neck'].includes(necklineStyle.toLowerCase())) {
    formalityLevel += 2;
    structuralElements.push('formal neckline');
  }
  
  // Casual necklines
  if (['crew neck', 'v-neck', 'scoop neck', 'boat neck'].includes(necklineStyle.toLowerCase())) {
    formalityLevel -= 1;
  }
  
  // Analyze closure type
  const closureType = item.closure_type || 'standard';
  if (['button-up', 'hidden zipper', 'hook and eye'].includes(closureType.toLowerCase())) {
    formalityLevel += 1;
    structuralElements.push('structured closure');
  }
  
  // Analyze design details
  const designDetails = item.design_details || [];
  designDetails.forEach((detail: string) => {
    const detailLower = detail.toLowerCase();
    
    // Formal elements
    if (['pleats', 'darts', 'princess seams', 'tailored fit'].includes(detailLower)) {
      formalityLevel += 1;
      structuralElements.push(detail);
    }
    
    // Decorative elements
    if (['ruffles', 'lace', 'embroidery', 'beading', 'sequins', 'fringe'].includes(detailLower)) {
      decorativeElements.push(detail);
      if (['sequins', 'beading', 'embroidery'].includes(detailLower)) {
        formalityLevel += 1;
      }
    }
    
    // Casual elements
    if (['distressed', 'ripped', 'faded', 'raw hem'].includes(detailLower)) {
      formalityLevel -= 2;
    }
  });
  
  // Analyze material for formality
  const material = item.material?.toLowerCase() || '';
  if (['silk', 'wool', 'cashmere', 'velvet'].includes(material)) {
    formalityLevel += 1;
  } else if (['denim', 'jersey', 'fleece', 'cotton'].includes(material)) {
    formalityLevel -= 1;
  }
  
  // Calculate overall complexity
  const overallComplexity = structuralElements.length + decorativeElements.length + 
    (item.button_count && item.button_count !== '0' ? 1 : 0) +
    (item.has_lining ? 1 : 0);
  
  return {
    formalityLevel: Math.max(1, Math.min(10, formalityLevel)),
    structuralElements,
    decorativeElements,
    necklineStyle,
    closureType,
    overallComplexity
  };
};

export const assessDesignCoordination = (items: any[]): {
  score: number;
  formalityRange: number;
  complexityBalance: string;
  coordination: string;
  suggestions: string[];
} => {
  const profiles = items.map(analyzeDesignProfile);
  
  if (profiles.length === 0) {
    return {
      score: 5,
      formalityRange: 0,
      complexityBalance: 'neutral',
      coordination: 'no items to analyze',
      suggestions: []
    };
  }
  
  // Check formality consistency
  const formalityLevels = profiles.map(p => p.formalityLevel);
  const minFormality = Math.min(...formalityLevels);
  const maxFormality = Math.max(...formalityLevels);
  const formalityRange = maxFormality - minFormality;
  
  let score = 8;
  const suggestions: string[] = [];
  
  // Penalize large formality gaps
  if (formalityRange > 4) {
    score -= 2;
    suggestions.push('Consider balancing formality levels between pieces');
  } else if (formalityRange > 2) {
    score -= 1;
    suggestions.push('Minor formality adjustment could improve coherence');
  }
  
  // Analyze complexity balance
  const complexities = profiles.map(p => p.overallComplexity);
  const totalComplexity = complexities.reduce((sum, c) => sum + c, 0);
  const avgComplexity = totalComplexity / profiles.length;
  
  let complexityBalance = 'neutral';
  if (avgComplexity > 3) {
    complexityBalance = 'high detail';
    if (avgComplexity > 5) {
      score -= 1;
      suggestions.push('Consider simplifying one piece to avoid visual overload');
    }
  } else if (avgComplexity < 1) {
    complexityBalance = 'minimal';
    suggestions.push('Add one statement piece for visual interest');
  } else {
    complexityBalance = 'balanced';
    score += 1;
  }
  
  // Check for decorative element balance
  const totalDecorative = profiles.reduce((sum, p) => sum + p.decorativeElements.length, 0);
  if (totalDecorative > 2) {
    score -= 1;
    suggestions.push('Limit decorative elements to 1-2 pieces maximum');
  }
  
  // Neckline coordination for layered looks
  const upperBodyItems = items.filter(item => 
    ['Tops', 'Outerwear', 'Dresses & Suits'].includes(item.category)
  );
  
  if (upperBodyItems.length > 1) {
    const necklines = upperBodyItems.map(item => item.neckline).filter(Boolean);
    if (necklines.length > 1) {
      // Check for complementary necklines in layering
      const hasHighNeck = necklines.some(n => ['turtle neck', 'mock neck', 'crew neck'].includes(n.toLowerCase()));
      const hasLowNeck = necklines.some(n => ['v-neck', 'scoop neck', 'boat neck'].includes(n.toLowerCase()));
      
      if (hasHighNeck && hasLowNeck) {
        suggestions.push('Layer high and low necklines thoughtfully for visual depth');
      }
    }
  }
  
  return {
    score: Math.max(1, Math.min(10, score)),
    formalityRange,
    complexityBalance,
    coordination: formalityRange <= 2 ? 'well coordinated' : 'needs adjustment',
    suggestions
  };
};
