
// Comprehensive localization utility for clothing categories and attributes
export interface LocalizedOption {
  value: string;
  label: string;
}

// Category translations
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

// Comprehensive subcategory translations
export const subcategoryOptions: LocalizedOption[] = [
  // Tops subcategories
  { value: "T-Shirt", label: "Tişört" },
  { value: "Polo Shirt", label: "Polo Tişört" },
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

// Material translations
export const materialOptions: LocalizedOption[] = [
  { value: "Cotton", label: "Pamuk" },
  { value: "Polyester", label: "Polyester" },
  { value: "Wool", label: "Yün" },
  { value: "Denim", label: "Kot" },
  { value: "Linen", label: "Keten" },
  { value: "Silk", label: "İpek" },
  { value: "Cotton-Polyester Blend", label: "Pamuk-Polyester Karışımı" },
  { value: "Viscose", label: "Viskon" },
  { value: "Cashmere", label: "Kaşmir" },
  { value: "Leather", label: "Deri" },
  { value: "Synthetic", label: "Sentetik" },
  { value: "Unknown", label: "Bilinmiyor" }
];

// Fit translations
export const fitOptions: LocalizedOption[] = [
  { value: "Skinny", label: "Dar Kesim" },
  { value: "Slim", label: "Slim Fit" },
  { value: "Slim Fit", label: "Dar Kesim" },
  { value: "Regular", label: "Normal Kesim" },
  { value: "Regular Fit", label: "Normal Kesim" },
  { value: "Relaxed", label: "Rahat Kesim" },
  { value: "Relaxed Fit", label: "Rahat Kesim" },
  { value: "Oversize", label: "Oversize" },
  { value: "Straight", label: "Düz Kesim" },
  { value: "Wide", label: "Geniş Paça" },
  { value: "Wide Leg", label: "Geniş Paça" },
  { value: "Tapered", label: "Daralan Kesim" }
];

// Waist style translations (new field)
export const waistStyleOptions: LocalizedOption[] = [
  { value: "Elastic", label: "Lastikli Bel" },
  { value: "Drawstring", label: "Bağcıklı Bel" },
  { value: "Buttoned", label: "Düğmeli Bel" },
  { value: "Zipper", label: "Fermuarlı Bel" },
  { value: "Belted", label: "Kemerli" }
];

// Closure type translations (new field)
export const closureTypeOptions: LocalizedOption[] = [
  { value: "Zipper", label: "Fermuar" },
  { value: "Buttons", label: "Düğme" },
  { value: "Elastic", label: "Lastik" },
  { value: "None", label: "Yok" }
];

// Pocket style translations (new field)
export const pocketStyleOptions: LocalizedOption[] = [
  { value: "Side", label: "Yan Cep" },
  { value: "Cargo", label: "Kargo Cep" },
  { value: "Slant", label: "Eğimli Cep" },
  { value: "Flap", label: "Kapaklı Cep" },
  { value: "None", label: "Cep Yok" }
];

// Hem style translations (new field)
export const hemStyleOptions: LocalizedOption[] = [
  { value: "Straight", label: "Düz Paça" },
  { value: "Elastic", label: "Lastikli Paça" },
  { value: "Tapered", label: "Daralan Paça" },
  { value: "Drawstring", label: "Bağcıklı Paça" }
];

// Color tone translations
export const colorToneOptions: LocalizedOption[] = [
  { value: "Light", label: "Açık Ton" },
  { value: "Medium", label: "Orta Ton" },
  { value: "Dark", label: "Koyu Ton" },
  { value: "Pastel", label: "Pastel" },
  { value: "Bright", label: "Canlı" }
];

// Pattern translations
export const patternOptions: LocalizedOption[] = [
  { value: "Solid", label: "Düz" },
  { value: "Striped", label: "Çizgili" },
  { value: "Checkered", label: "Ekose" },
  { value: "Checked", label: "Ekose" },
  { value: "Polka Dot", label: "Puantiyeli" },
  { value: "Floral", label: "Çiçekli" },
  { value: "Geometric", label: "Geometrik" },
  { value: "Leopard", label: "Leopar" },
  { value: "Zebra", label: "Zebra" },
  { value: "Printed", label: "Baskılı" },
  { value: "None", label: "Desensiz" }
];

// Season translations
export const seasonOptions: LocalizedOption[] = [
  { value: "Spring", label: "İlkbahar" },
  { value: "Summer", label: "Yaz" },
  { value: "Autumn", label: "Sonbahar" },
  { value: "Winter", label: "Kış" },
  { value: "All Seasons", label: "Tüm Mevsimler" }
];

// Occasion translations
export const occasionOptions: LocalizedOption[] = [
  { value: "Casual", label: "Günlük" },
  { value: "Work", label: "Ofis" },
  { value: "Sport", label: "Spor" },
  { value: "Evening", label: "Gece" },
  { value: "Formal", label: "Resmi" },
  { value: "Holiday", label: "Tatil" },
  { value: "Party", label: "Parti" },
  { value: "Outdoor", label: "Açık Hava" },
  { value: "Travel", label: "Seyahat" }
];

// Helper function to get Turkish label for English value
export const getTurkishLabel = (englishValue: string, options: LocalizedOption[]): string => {
  const option = options.find(opt => opt.value === englishValue);
  return option ? option.label : englishValue;
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
    default:
      return [];
  }
};
