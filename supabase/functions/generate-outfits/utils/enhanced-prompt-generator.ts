
import { createDetailedWardrobeDescription } from './advanced-item-description.ts';

export function generateEnhancedPrompt(
  wardrobeItems: any[], 
  occasion: string, 
  timeOfDay: string, 
  weather: string,
  userGender?: string,
  isPremium: boolean = false
): string {
  const itemDescriptions = createDetailedWardrobeDescription(wardrobeItems);
  
  const genderContext = userGender ? `Cinsiyet tercihi: ${userGender}` : '';
  const stylingTipsDetail = isPremium 
    ? "Renk teorisi, desen karışımları, tasarım koordinasyonu ve stil uyumu hakkında detaylı Türkçe stil ipuçları verin (250-350 kelime)."
    : "Renk koordinasyonu, kalıp dengesi ve durum uygunluğu hakkında odaklanmış Türkçe stil ipuçları verin (100-150 kelime).";
  
  // Weather-specific clothing guidance
  const weatherGuidance = getWeatherSpecificGuidance(weather);
  const occasionGuidance = getOccasionSpecificGuidance(occasion, timeOfDay);
  
  return `Sen bir uzman moda stilisti ve Türk moda danışmanısın. Bu detaylı gardırop öğelerinden 3 sofistike kombin oluştur:

${itemDescriptions}

Bağlam:
- Durum: ${occasion}
- Günün vakti: ${timeOfDay}
- Hava durumu: ${weather}
${genderContext}

KRİTİK HAVA DURUMU GEREKSİNİMLERİ:
${weatherGuidance}

DURUM GEREKSİNİMLERİ:
${occasionGuidance}

GELİŞMİŞ STİL KURALLARI:

1. RENK TEORİSİ UZMANLİĞI:
   - İleri renk uyumu uygula: benzer (komşu tonlar), tamamlayıcı (karşıt tonlar), üçlü uyum
   - Renk sıcaklığını dikkate al: sıcak ve soğuk tonları bilinçli karışım olmadıkça karıştırma
   - Nötr renkler (siyah, beyaz, gri, lacivert, bej) cesur renk kombinasyonları için çapa olarak kullan

2. KATMANLI GÖRÜNÜM İLKELERİ:
   - ASLA aynı anda hem tişört hem de kazak/sweatshirt önerme (tişört görünmez olur)
   - Bir üst giyim parçası seç: ya tişört, ya gömlek, ya da kazak/sweatshirt
   - Ceket/blazer gibi dış giyimler diğer üst giyimlerle kombine edilebilir
   - Katmanların uyumlu olması ve pratik giyilebilir olması gerekli

3. TÜRK MODAMIZDAKİ ÖNEMLİ NOKTALAR:
   - Her kombinin Türkçe ismi olmalı (örn: "Şık İş Kombinasyonu", "Rahat Günlük Stil")
   - Stil ipuçları tamamen Türkçe olmalı
   - Türk giyim kültürüne uygun öneriler sun

4. AKSESSUARİ ÇEŞİTLİLİĞİ:
   - Her kombin için farklı aksesuar önerileri sun
   - Standart "beyaz sneakers, siyah ayakkabı, kahverengi saat" tekrarını kaçın
   - Çeşitli aksesuar seçenekleri: çanta, takı, kemer, şapka, eşarp, vb.

ZORUNLU GEREKLER:
- Her kombin 3-5 parça içermeli ve moda-ilerisi görünüm oluşturmalı
- Tüm parçalar verilen gardıroptan olmalı (tam parça isimlerini kullan)
- KESİNLİKLE hava koşulları rehberini takip et
- ${stylingTipsDetail}
- Renk uyumu, tasarım koordinasyonu ve genel sofistikasyon temelinde güven puanı ver (1-10)
- Renk teorisi ve tasarım koordinasyonu seçimlerinin özel açıklamalarını dahil et

Bu yapıyı takip eden JSON dizisi döndür:
[
  {
    "id": 1,
    "name": "Türkçe Kombin İsmi",
    "items": ["tam parça ismi 1", "tam parça ismi 2", "tam parça ismi 3"],
    "item_ids": ["item_id_1", "item_id_2", "item_id_3"],
    "confidence": 9,
    "styling_tips": "Renk teorisi, tasarım koordinasyonu ilkeleriyle detaylı Türkçe stil tavsiyesi...",
    "color_story": "Renk uyumu türü (benzer/tamamlayıcı/vb) ve nedenlerin detaylı analizi",
    "silhouette_notes": "Parçaların orantısal uyumu, kontrast ve denge detayları",
    "design_coordination": "Tasarım detayları, formalite seviyeleri ve yapım unsurları nasıl birbirini tamamlıyor",
    "weather_appropriateness": "Bu kombinin ${weather} hava koşullarına nasıl uygun olduğunun açıklaması",
    "accessories": ["aksesuar 1", "aksesuar 2", "aksesuar 3"],
    "occasion": "${occasion}"
  }
]

${weather} havası için tamamen uygun, sofistike moda bilgisi gösteren, gelişmiş renk teorisi uygulaması ve uzman seviye stil koordinasyonu ile kombinler oluşturmaya odaklan. Her kombinasyon yüksek moda düşüncesi ile pratik giyilebilirliği temsil etmeli.

Sadece geçerli JSON döndür, başka metin yok ve CİDDİ UYARI: ASLA aynı kombinasyonda hem tişört hem de kazak önerme.`;
}

