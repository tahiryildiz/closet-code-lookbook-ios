
import { createStrictWardrobeList } from './validation.ts';

export const createOutfitPrompt = (wardrobeItems: any[], occasion: string, timeOfDay: string, weather: string, userGender?: string) => {
  const strictWardrobeList = createStrictWardrobeList(wardrobeItems);
  
  // Extract exact item names for reference
  const exactItemNames = wardrobeItems.map(item => item.name || item.subcategory || 'Unknown').filter(name => name !== 'Unknown');
  
  // Enhanced gender-specific context with very strict restrictions
  const genderContext = userGender ? (() => {
    switch (userGender.toLowerCase()) {
      case 'male':
      case 'erkek':
        return `🚨 ERKEK KULLANICI - KRİTİK KURAL: Bu bir ERKEK kullanıcı için kombin önerisi!
        - ASLA çanta, kadın ayakkabıları, topuklu ayakkabı, takı (küpe, kolye vb.) ÖNERİLMEMELİ
        - ASLA kadına özel aksesuarlar ÖNERİLMEMELİ
        - SADECE erkek modasına uygun kombinler oluştur
        - Stil ipuçları erkek kullanıcıya yönelik olmalı
        - ÇOK ÖNEMLİ: Çanta, topuklu ayakkabı gibi kadın aksesuarları KESİNLİKLE ÖNERİLMEZ`;
      case 'female':
      case 'kadın':
        return `🚨 KADIN KULLANICI: Bu bir KADIN kullanıcı için kombin önerisi.
        - Kadın modasına uygun kombinler oluştur
        - Kadın aksesuarları ve stil ipuçları verilebilir
        - Çanta, topuklu ayakkabı, takılar önerilebilir`;
      case 'other':
      case 'diğer':
        return `🚨 UNISEX STİL: Cinsiyetsiz/unisex stil önerilerine uygun kombinler oluştur.
        - Cinsiyet spesifik aksesuarlar önerilmemeli`;
      default:
        return `🚨 GENEL STİL: Kullanıcının cinsiyetine uygun stil önerilerine uygun kombinler oluştur.`;
    }
  })() : `🚨 CİNSİYET BİLGİSİ YOK: Genel/unisex stil önerilerine uygun kombinler oluştur.`;
  
  console.log('Creating prompt with exact item names:', exactItemNames);
  console.log('User gender:', userGender);
  console.log('Gender context:', genderContext);
  
  return `🚨 SADECE AŞAĞIDA LİSTELENEN ÜRÜNLERI KULLAN - BAŞKA ÜRÜN EKLEME!

${genderContext}

🚨 KRİTİK KURALLAR:
1. SADECE bu listeden ürün seç: ${exactItemNames.map(name => `"${name}"`).join(', ')}
2. Ürün isimlerini TAM OLARAK AYNI ŞEKİLDE kullan
3. Her kombinde 2-4 ürün olmalı
4. BAŞKA ÜRÜN EKLEME - sadece yukarıdaki listeden seç
5. Tüm çıktılar Türkçe olmalı
6. ${userGender === 'male' || userGender === 'erkek' ? 'ERKEK KULLANICI İÇİN: Çanta, topuklu ayakkabı, kadın takıları ASLA ÖNERİLMEZ!' : userGender === 'female' || userGender === 'kadın' ? 'KADIN KULLANICI İÇİN: Tüm aksesuarlar önerilebilir' : 'UNISEX kombinler oluştur'}

MEVCUT GARDROBA (SADECE BUNLARI KULLAN):
${strictWardrobeList}

DURUM BİLGİLERİ:
- Durum: ${occasion}
- Zaman: ${timeOfDay}  
- Hava: ${weather}
${userGender ? `- KULLANICI CİNSİYETİ: ${userGender.toUpperCase()} (ÇOK ÖNEMLİ: Kombinler bu cinsiyete uygun olmalı!)` : ''}

ÇIKTI FORMATI (SADECE JSON):
{
  "outfits": [
    {
      "id": 1,
      "name": "Kombin Adı",
      "items": ["TAM ÜRÜN ADI 1", "TAM ÜRÜN ADI 2"],
      "confidence": 85,
      "styling_tips": "Türkçe stil ipucu (${userGender === 'male' || userGender === 'erkek' ? 'ERKEK kullanıcı için uygun' : userGender === 'female' || userGender === 'kadın' ? 'KADIN kullanıcı için uygun' : 'kullanıcı cinsiyetine uygun'})"
    }
  ]
}

${userGender === 'male' || userGender === 'erkek' ? '🚨 TEKRAR UYARI: ERKEK KULLANICI - Çanta, topuklu ayakkabı, takı KESİNLİKLE ÖNERİLMEZ!' : ''}
UYARI: Listede olmayan ürün kullanırsan kombin GEÇERSİZ olacak!
TEKRAR: SADECE ŞU ÜRÜNLERI KULLAN: ${exactItemNames.map(name => `"${name}"`).join(', ')}`;
};
