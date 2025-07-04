// Comprehensive localization utility for clothing categories and attributes
export interface LocalizedOption {
  value: string;
  label: string;
}

// Category translations (updated)
export const categoryOptions: LocalizedOption[] = [
  { value: "Tops", label: "Üstler" },
  { value: "Bottoms", label: "Altlar" },
  { value: "Dresses & Suits", label: "Elbise & Takım" },
  { value: "Outerwear", label: "Dış Giyim" },
  { value: "Footwear", label: "Ayakkabı" },
  { value: "Accessories", label: "Aksesuar" },
  { value: "Bags", label: "Çanta" },
  { value: "Underwear & Loungewear", label: "İç Giyim" },
  { value: "Swimwear", label: "Mayo & Bikini" },
  { value: "Activewear", label: "Spor Giyim" }
];

// Color translations (comprehensive with compound colors first)
export const colorOptions: LocalizedOption[] = [
  // Compound colors first (most specific matches)
  { value: "Olive Green", label: "Zeytin Yeşili" },
  { value: "Light Blue", label: "Açık Mavi" },
  { value: "Dark Blue", label: "Koyu Mavi" },
  { value: "Light Gray", label: "Açık Gri" },
  { value: "Light Grey", label: "Açık Gri" },
  { value: "Dark Gray", label: "Koyu Gri" },
  { value: "Dark Grey", label: "Koyu Gri" },
  { value: "Light Pink", label: "Açık Pembe" },
  { value: "Dark Pink", label: "Koyu Pembe" },
  { value: "Light Green", label: "Açık Yeşil" },
  { value: "Dark Green", label: "Koyu Yeşil" },
  { value: "Forest Green", label: "Orman Yeşili" },
  { value: "Mint Green", label: "Nane Yeşili" },
  { value: "Army Green", label: "Asker Yeşili" },
  
  // Single colors
  { value: "Black", label: "Siyah" },
  { value: "White", label: "Beyaz" },
  { value: "Gray", label: "Gri" },
  { value: "Grey", label: "Gri" },
  { value: "Blue", label: "Mavi" },
  { value: "Navy", label: "Lacivert" },
  { value: "Red", label: "Kırmızı" },
  { value: "Green", label: "Yeşil" },
  { value: "Yellow", label: "Sarı" },
  { value: "Pink", label: "Pembe" },
  { value: "Purple", label: "Mor" },
  { value: "Brown", label: "Kahverengi" },
  { value: "Orange", label: "Turuncu" },
  { value: "Beige", label: "Bej" },
  { value: "Cream", label: "Krem" },
  { value: "Olive", label: "Zeytin Yeşili" },
  { value: "Khaki", label: "Haki" },
  { value: "Rust", label: "Pas Rengi" },
  { value: "Maroon", label: "Bordo" },
  { value: "Burgundy", label: "Bordo" },
  { value: "Teal", label: "Petrol Mavisi" },
  { value: "Turquoise", label: "Turkuaz" },
  { value: "Coral", label: "Mercan" },
  { value: "Gold", label: "Altın" },
  { value: "Silver", label: "Gümüş" },
  { value: "Unknown", label: "Bilinmiyor" }
];

