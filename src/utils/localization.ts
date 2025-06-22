
// Localization utility for clothing categories and attributes
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
  { value: "Slim Fit", label: "Dar Kesim" },
  { value: "Regular Fit", label: "Normal Kesim" },
  { value: "Relaxed Fit", label: "Rahat Kesim" },
  { value: "Oversize", label: "Oversize" },
  { value: "Skinny", label: "Dar Kesim" },
  { value: "Straight", label: "Düz Kesim" },
  { value: "Wide Leg", label: "Geniş Paça" },
  { value: "Tapered", label: "Daralan Kesim" }
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
  { value: "Polka Dot", label: "Puantiyeli" },
  { value: "Floral", label: "Çiçekli" },
  { value: "Geometric", label: "Geometrik" },
  { value: "Leopard", label: "Leopar" },
  { value: "Zebra", label: "Zebra" },
  { value: "Printed", label: "Baskılı" }
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
  { value: "Work", label: "İş" },
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
