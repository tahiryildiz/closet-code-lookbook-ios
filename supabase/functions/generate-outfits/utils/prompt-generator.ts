
import { createStrictWardrobeList } from './validation.ts';

export const createOutfitPrompt = (wardrobeItems: any[], occasion: string, timeOfDay: string, weather: string, userGender?: string) => {
  const strictWardrobeList = createStrictWardrobeList(wardrobeItems);
  
  // Extract exact item names for reference
  const exactItemNames = wardrobeItems.map(item => item.name || item.subcategory || 'Unknown').filter(name => name !== 'Unknown');
  
  // Gender-specific context
  const genderContext = userGender ? (() => {
    switch (userGender) {
      case 'male':
        return 'ERKEK STİLİ: Erkek modası ve stil önerilerine uygun kombinler oluştur. Erkeklere uygun aksesuarlar ve stil ipuçları ver.';
      case 'female':
        return 'KADIN STİLİ: Kadın modası ve stil önerilerine uygun kombinler oluştur. Kadınlara uygun aksesuarlar ve stil ipuçları ver.';
      case 'other':
        return 'UNISEX STİL: Cinsiyetsiz/unisex stil önerilerine uygun kombinler oluştur.';
      default:
        return 'GENEL STİL: Uygun stil önerilerine uygun kombinler oluştur.';
    }
  })() : 'GENEL STİL: Uygun stil önerilerine uygun kombinler oluştur.';
  
  console.log('Creating prompt with exact item names:', exactItemNames);
  console.log('Gender context:', genderContext);
  
  return `SADECE AŞAĞIDA LİSTELENEN ÜRÜNLERI KULLAN - BAŞKA ÜRÜN EKLEME!

🚨 KRİTİK KURALLAR:
1. SADECE bu listeden ürün seç: ${exactItemNames.map(name => `"${name}"`).join(', ')}
2. Ürün isimlerini TAM OLARAK AYNI ŞEKİLDE kullan
3. Her kombinde 2-4 ürün olmalı
4. BAŞKA ÜRÜN EKLEME - sadece yukarıdaki listeden seç
5. Tüm çıktılar Türkçe olmalı
6. ${genderContext}

MEVCUT GARDROBA (SADECE BUNLARI KULLAN):
${strictWardrobeList}

DURUM BİLGİLERİ:
- Durum: ${occasion}
- Zaman: ${timeOfDay}  
- Hava: ${weather}
${userGender ? `- Cinsiyet: ${userGender}` : ''}

ÇIKTI FORMATI (SADECE JSON):
{
  "outfits": [
    {
      "id": 1,
      "name": "Kombin Adı",
      "items": ["TAM ÜRÜN ADI 1", "TAM ÜRÜN ADI 2"],
      "confidence": 85,
      "styling_tips": "Türkçe stil ipucu (kullanıcının cinsiyetine uygun)"
    }
  ]
}

UYARI: Listede olmayan ürün kullanırsan kombin GEÇERSİZ olacak!
TEKRAR: SADECE ŞU ÜRÜNLERI KULLAN: ${exactItemNames.map(name => `"${name}"`).join(', ')}`;
};