// Updated subcategory translations with T-shirt focus
export const subcategoryOptions: LocalizedOption[] = [
  // T-shirt specific subcategories
  { value: "TShirt", label: "Tişört" },
  { value: "TankTop", label: "Atlet" },
  { value: "LongSleeve", label: "Uzun Kollu Tişört" },
  { value: "Henley", label: "Henley Yaka" },
  
  // Other tops subcategories
  { value: "T-Shirt", label: "Tişört" },
  { value: "Polo Shirt", label: "Polo Yaka" },
  { value: "Polo", label: "Polo Yaka" },
  { value: "Shirt", label: "Gömlek" },
  { value: "Blouse", label: "Bluz" },
  { value: "Sweatshirt", label: "Sweatshirt" },
  { value: "Hoodie", label: "Kapüşonlu" },
  { value: "Tank Top", label: "Askılı" },
  { value: "Crop Top", label: "Kısa Üst" },
  { value: "Tunic", label: "Tunik" },
  { value: "Bodysuit", label: "Body" },
  { value: "Bustier", label: "Büstiy" },
  { value: "Kimono", label: "Kimono" },
  
  // Bottoms subcategories
  { value: "Jeans", label: "Kot Pantolon" },
  { value: "Chinos", label: "Chino Pantolon" },
  { value: "Joggers", label: "Eşofman Altı" },
  { value: "Cargo", label: "Kargo Pantolon" },
  { value: "DressPants", label: "Klasik Pantolon" },
  { value: "Shorts", label: "Şort" },
  { value: "Trousers", label: "Pantolon" },
  { value: "Skirt", label: "Etek" },
  { value: "Culottes", label: "Bol Etek" },
  { value: "Leggings", label: "Tayt" },
  { value: "Cargo Pants", label: "Kargo Pantolon" },
  
  // Outerwear subcategories
  { value: "Blazer", label: "Blazer" },
  { value: "Coat", label: "Palto" },
  { value: "Jacket", label: "Ceket" },
  { value: "Trench Coat", label: "Trençkot" },
  { value: "Parka", label: "Parka" },
  { value: "Overcoat", label: "Kabanv" },
  { value: "Cardigan", label: "Hırka" },
  { value: "Gilet", label: "Yelek" },
  
  // Dresses & Suits subcategories
  { value: "Mini Dress", label: "Mini Elbise" },
  { value: "Midi Dress", label: "Midi Elbise" },
  { value: "Maxi Dress", label: "Maksi Elbise" },
  { value: "Evening Gown", label: "Gece Elbisesi" },
  { value: "Cocktail Dress", label: "Kokteyl Elbisesi" },
  { value: "Jumpsuit", label: "Tulum" },
  { value: "Romper", label: "Şort Tulum" },
  { value: "Suit", label: "Takım" },
  { value: "Abaya", label: "Abaya" },
  
  // Footwear subcategories
  { value: "Sneakers", label: "Spor Ayakkabı" },
  { value: "Loafers", label: "Loafer" },
  { value: "Boots", label: "Bot" },
  { value: "Heels", label: "Topuklu" },
  { value: "Flats", label: "Babet" },
  { value: "Sandals", label: "Sandalet" },
  { value: "Slippers", label: "Terlik" },
  { value: "Espadrilles", label: "Espadril" },
  { value: "Oxford Shoes", label: "Klasik Ayakkabı" },
  
  // Accessories subcategories
  { value: "Belt", label: "Kemer" },
  { value: "Watch", label: "Saat" },
  { value: "Sunglasses", label: "Güneş Gözlüğü" },
  { value: "Scarf", label: "Eşarp" },
  { value: "Hat", label: "Şapka" },
  { value: "Beanie", label: "Bere" },
  { value: "Gloves", label: "Eldiven" },
  { value: "Tie", label: "Kravat" },
  { value: "Bowtie", label: "Papyon" },
  { value: "Necklace", label: "Kolye" },
  { value: "Earrings", label: "Küpe" },
  
  // Bags subcategories
  { value: "Backpack", label: "Sırt Çantası" },
  { value: "Crossbody Bag", label: "Çapraz Çanta" },
  { value: "Shoulder Bag", label: "Omuz Çantası" },
  { value: "Clutch", label: "El Çantası" },
  { value: "Tote", label: "Büyük Çanta" },
  { value: "Briefcase", label: "Evrak Çantası" },
  { value: "Wallet", label: "Cüzdan" },
  
  // Underwear & Loungewear subcategories
  { value: "Bra", label: "Sutyen" },
  { value: "Panties", label: "Külot" },
  { value: "Boxer", label: "Boxer" },
  { value: "Pajamas", label: "Pijama" },
  { value: "Camisole", label: "Atlet" },
  { value: "Robe", label: "Bornoz" },
  { value: "Thermals", label: "Termal" },
  
  // Swimwear subcategories
  { value: "Bikini", label: "Bikini" },
  { value: "One-piece Swimsuit", label: "Mayo" },
  { value: "Trunks", label: "Mayo" },
  { value: "Swim Shorts", label: "Deniz Şortu" },
  { value: "Swim Shirt", label: "Deniz Tişörtü" },
  
  // Activewear subcategories
  { value: "Sports Bra", label: "Spor Sütyeni" },
  { value: "Leggings", label: "Spor Tayt" },
  { value: "Tank Top", label: "Spor Atlet" },
  { value: "Tracksuit", label: "Eşofman" },
  { value: "Gym Shorts", label: "Spor Şort" },
  { value: "Rash Guard", label: "Dalış Tişörtü" }
];