function getWeatherSpecificGuidance(weather: string): string {
  const weatherMap: { [key: string]: string } = {
    'hot': `
- KESİNLİKLE KAÇIN: kalın materyaller, kazak, sweatshirt, kalın mont, yün
- ÖNCELİK VER: hafif pamuklu, keten, ipek, şifon gibi nefes alabilir kumaşlar
- TERCIH ET: tank top, tişört, hafif bluzlar, şort, hafif etekler, sandalet
- ODAK: nefes alabilir materyaller, açık renkler, minimum katman`,
    
    'warm': `
- KAÇIN: kalın yün, kış eşyaları
- UYGUN: hafif pamuk, ipek, hafif hırka, ince ceket
- İYİ: hafif kazak, uzun pantolon, etekle hafif üst`,
    
    'mild': `
- DENGE: hafif ile orta ağırlık kumaşlar iyi çalışır
- UYGUN: pamuk, hafif yün, denim, blazer, hırka
- ESNEKLİK: çoğu gardırop parçası uygun`,
    
    'cool': `
- TERCIH ET: yün, kaşmir, kalın pamuk gibi daha sıcak materyaller
- UYGUN: kazak, hırka, ceket, bot, uzun pantolon
- DİKKATE AL: konfor için katmanlaşma`,
    
    'cold': `
- GEREKLİ: yün, kaşmir, polar gibi sıcak materyaller
- ZORUNLU: kazak, mont, sıcak bot, uzun pantolon
- ODAK: sıcaklık için çoklu katmanlar`,
    
    'rainy': `
- DİKKATE AL: mümkünse su geçirmez materyaller
- TERCIH ET: kapalı ayakkabı, ceket, uzun etekler
- PRATİK: ıslak koşullarda iyi çalışan parçalar`
  };

  return weatherMap[weather.toLowerCase()] || weatherMap['mild'];
}

function getOccasionSpecificGuidance(occasion: string, timeOfDay: string): string {
  const occasionMap: { [key: string]: string } = {
    'party': `
- YÜKSEK STİL: günlük giyimden daha şık ve festif parçalar seç
- DİKKATE AL: ilginç dokular, cesur renkler veya desenler
- UYGUN: dans etmek, sosyalleşmek, fotoğraf çektirmek için
- DENGE: stil ile uzun süre giyim konforu
- ${timeOfDay === 'night' ? 'AKŞAM PARTİSİ: Daha gösterişli olabilir, koyu renkler iyi' : 'GÜNDÜZ PARTİSİ: Daha hafif, yine de festif'}`,
    
    'work': `
- PROFESYONEL GÖRÜNÜM: temiz çizgiler, uygun örtünme
- KAÇIN: çok rahat sporcu giyimi veya plaj kıyafetleri
- TERCIH ET: yapılandırılmış parçalar, blazer, düğmeli gömlek, pantolon
- DENGE: profesyonel ile kişisel stil`,
    
    'dinner': `
- AKILLI RAHATİ VEYA ŞIK: mekana bağlı olarak
- KAÇIN: çok rahat sporcu giyimi
- DİKKATE AL: güzel üstler, kumaş pantolon veya etekler, şık ayakkabılar
- ${timeOfDay === 'evening' ? 'AKŞAM YEMEĞİ: Daha yüksek ve şık stil' : 'ÖĞLE YEMEĞİ: Daha rahat ama güzel'}`,
    
    'casual': `
- RAHAT VE GÜNLÜK: her gün giyilebilir, yine de bir arada
- UYGUN: jeans, tişört, rahat elbiseler, spor ayakkabı
- DENGE: konfor ile stil`,
    
    'date': `
- ÇEKİCİ VE GÜVEN VERİCİ: kendinizi iyi hissettiren parçalar seç
- DENGE: stil ile kişisel tarzınıza özgünlük
- DİKKATE AL: belirli randevu aktivitesi ve mekan
- ${timeOfDay === 'evening' ? 'AKŞAM RANDEVUSU: Daha romantik ve şık olabilir' : 'GÜNDÜZ RANDEVUSU: Daha rahat ama çekici'}`
  };

  return occasionMap[occasion.toLowerCase()] || occasionMap['casual'];
}
