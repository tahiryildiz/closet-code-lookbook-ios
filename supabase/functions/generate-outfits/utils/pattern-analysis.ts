
export interface PatternInfo {
  type: string;
  scale: 'fine' | 'medium' | 'large';
  complexity: number;
  geometric: boolean;
  organic: boolean;
}

export const analyzePattern = (pattern: string, patternType?: string): PatternInfo => {
  const patternLower = pattern.toLowerCase();
  const typeLower = patternType?.toLowerCase() || '';
  
  let scale: 'fine' | 'medium' | 'large' = 'medium';
  let complexity = 5;
  let geometric = false;
  let organic = false;
  
  // Determine scale
  if (patternLower.includes('fine') || patternLower.includes('small') || patternLower.includes('micro')) {
    scale = 'fine';
  } else if (patternLower.includes('large') || patternLower.includes('bold') || patternLower.includes('oversized')) {
    scale = 'large';
  }
  
  // Determine complexity and type
  switch (patternLower) {
    case 'solid':
      complexity = 1;
      break;
    case 'stripe':
    case 'stripes':
      complexity = 2;
      geometric = true;
      if (typeLower.includes('fine') || typeLower.includes('pinstripe')) scale = 'fine';
      break;
    case 'polka dot':
    case 'dots':
      complexity = 3;
      geometric = true;
      break;
    case 'check':
    case 'checkered':
    case 'gingham':
      complexity = 4;
      geometric = true;
      break;
    case 'plaid':
    case 'tartan':
      complexity = 6;
      geometric = true;
      break;
    case 'floral':
      complexity = 7;
      organic = true;
      break;
    case 'paisley':
      complexity = 8;
      organic = true;
      break;
    case 'animal print':
    case 'leopard':
    case 'zebra':
      complexity = 8;
      organic = true;
      break;
    case 'abstract':
      complexity = 7;
      break;
    case 'geometric':
      complexity = 6;
      geometric = true;
      break;
    default:
      complexity = 5;
  }
  
  return {
    type: pattern,
    scale,
    complexity,
    geometric,
    organic
  };
};

export const canMixPatterns = (pattern1: PatternInfo, pattern2: PatternInfo): {
  canMix: boolean;
  confidence: number;
  reason: string;
} => {
  // Rule 1: One should be solid or very simple
  if (pattern1.complexity <= 2 || pattern2.complexity <= 2) {
    return {
      canMix: true,
      confidence: 9,
      reason: 'Safe pairing with solid or simple pattern'
    };
  }
  
  // Rule 2: Different scales work well together
  if (pattern1.scale !== pattern2.scale) {
    const scaleScore = Math.abs(
      ['fine', 'medium', 'large'].indexOf(pattern1.scale) - 
      ['fine', 'medium', 'large'].indexOf(pattern2.scale)
    );
    
    if (scaleScore >= 2) { // fine + large
      return {
        canMix: true,
        confidence: 8,
        reason: 'Contrasting scales create visual interest'
      };
    } else { // fine + medium or medium + large
      return {
        canMix: true,
        confidence: 7,
        reason: 'Different scales complement each other'
      };
    }
  }
  
  // Rule 3: Mix geometric with organic carefully
  if (pattern1.geometric !== pattern2.organic) {
    if ((pattern1.geometric && pattern2.organic) || (pattern1.organic && pattern2.geometric)) {
      return {
        canMix: pattern1.complexity + pattern2.complexity <= 10,
        confidence: 6,
        reason: 'Geometric and organic patterns can work with careful balance'
      };
    }
  }
  
  // Rule 4: Similar complexity patterns are risky
  if (Math.abs(pattern1.complexity - pattern2.complexity) <= 1 && 
      pattern1.complexity > 4 && pattern2.complexity > 4) {
    return {
      canMix: false,
      confidence: 3,
      reason: 'Similar complex patterns compete for attention'
    };
  }
  
  // Rule 5: Same pattern type in different scales
  if (pattern1.type.toLowerCase() === pattern2.type.toLowerCase() && 
      pattern1.scale !== pattern2.scale) {
    return {
      canMix: true,
      confidence: 8,
      reason: 'Same pattern in different scales creates sophisticated layering'
    };
  }
  
  return {
    canMix: false,
    confidence: 4,
    reason: 'Pattern combination may be too busy'
  };
};

export const analyzePatternMixing = (items: any[]): {
  score: number;
  patterns: PatternInfo[];
  mixingAnalysis: string;
  recommendations: string[];
} => {
  const patterns = items
    .filter(item => item.pattern && item.pattern !== 'Solid')
    .map(item => analyzePattern(item.pattern, item.pattern_type));
  
  if (patterns.length === 0) {
    return {
      score: 8,
      patterns: [],
      mixingAnalysis: 'Clean solid palette',
      recommendations: []
    };
  }
  
  if (patterns.length === 1) {
    return {
      score: 9,
      patterns,
      mixingAnalysis: 'Single pattern creates focal point',
      recommendations: ['Consider adding textural interest through materials']
    };
  }
  
  // Analyze pattern combinations
  let totalScore = 0;
  let combinations = 0;
  const recommendations: string[] = [];
  
  for (let i = 0; i < patterns.length; i++) {
    for (let j = i + 1; j < patterns.length; j++) {
      const mixing = canMixPatterns(patterns[i], patterns[j]);
      totalScore += mixing.confidence;
      combinations++;
      
      if (mixing.confidence < 6) {
        recommendations.push(`Consider simplifying: ${mixing.reason}`);
      }
    }
  }
  
  const averageScore = combinations > 0 ? totalScore / combinations : 8;
  
  return {
    score: Math.round(averageScore),
    patterns,
    mixingAnalysis: combinations > 0 ? 
      `${patterns.length} patterns with ${averageScore >= 7 ? 'good' : 'challenging'} harmony` :
      'Single pattern focus',
    recommendations
  };
};