// Updated material translations with T-shirt focus
export const materialOptions: LocalizedOption[] = [
  { value: "Cotton", label: "Pamuk" },
  { value: "Polyester", label: "Polyester" },
  { value: "Modal", label: "Modal" },
  { value: "Linen", label: "Keten" },
  { value: "Elastane", label: "Elastan" },
  { value: "Silk", label: "İpek" },
  { value: "Denim", label: "Kot" },
  { value: "Wool", label: "Yün" },
  { value: "Cotton-Polyester Blend", label: "Pamuk-Polyester Karışımı" },
  { value: "Viscose", label: "Viskon" },
  { value: "Cashmere", label: "Kaşmir" },
  { value: "Leather", label: "Deri" },
  { value: "Synthetic", label: "Sentetik" },
  { value: "Unknown", label: "Bilinmiyor" }
];

// Updated fit translations
export const fitOptions: LocalizedOption[] = [
  { value: "Slim", label: "Dar Kesim" },
  { value: "Regular", label: "Normal Kesim" },
  { value: "Relaxed", label: "Rahat Kesim" },
  { value: "Oversize", label: "Bol Kesim" },
  { value: "Skinny", label: "Dar Kesim" },
  { value: "Slim Fit", label: "Dar Kesim" },
  { value: "Regular Fit", label: "Normal Kesim" },
  { value: "Relaxed Fit", label: "Rahat Kesim" },
  { value: "Straight", label: "Düz Kesim" },
  { value: "Wide", label: "Geniş Paça" },
  { value: "Wide Leg", label: "Geniş Paça" },
  { value: "Tapered", label: "Daralan Kesim" }
];

// Updated sleeve length options
export const sleeveLengthOptions: LocalizedOption[] = [
  { value: "Short", label: "Kısa Kol" },
  { value: "Long", label: "Uzun Kol" },
  { value: "Sleeveless", label: "Kolsuz" },
  { value: "ThreeQuarter", label: "3/4 Kol" }
];

// Updated neckline options with T-shirt focus
export const necklineOptions: LocalizedOption[] = [
  { value: "CrewNeck", label: "Bisiklet Yaka" },
  { value: "VNeck", label: "V Yaka" },
  { value: "Henley", label: "Henley Yaka" },
  { value: "Polo", label: "Polo Yaka" },
  { value: "ButtonDown", label: "Düğmeli Yaka" },
  { value: "Spread", label: "Geniş Yaka" },
  { value: "Mandarin", label: "Çin Yakası" },
  { value: "Classic", label: "Klasik Yaka" },
  { value: "None", label: "Yakasız" }
];

// NEW: Design details options
export const designDetailsOptions: LocalizedOption[] = [
  { value: "LogoPrint", label: "Logo Baskı" },
  { value: "Embroidered", label: "Nakışlı" },
  { value: "ChestPrint", label: "Göğüs Baskı" },
  { value: "BackPrint", label: "Sırt Baskı" },
  { value: "NoDesign", label: "Desensiz" },
  { value: "GraphicPrint", label: "Grafik Baskı" },
  { value: "TextPrint", label: "Yazı Baskı" },
  { value: "AllOverPrint", label: "Tam Baskı" }
];

// Collar style options (updated)
export const collarStyleOptions: LocalizedOption[] = [
  { value: "ButtonDown", label: "Düğmeli Yaka" },
  { value: "Spread", label: "Geniş Yaka" },
  { value: "Mandarin", label: "Çin Yakası" },
  { value: "Classic", label: "Klasik Yaka" },
  { value: "None", label: "Yakasız" }
];

export const closureTypeOptions: LocalizedOption[] = [
  { value: "Buttons", label: "Düğme" },
  { value: "Zipper", label: "Fermuar" },
  { value: "Snap", label: "Çıtçıt" },
  { value: "Elastic", label: "Lastik" },
  { value: "None", label: "Yok" }
];

export const cuffStyleOptions: LocalizedOption[] = [
  { value: "Button", label: "Düğmeli Manşet" },
  { value: "French", label: "Fransız Manşet" },
  { value: "Elastic", label: "Lastikli Manşet" },
  { value: "None", label: "Manşetsiz" }
];

export const pocketStyleOptions: LocalizedOption[] = [
  { value: "SingleChest", label: "Tek Göğüs Cebi" },
  { value: "DoubleChest", label: "Çift Göğüs Cebi" },
  { value: "NoPocket", label: "Cepsiz" },
  { value: "Side", label: "Yan Cep" },
  { value: "Cargo", label: "Kargo Cep" },
  { value: "Slant", label: "Eğimli Cep" },
  { value: "Flap", label: "Kapaklı Cep" },
  { value: "None", label: "Cep Yok" }
];

