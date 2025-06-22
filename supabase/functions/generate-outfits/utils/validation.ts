
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  validItems: string[];
  invalidItems: string[];
}

export const validateOutfitAgainstWardrobe = (outfit: any, wardrobeItems: any[]): ValidationResult => {
  // Create exact name mapping from wardrobe
  const exactWardrobeNames = wardrobeItems.map(item => {
    const name = item.name || item.subcategory || 'Unknown';
    return name.trim();
  });
  
  console.log('Wardrobe names for validation:', exactWardrobeNames);
  console.log('Outfit items to validate:', outfit.items);
  
  const validItems: string[] = [];
  const invalidItems: string[] = [];
  const errors: string[] = [];
  
  outfit.items.forEach((itemName: string) => {
    const cleanItemName = itemName.trim();
    
    // STRICT exact match only - no fuzzy matching
    const exactMatch = exactWardrobeNames.find(wardrobeName => 
      wardrobeName === cleanItemName
    );
    
    if (exactMatch) {
      validItems.push(itemName);
      console.log(`✓ VALID: "${itemName}" found in wardrobe`);
    } else {
      invalidItems.push(itemName);
      errors.push(`INVALID: "${itemName}" not found in wardrobe`);
      console.log(`✗ INVALID: "${itemName}" not found in wardrobe`);
      console.log('Available names:', exactWardrobeNames);
    }
  });
  
  // Validate outfit size
  if (outfit.items.length < 2) {
    errors.push('Outfit must have at least 2 items');
  }
  if (outfit.items.length > 4) {
    errors.push('Outfit must have maximum 4 items');
  }
  
  const isValid = errors.length === 0 && invalidItems.length === 0;
  
  console.log(`Validation result for outfit "${outfit.name}": ${isValid ? 'VALID' : 'INVALID'}`);
  if (!isValid) {
    console.log('Validation errors:', errors);
    console.log('Invalid items:', invalidItems);
  }
  
  return {
    isValid,
    errors,
    validItems,
    invalidItems
  };
};

export const createStrictWardrobeList = (wardrobeItems: any[]): string => {
  const itemsList = wardrobeItems.map((item, index) => {
    const itemName = item.name || item.subcategory || 'Unknown Item';
    const category = item.category || 'Unknown';
    const color = item.primary_color || '';
    return `${index + 1}. "${itemName}" (${category}${color ? `, ${color}` : ''})`;
  }).join('\n');
  
  console.log('Created strict wardrobe list:', itemsList);
  return itemsList;
};

export const detectDuplicateOutfits = (outfits: any[]): number[] => {
  const duplicateIndices: number[] = [];
  
  for (let i = 0; i < outfits.length; i++) {
    for (let j = i + 1; j < outfits.length; j++) {
      const outfit1Items = [...outfits[i].items].sort();
      const outfit2Items = [...outfits[j].items].sort();
      
      // Check if outfits are identical or too similar (only 1 item different)
      let differences = 0;
      const maxLength = Math.max(outfit1Items.length, outfit2Items.length);
      
      for (let k = 0; k < maxLength; k++) {
        if (outfit1Items[k] !== outfit2Items[k]) {
          differences++;
        }
      }
      
      if (differences <= 1) {
        duplicateIndices.push(j);
        console.log(`Duplicate detected: Outfit ${i + 1} and ${j + 1} are too similar`);
      }
    }
  }
  
  return [...new Set(duplicateIndices)];
};
