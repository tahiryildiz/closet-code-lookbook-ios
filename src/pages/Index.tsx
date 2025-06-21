import { useState, useEffect, useRef } from "react";
import { Plus, TrendingUp, Calendar, Sun, CloudRain, ChevronRight, Zap, Lightbulb, MapPin, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AnalysisStep from "@/components/AnalysisStep";

const Index = () => {
  const [location, setLocation] = useState<{lat: number, lon: number, name?: string} | null>(null);
  const [weather, setWeather] = useState<any>(null);
  const [recentItems, setRecentItems] = useState<any[]>([]);
  const [mostWornItems, setMostWornItems] = useState<any[]>([]);
  const [weatherOutfits, setWeatherOutfits] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalOutfits: 0, streakDays: 0 });
  const [totalItems, setTotalItems] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    primaryColor: '',
    tags: '',
    notes: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Only request location if we don't have it stored and haven't shown the toast
    const storedLocation = localStorage.getItem('userLocation');
    const locationToastShown = localStorage.getItem('locationToastShown');
    
    if (storedLocation) {
      const parsedLocation = JSON.parse(storedLocation);
      setLocation(parsedLocation);
      fetchWeatherData(parsedLocation.lat, parsedLocation.lon, parsedLocation.name);
    } else if (!locationToastShown) {
      requestLocationPermission();
    }
    fetchUserData();
  }, []);

  const requestLocationPermission = async () => {
    if ("geolocation" in navigator) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
          });
        });
        
        const { latitude, longitude } = position.coords;
        
        // Get location name using reverse geocoding
        try {
          const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=tr`);
          const locationData = await response.json();
          const locationName = locationData.city || locationData.locality || locationData.countryName || "Bilinmeyen Konum";
          
          const locationInfo = { lat: latitude, lon: longitude, name: locationName };
          setLocation(locationInfo);
          localStorage.setItem('userLocation', JSON.stringify(locationInfo));
          fetchWeatherData(latitude, longitude, locationName);
        } catch (error) {
          console.error("Reverse geocoding error:", error);
          const locationInfo = { lat: latitude, lon: longitude, name: "Konum Alındı" };
          setLocation(locationInfo);
          localStorage.setItem('userLocation', JSON.stringify(locationInfo));
          fetchWeatherData(latitude, longitude, "Konum Alındı");
        }
        
        toast({
          title: "Konum erişimi sağlandı",
          description: "Hava durumuna göre kıyafet önerileri alabiliriz",
        });
        localStorage.setItem('locationToastShown', 'true');
      } catch (error) {
        console.error("Location error:", error);
        toast({
          title: "Konum erişimi",
          description: "Konum izni verilmedi. Hava durumu önerileri sınırlı olacak.",
          variant: "destructive"
        });
        localStorage.setItem('locationToastShown', 'true');
      }
    }
  };

  const fetchWeatherData = async (lat: number, lon: number, locationName: string) => {
    try {
      // Mock weather data - you can integrate with a real weather API
      setWeather({
        location: locationName,
        condition: "Güneşli",
        temperature: 22,
        icon: "☀️"
      });
    } catch (error) {
      console.error("Weather fetch error:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      // Fetch recent items from clothing_items table
      const { data: items } = await supabase
        .from('clothing_items')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4);

      setRecentItems(items || []);
      setTotalItems(items?.length || 0);

      // Fetch most worn items (items with highest wear_count)
      const { data: mostWorn } = await supabase
        .from('clothing_items')
        .select('*')
        .order('wear_count', { ascending: false })
        .limit(3);

      setMostWornItems(mostWorn || []);

      // Fetch weather-appropriate items based on current season/weather
      const { data: weatherItems } = await supabase
        .from('clothing_items')
        .select('*')
        .limit(4);

      setWeatherOutfits(weatherItems || []);

      // Calculate stats from outfits table
      const { data: outfits } = await supabase
        .from('outfits')
        .select('*');

      setStats({
        totalOutfits: outfits?.length || 0,
        streakDays: 0 // Calculate streak based on outfit creation dates
      });

    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleAddProduct = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `clothing/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('clothing-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast({
          title: "Yükleme hatası",
          description: "Fotoğraf yüklenirken bir hata oluştu",
          variant: "destructive"
        });
        setIsAnalyzing(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('clothing-images')
        .getPublicUrl(filePath);

      setTimeout(() => {
        setAnalysisResult({
          name: "Yeni Kıyafet",
          category: "üstler",
          primaryColor: "Beyaz",
          suggestedBrand: "",
          tags: ["rahat", "günlük"],
          confidence: 85,
          material: "Pamuk",
          season: "Tüm Mevsim",
          style: "Casual",
          imageUrl: publicUrl
        });
        setIsAnalyzing(false);
        setShowAnalysis(true);
      }, 2000);
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "İşlem hatası",
        description: "Fotoğraf işlenirken bir hata oluştu",
        variant: "destructive"
      });
      setIsAnalyzing(false);
    }
  };

  const handleFormDataChange = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('clothing_items')
        .insert({
          name: formData.name || analysisResult?.name,
          brand: formData.brand,
          category: formData.category || analysisResult?.category,
          primary_color: formData.primaryColor || analysisResult?.primaryColor,
          style_tags: formData.tags ? formData.tags.split(', ') : analysisResult?.tags,
          user_notes: formData.notes,
          image_url: analysisResult?.imageUrl,
          material: analysisResult?.material,
          user_id: '00000000-0000-0000-0000-000000000000'
        });

      if (error) {
        console.error('Save error:', error);
        toast({
          title: "Kaydetme hatası",
          description: "Ürün kaydedilirken bir hata oluştu",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Başarılı!",
        description: "Ürün gardırobunuza eklendi",
      });

      // Reset state
      setShowAnalysis(false);
      setAnalysisResult(null);
      setFormData({
        name: '',
        brand: '',
        category: '',
        primaryColor: '',
        tags: '',
        notes: ''
      });
      
      // Refresh data
      fetchUserData();
    } catch (error) {
      console.error('Error saving item:', error);
      toast({
        title: "Hata",
        description: "Beklenmeyen bir hata oluştu",
        variant: "destructive"
      });
    }
  };

  const handleBackToUpload = () => {
    setShowAnalysis(false);
    setAnalysisResult(null);
    setIsAnalyzing(false);
    setFormData({
      name: '',
      brand: '',
      category: '',
      primaryColor: '',
      tags: '',
      notes: ''
    });
  };

  const EmptyCarousel = ({ title, description }: { title: string, description: string }) => (
    <div className="text-center py-8">
      <div className="text-4xl mb-2">👗</div>
      <h4 className="font-medium text-gray-900 mb-1">{title}</h4>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );

  const EmptyWardrobeGuide = () => (
    <div className="text-center py-12 px-6">
      <div className="bg-blue-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
        <Upload className="h-10 w-10 text-blue-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">Gardırobunuz Boş</h3>
      <p className="text-gray-600 text-base leading-relaxed mb-8 max-w-sm mx-auto">
        Kıyafetlerinizin fotoğraflarını çekerek gardırobunuzu oluşturun. 
        AI'mız her şeyi analiz edip size özel kombin önerileri sunacak!
      </p>
      <Button
        onClick={handleAddProduct}
        className="bg-blue-900 hover:bg-blue-800 text-white font-semibold px-8 py-3 rounded-2xl text-base"
      >
        <Plus className="h-5 w-5 mr-2" />
        İlk Ürününüzü Ekleyin
      </Button>
    </div>
  );

  // Show analysis step if we have analysis result
  if (showAnalysis && analysisResult) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white px-6 pt-12 pb-8">
          <h1 className="text-2xl font-medium mb-6">Ürün Analizi</h1>
        </div>
        <div className="px-4 py-6">
          <AnalysisStep
            isAnalyzing={isAnalyzing}
            analysisResult={analysisResult}
            formData={formData}
            onFormDataChange={handleFormDataChange}
            onSave={handleSave}
            onBack={handleBackToUpload}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header with dark blue background */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white">
        <div className="px-6 pt-12 pb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-medium">Günaydın</h1>
            <Button
              onClick={requestLocationPermission}
              variant="ghost"
              size="sm"
              className="text-white/80 hover:text-white hover:bg-white/10 rounded-2xl"
            >
              <MapPin className="h-4 w-4 mr-1" />
              Konum
            </Button>
          </div>
          
          <p className="text-white/80 text-base mb-6">Bugün ne giymek istiyorsun?</p>
          
          {/* Weather Card */}
          <Card className="bg-white/15 backdrop-blur-sm border-white/20 text-white rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{weather?.icon || "🌤️"}</div>
                  <div>
                    <div className="text-sm text-white/80">{weather?.location || location?.name || "Konum bekleniyor"}</div>
                    <div className="font-medium">{weather?.condition || "Bilinmiyor"}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-light">{weather?.temperature || "--"}°C</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-8">
        {totalItems === 0 ? (
          /* Empty wardrobe guide */
          <div className="text-center py-12 px-6">
            <div className="bg-blue-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <Upload className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Gardırobunuz Boş</h3>
            <p className="text-gray-600 text-base leading-relaxed mb-8 max-w-sm mx-auto">
              Kıyafetlerinizin fotoğraflarını çekerek gardırobunuzu oluşturun. 
              AI'mız her şeyi analiz edip size özel kombin önerileri sunacak!
            </p>
            <Button
              onClick={handleAddProduct}
              className="bg-blue-900 hover:bg-blue-800 text-white font-semibold px-8 py-3 rounded-2xl text-base"
            >
              <Plus className="h-5 w-5 mr-2" />
              İlk Ürününüzü Ekleyin
            </Button>
          </div>
        ) : (
          <>
            {/* Bugünün havası için şahane gider */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Bugünün havası için şahane gider</h2>
              {weatherOutfits.length > 0 ? (
                <Carousel className="w-full">
                  <CarouselContent>
                    {weatherOutfits.map((item) => (
                      <CarouselItem key={item.id} className="basis-[35%]">
                        <Card className="bg-white border-0 shadow-sm rounded-2xl overflow-hidden">
                          <CardContent className="p-0">
                            <div className="aspect-square bg-gray-100">
                              {item.image_url ? (
                                <img
                                  src={item.image_url}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <div className="text-center">
                                    <div className="text-2xl mb-1">👕</div>
                                    <div className="text-xs">Resim yok</div>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="p-3">
                              <h4 className="font-medium text-gray-900 text-sm truncate">{item.name}</h4>
                              <p className="text-xs text-gray-500 mt-1">{item.category}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              ) : (
                <EmptyCarousel 
                  title="Henüz ürün yok" 
                  description="Gardırobunuza ürün ekleyerek hava durumuna uygun öneriler alın"
                />
              )}
            </div>

            {/* Add Product + Generate AI Outfit Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleAddProduct}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-2xl text-base"
              >
                <Plus className="h-5 w-5 mr-2" />
                Ürün Ekle
              </Button>
              
              <Button 
                disabled={totalItems === 0}
                className="w-full bg-blue-900 hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-2xl text-base"
              >
                <Zap className="h-5 w-5 mr-2" />
                AI Kombin Oluştur
              </Button>
            </div>

            {/* Style Tip of the Day */}
            <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-0 shadow-sm rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-pink-100 p-3 rounded-full">
                    <Lightbulb className="h-6 w-6 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Günün Stil İpucu</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Katmanlama, geçiş mevsimlerinde çok önemlidir. Hafif bir süveter ile üstüne çıkarabilir 
                      veya hava ısınırsa çıkarabilirsiniz.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Son Eklenenler */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Son Eklenenler</h2>
                <Button variant="ghost" className="text-blue-600 hover:text-blue-700 p-0 text-sm rounded-2xl">
                  Hepsini Gör
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              {recentItems.length > 0 ? (
                <Carousel className="w-full">
                  <CarouselContent>
                    {recentItems.map((item) => (
                      <CarouselItem key={item.id} className="basis-[35%]">
                        <Card className="bg-white border-0 shadow-sm rounded-2xl overflow-hidden">
                          <CardContent className="p-0">
                            <div className="aspect-square bg-gray-100">
                              {item.image_url ? (
                                <img
                                  src={item.image_url}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <div className="text-center">
                                    <div className="text-2xl mb-1">👕</div>
                                    <div className="text-xs">Resim yok</div>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="p-3">
                              <h4 className="font-medium text-gray-900 text-sm truncate">{item.name}</h4>
                              <p className="text-xs text-gray-500 mt-1">{item.category}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              ) : (
                <EmptyCarousel 
                  title="Henüz eklenen ürün yok" 
                  description="Gardırobunuza ilk ürününüzü ekleyin"
                />
              )}
            </div>

            {/* En Çok Giydiklerin */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">En Çok Giydiklerin</h2>
                <Button variant="ghost" className="text-blue-600 hover:text-blue-700 p-0 text-sm rounded-2xl">
                  Hepsini Gör
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              {mostWornItems.length > 0 ? (
                <Carousel className="w-full">
                  <CarouselContent>
                    {mostWornItems.map((item) => (
                      <CarouselItem key={item.id} className="basis-[35%]">
                        <Card className="bg-white border-0 shadow-sm rounded-2xl overflow-hidden relative">
                          <CardContent className="p-0">
                            <div className="aspect-square bg-gray-100 relative">
                              {item.image_url ? (
                                <img
                                  src={item.image_url}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <div className="text-center">
                                    <div className="text-2xl mb-1">👕</div>
                                    <div className="text-xs">Resim yok</div>
                                  </div>
                                </div>
                              )}
                              {item.wear_count > 0 && (
                                <div className="absolute top-2 right-2">
                                  <div className="bg-blue-900 text-white text-xs font-medium px-2 py-1 rounded-full">
                                    {item.wear_count}×
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="p-3">
                              <h4 className="font-medium text-gray-900 text-sm truncate">{item.name}</h4>
                              <p className="text-xs text-gray-500 mt-1">{item.category}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              ) : (
                <EmptyCarousel 
                  title="Henüz kullanım verisi yok" 
                  description="Ürünlerinizi kullandıkça istatistikler burada görünecek"
                />
              )}
            </div>

            {/* Quick Stats - Only show if there's actual data */}
            {(stats.totalOutfits > 0) && (
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-white border-0 shadow-sm rounded-2xl">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-100 p-3 rounded-full">
                        <TrendingUp className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{stats.totalOutfits}</div>
                        <div className="text-sm text-gray-600">Kombin Oluşturuldu</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white border-0 shadow-sm rounded-2xl">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 p-3 rounded-full">
                        <Calendar className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{stats.streakDays}</div>
                        <div className="text-sm text-gray-600">Gün Üst Üste</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
      </div>

      {/* Hidden file input for direct camera/gallery access - with proper capture attribute for iOS */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Loading overlay when analyzing */}
      {isAnalyzing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="font-semibold text-gray-900 mb-2">Fotoğraf Analiz Ediliyor</h3>
            <p className="text-gray-600 text-sm">AI'mız ürününüzü inceliyor...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
