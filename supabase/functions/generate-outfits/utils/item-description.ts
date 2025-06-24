
export const createItemDescription = (item: any) => {
  const parts = [];
  
  // Add color and tone information
  if (item.primary_color && item.primary_color !== 'colorless') {
    parts.push(item.primary_color);
  }
  if (item.color_tone) {
    parts.push(`${item.color_tone.toLowerCase()} tone`);
  }
  
  // Add material and fit
  if (item.material) parts.push(item.material.toLowerCase());
  if (item.fit) parts.push(`${item.fit.toLowerCase()}-fit`);
  
  // Add specific garment details
  if (item.sleeve) parts.push(item.sleeve.toLowerCase());
  if (item.neckline) parts.push(item.neckline.toLowerCase());
  if (item.pattern && item.pattern !== 'Solid') parts.push(item.pattern.toLowerCase());
  
  // Add the main item name
  const cleanName = item.name?.replace(/^colorless\s+/i, '').trim() || item.subcategory || item.category;
  parts.push(cleanName.toLowerCase());
  
  // Add construction details if available
  if (item.closure_type) parts.push(`with ${item.closure_type.toLowerCase()}`);
  if (item.pocket_style && item.pocket_style !== 'No Pockets') parts.push(`${item.pocket_style.toLowerCase()}`);
  
  return parts.join(' ');
};

export const createWardrobeDescription = (wardrobeItems: any[]) => {
  return wardrobeItems.map((item: any) => {
    const description = createItemDescription(item);
    const brand = item.brand && item.brand !== 'Unknown' ? `, ${item.brand}` : '';
    return `${description} (${item.category}${brand})`;
  }).join(', ');
};
