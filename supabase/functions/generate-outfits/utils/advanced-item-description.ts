
export const createAdvancedItemDescription = (item: any) => {
  const parts = [];
  
  // Core identification
  const cleanName = item.name?.replace(/^colorless\s+/i, '').trim() || item.subcategory || item.category;
  parts.push(cleanName.toLowerCase());
  
  // Color information with tone
  if (item.primary_color && item.primary_color !== 'colorless') {
    const colorDesc = item.color_tone ? 
      `${item.color_tone.toLowerCase()}-toned ${item.primary_color.toLowerCase()}` : 
      item.primary_color.toLowerCase();
    parts.push(colorDesc);
  }
  
  // Secondary colors for pattern considerations
  if (item.secondary_colors && item.secondary_colors.length > 0) {
    parts.push(`with ${item.secondary_colors.join(' and ').toLowerCase()} accents`);
  }
  
  // Material and texture
  if (item.material) {
    parts.push(`${item.material.toLowerCase()} fabric`);
  }
  
  // Pattern information
  if (item.pattern && item.pattern !== 'Solid') {
    const patternDesc = item.pattern_type ? 
      `${item.pattern.toLowerCase()} ${item.pattern_type.toLowerCase()}` : 
      item.pattern.toLowerCase();
    parts.push(`in ${patternDesc} pattern`);
  }
  
  // Fit and silhouette
  if (item.fit) {
    parts.push(`${item.fit.toLowerCase()}-fit`);
  }
  
  // Specific garment details
  if (item.collar) parts.push(`${item.collar.toLowerCase()} collar`);
  if (item.neckline) parts.push(`${item.neckline.toLowerCase()} neckline`);
  if (item.sleeve) parts.push(`${item.sleeve.toLowerCase()} sleeves`);
  
  // Construction details
  if (item.closure_type) parts.push(`${item.closure_type.toLowerCase()} closure`);
  if (item.waist_style) parts.push(`${item.waist_style.toLowerCase()} waist`);
  
  // Design elements
  if (item.design_details && item.design_details.length > 0) {
    parts.push(`with ${item.design_details.join(', ').toLowerCase()}`);
  }
  
  // Quality indicators
  if (item.has_lining) parts.push('lined');
  if (item.button_count && item.button_count !== '0') parts.push(`${item.button_count} buttons`);
  
  // Brand for style context
  if (item.brand && item.brand !== 'Unknown') {
    parts.push(`by ${item.brand}`);
  }
  
  return parts.join(' ');
};

export const createDetailedWardrobeDescription = (wardrobeItems: any[]) => {
  return wardrobeItems.map((item: any) => {
    const description = createAdvancedItemDescription(item);
    const styleContext = item.style_tags && item.style_tags.length > 0 ? 
      ` (${item.style_tags.join(', ')} style)` : '';
    const seasonContext = item.seasons && item.seasons.length > 0 ? 
      ` suitable for ${item.seasons.join('/')}` : '';
    const occasionContext = item.occasions && item.occasions.length > 0 ? 
      ` appropriate for ${item.occasions.join(', ')}` : '';
    
    return `${description}${styleContext}${seasonContext}${occasionContext}`;
  }).join('\n');
};
