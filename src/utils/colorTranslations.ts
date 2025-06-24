export const translateColorToTurkish = (color: string): string => {
  const colorMap: { [key: string]: string } = {
    // Basic colors
    'black': 'siyah',
    'white': 'beyaz',
    'red': 'kırmızı',
    'blue': 'mavi',
    'green': 'yeşil',
    'yellow': 'sarı',
    'orange': 'turuncu',
    'purple': 'mor',
    'pink': 'pembe',
    'brown': 'kahverengi',
    'gray': 'gri',
    'grey': 'gri',
    'beige': 'bej',
    'cream': 'krem',
    'gold': 'altın',
    'silver': 'gümüş',
    
    // Navy blue variations
    'navy blue': 'lacivert',
    'navy': 'lacivert',
    'dark blue': 'koyu mavi',
    'light blue': 'açık mavi',
    'sky blue': 'gök mavisi',
    
    // Other shades
    'light green': 'açık yeşil',
    'dark green': 'koyu yeşil',
    'olive': 'zeytin yeşili',
    'olive green': 'zeytin yeşili',
    'khaki': 'haki',
    
    'light gray': 'açık gri',
    'dark gray': 'koyu gri',
    'charcoal': 'antrasit',
    
    'burgundy': 'bordo',
    'maroon': 'bordo',
    'wine': 'şarap kırmızısı',
    
    'lavender': 'lavanta',
    'violet': 'menekşe',
    
    'coral': 'mercan',
    'salmon': 'somon',
    
    'tan': 'ten rengi',
    'camel': 'deve tüyü',
    'nude': 'nude',
    
    // Pattern types
    'striped': 'çizgili',
    'polka dot': 'puantiyeli',
    'floral': 'çiçekli',
    'plaid': 'ekoseli',
    'checkered': 'kareli',
    'solid': 'düz',
    'plain': 'düz'
  };

  // Convert to lowercase for matching
  const lowerColor = color.toLowerCase().trim();
  
  // Return Turkish translation if found, otherwise return original
  return colorMap[lowerColor] || color;
};

export default translateColorToTurkish;