export const waistStyleOptions: LocalizedOption[] = [
  { value: "Elastic", label: "Lastikli Bel" },
  { value: "Drawstring", label: "Bağcıklı Bel" },
  { value: "Buttoned", label: "Düğmeli Bel" },
  { value: "Zipper", label: "Fermuarlı Bel" },
  { value: "Belted", label: "Kemerli" }
];

export const hemStyleOptions: LocalizedOption[] = [
  { value: "Straight", label: "Düz Paça" },
  { value: "Elastic", label: "Lastikli Paça" },
  { value: "Tapered", label: "Daralan Paça" },
  { value: "Drawstring", label: "Bağcıklı Paça" }
];

// Updated color tone translations
export const colorToneOptions: LocalizedOption[] = [
  { value: "Light", label: "Açık Ton" },
  { value: "Medium", label: "Orta Ton" },
  { value: "Dark", label: "Koyu Ton" },
  { value: "Pastel", label: "Pastel" },
  { value: "Bright", label: "Canlı" }
];

// Updated pattern translations with T-shirt focus
export const patternOptions: LocalizedOption[] = [
  { value: "Solid", label: "Düz" },
  { value: "Printed", label: "Baskılı" },
  { value: "Striped", label: "Çizgili" },
  { value: "Graphic", label: "Grafik Desenli" },
  { value: "Checked", label: "Ekose" },
  { value: "Checkered", label: "Ekose" },
  { value: "Polka Dot", label: "Puantiyeli" },
  { value: "Floral", label: "Çiçekli" },
  { value: "Geometric", label: "Geometrik" },
  { value: "Leopard", label: "Leopar" },
  { value: "Zebra", label: "Zebra" },
  { value: "None", label: "Desensiz" }
];

// Updated season translations with T-shirt focus
export const seasonOptions: LocalizedOption[] = [
  { value: "Spring", label: "İlkbahar" },
  { value: "Summer", label: "Yaz" },
  { value: "Autumn", label: "Sonbahar" },
  { value: "Winter", label: "Kış" },
  { value: "All Seasons", label: "Tüm Mevsimler" }
];

// Updated occasion translations with T-shirt focus
export const occasionOptions: LocalizedOption[] = [
  { value: "Casual", label: "Günlük" },
  { value: "Sport", label: "Spor" },
  { value: "Outdoor", label: "Açık Hava" },
  { value: "Home", label: "Ev Rahatlığı" },
  { value: "Travel", label: "Seyahat" },
  { value: "Work", label: "Ofis" },
  { value: "Party", label: "Parti" },
  { value: "Formal", label: "Resmi" },
  { value: "Evening", label: "Gece" },
  { value: "Holiday", label: "Tatil" }
];

// Enhanced helper function to get Turkish label for English value with better matching
export const getTurkishLabel = (englishValue: string, options: LocalizedOption[]): string => {
  if (!englishValue) return englishValue;
  
  // First try exact match
  const exactMatch = options.find(opt => opt.value === englishValue);
  if (exactMatch) return exactMatch.label;
  
  // For colors specifically, try case-insensitive match
  if (options === colorOptions) {
    const caseInsensitiveMatch = options.find(opt => 
      opt.value.toLowerCase() === englishValue.toLowerCase()
    );
    if (caseInsensitiveMatch) return caseInsensitiveMatch.label;
  }
  
  return englishValue;
};

// Helper function to get English value for Turkish label
export const getEnglishValue = (turkishLabel: string, options: LocalizedOption[]): string => {
  const option = options.find(opt => opt.label === turkishLabel);
  return option ? option.value : turkishLabel;
};

// Helper function to get all available options for a category
export const getOptionsForCategory = (category: string): LocalizedOption[] => {
  switch (category) {
    case 'category':
      return categoryOptions;
    case 'subcategory':
      return subcategoryOptions;
    case 'material':
      return materialOptions;
    case 'fit':
      return fitOptions;
    case 'sleeveLength':
      return sleeveLengthOptions;
    case 'neckline':
      return necklineOptions;
    case 'designDetails':
      return designDetailsOptions;
    case 'collarStyle':
      return collarStyleOptions;
    case 'cuffStyle':
      return cuffStyleOptions;
    case 'waistStyle':
      return waistStyleOptions;
    case 'closureType':
      return closureTypeOptions;
    case 'pocketStyle':
      return pocketStyleOptions;
    case 'hemStyle':
      return hemStyleOptions;
    case 'colorTone':
      return colorToneOptions;
    case 'pattern':
      return patternOptions;
    case 'seasons':
      return seasonOptions;
    case 'occasions':
      return occasionOptions;
    case 'colors':
      return colorOptions;
    default:
      return [];
  }
};
