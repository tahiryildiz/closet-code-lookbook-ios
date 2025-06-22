
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  validItems: string[];
  invalidItems: string[];
}

export const validateOutfitAgainstWardrobe = (outfit: any, wardrobeItems: any[]): ValidationResult => {
  const wardrobeItemNames = wardrobeItems.map(item => 
    (item.name || item.subcategory || 'Unknown').toLowerCase().trim()
  );
  
  const validItems: string[] = [];
  const invalidItems: string[] = [];
  const errors: string[] = [];
  
  outfit.items.forEach((itemName: string) => {
    const cleanItemName = itemName.toLowerCase().trim();
    const exactMatch = wardrobeItemNames.find(wardrobeName => 
      wardrobeName === cleanItemName ||
      wardrobeName.includes(cleanItemName) ||
      cleanItemName.includes(wardrobeName)
    );
    
    if (exactMatch) {
      validItems.push(itemName);
    } else {
      invalidItems.push(itemName);
      errors.push(`Item "${itemName}" not found in wardrobe`);
    }
  });
  
  // Validate outfit size
  if (outfit.items.length < 2) {
    errors.push('Outfit must have at least 2 items');
  }
  if (outfit.items.length > 4) {
    errors.push('Outfit must have maximum 4 items');
  }
  
  return {
    isValid: errors.length === 0 && invalidItems.length === 0,
    errors,
    validItems,
    invalidItems
  };
};

export const createStrictWardrobeList = (wardrobeItems: any[]): string => {
  return wardrobeItems.map((item, index) => {
    const itemName = item.name || item.subcategory || 'Unknown Item';
    const category = item.category || 'Unknown';
    const color = item.primary_color || '';
    return `${index + 1}. "${itemName}" (${category}${color ? `, ${color}` : ''})`;
  }).join('\n');
};

export const detectDuplicateOutfits = (outfits: any[]): number[] => {
  const duplicateIndices: number[] = [];
  
  for (let i = 0; i < outfits.length; i++) {
    for (let j = i + 1; j < outfits.length; j++) {
      const outfit1Items = outfits[i].items.sort();
      const outfit2Items = outfits[j].items.sort();
      
      // Check if outfits are too similar (only 1 item different)
      const differences = outfit1Items.filter(item => !outfit2Items.includes(item));
      if (differences.length <= 1) {
        duplicateIndices.push(j);
      }
    }
  }
  
  return [...new Set(duplicateIndices)];
};
