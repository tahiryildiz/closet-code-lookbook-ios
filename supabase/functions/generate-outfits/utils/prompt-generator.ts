
import { createStrictWardrobeList } from './validation.ts';

export const createOutfitPrompt = (wardrobeItems: any[], occasion: string, timeOfDay: string, weather: string, userGender?: string) => {
  const strictWardrobeList = createStrictWardrobeList(wardrobeItems);
  
  // Extract exact item names for reference
  const exactItemNames = wardrobeItems.map(item => item.name || item.subcategory || 'Unknown').filter(name => name !== 'Unknown');
  
  // Enhanced gender-specific context with detailed restrictions
  const genderContext = userGender ? (() => {
    switch (userGender.toLowerCase()) {
      case 'male':
      case 'erkek':
        return `ERKEK STİLİ: Bu bir ERKEK kullanıcı için kombin önerisi oluştur. 
        - ERKEKLERE UYGUN stil önerilerine odaklan
        - Kadın aksesuarları (çanta, kadın ayakkabıları, takılar) ÖNERİLMEMELİ
        - Erkek modasına uygun kombinler oluştur
        - Stil ipuçları erkek kullanıcıya yönelik olmalı`;
      case 'female':
      case 'kadın':
        return `KADIN STİLİ: Bu bir KADIN kullanıcı için kombin önerisi oluştur.
        - KADINLARA UYGUN stil önerilerine odaklan
        - Kadın modasına uygun kombinler oluştur
        - Kadın aksesuarları ve stil ipuçları verilebilir`;
      case 'other':
      case 'diğer':
        return 'UNISEX STİL: Cinsiyetsiz/unisex stil önerilerine uygun kombinler oluştur.';
      default:
        return 'GENEL STİL: Uygun stil önerilerine uygun kombinler oluştur.';
    }
  })() : 'GENEL STİL: Kullanıcının cinsiyetine uygun stil önerilerine uygun kombinler oluştur.';
  
  console.log('Creating prompt with exact item names:', exactItemNames);
  console.log('User gender:', userGender);
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
${userGender ? `- Kullanıcı Cinsiyeti: ${userGender} (ÇOK ÖNEMLİ: Kombinler bu cinsiyete uygun olmalı!)` : ''}

ÇIKTI FORMATI (SADECE JSON):
{
  "outfits": [
    {
      "id": 1,
      "name": "Kombin Adı",
      "items": ["TAM ÜRÜN ADI 1", "TAM ÜRÜN ADI 2"],
      "confidence": 85,
      "styling_tips": "Türkçe stil ipucu (${userGender || 'kullanıcı'}nın cinsiyetine uygun)"
    }
  ]
}

UYARI: Listede olmayan ürün kullanırsan kombin GEÇERSİZ olacak!
${userGender ? `ÖNEMLİ: ${userGender.toUpperCase()} kullanıcı için uygun olmayan öneriler verme!` : ''}
TEKRAR: SADECE ŞU ÜRÜNLERI KULLAN: ${exactItemNames.map(name => `"${name}"`).join(', ')}`;
};
