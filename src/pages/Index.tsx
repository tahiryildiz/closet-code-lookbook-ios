
import { useState, useRef, useEffect } from "react";
import { Heart, Plus, TrendingUp, Sparkles, Cloud, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AnalysisStep from "@/components/AnalysisStep";

const Index = () => {
  const [outfits, setOutfits] = useState([]);
  const [recentItems, setRecentItems] = useState([]);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [location, setLocation] = useState("İstanbul");
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    primaryColor: '',
    tags: '',
    notes: ''
  });
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchOutfits();
    fetchRecentItems();
    fetchUserLocation();
  }, []);

  const fetchUserLocation = async () => {
    try {
      // In a real app, you would get this from user's profile or geolocation
      // For now, we'll keep it as İstanbul as default
      setLocation("İstanbul");
    } catch (error) {
      console.error('Error fetching location:', error);
      setLocation("İstanbul");
    }
  };

  const fetchOutfits = async () => {
    try {
      const { data, error } = await supabase
        .from('outfits')
        .select('*')
        .limit(5)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOutfits(data || []);
    } catch (error) {
      console.error('Error fetching outfits:', error);
    }
  };

  const fetchRecentItems = async () => {
    try {
      const { data, error } = await supabase
        .from('clothing_items')
        .select('*')
        .limit(8)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecentItems(data || []);
    } catch (error) {
      console.error('Error fetching recent items:', error);
    }
  };

  const handleFormDataChange = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleSaveItem = async () => {
    try {
      const { error } = await supabase
        .from('clothing_items')
        .insert({
          name: formData.name || 'Yeni Kıyafet',
          brand: formData.brand,
          category: formData.category || 'üstler',
          primary_color: formData.primaryColor || 'Beyaz',
          style_tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
          user_notes: formData.notes,
          image_url: analysisResult?.imageUrl || '',
          user_id: 'temp-user-id' // Temporary user ID until authentication is implemented
        });

      if (error) throw error;

      toast({
        title: "Başarılı!",
        description: "Ürün gardırobunuza eklendi"
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

      // Refresh recent items
      fetchRecentItems();
    } catch (error) {
      console.error('Error saving item:', error);
      toast({
        title: "Hata",
        description: "Ürün kaydedilirken bir hata oluştu",
        variant: "destructive"
      });
    }
  };

  const handleBackFromAnalysis = () => {
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
  };

  const handleAddProduct = async () => {
    console.log('Index: Add product button clicked');
    
    // Check if we're in a mobile environment that supports Capacitor
    const isCapacitorAvailable = typeof window !== 'undefined' && (window as any).Capacitor;
    
    if (isCapacitorAvailable) {
      try {
        console.log('Index: Attempting to use Capacitor camera');
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          source: CameraSource.Prompt,
          resultType: CameraResultType.DataUrl,
        });

        console.log('Index: Camera image captured successfully');

        if (image.dataUrl) {
          setIsAnalyzing(true);
          
          setTimeout(() => {
            setAnalysisResult({
              name: "Yeni Kıyafet",
              category: "üstler",
              primaryColor: "Beyaz",
              tags: ["rahat", "günlük", "casual"],
              confidence: 85,
              imageUrl: image.dataUrl
            });
            setIsAnalyzing(false);
            setShowAnalysis(true);
          }, 2000);
        }
      } catch (error) {
        console.log('Index: Capacitor camera failed, using file input:', error);
        triggerFileInput();
      }
    } else {
      console.log('Index: Capacitor not available, using file input');
      triggerFileInput();
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      console.log('Index: Triggering file input');
      fileInputRef.current.click();
    } else {
      console.error('Index: File input ref not available');
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Index: File input change event triggered');
    const file = event.target.files?.[0];
    if (file) {
      console.log('Index: File selected:', file.name, 'Size:', file.size, 'Type:', file.type);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        console.log('Index: File read successfully');
        setIsAnalyzing(true);
        
        setTimeout(() => {
          setAnalysisResult({
            name: "Yeni Kıyafet",
            category: "üstler",
            primaryColor: "Beyaz",
            tags: ["rahat", "günlük", "casual"],
            confidence: 85,
            imageUrl: result
          });
          setIsAnalyzing(false);
          setShowAnalysis(true);
        }, 2000);
      };
      reader.onerror = (error) => {
        console.error('Index: File read error:', error);
      };
      reader.readAsDataURL(file);
    } else {
      console.log('Index: No file selected');
    }
    
    // Reset the input value so the same file can be selected again
    event.target.value = '';
  };

  if (showAnalysis) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white">
          <div className="px-6 pt-12 pb-8">
            <h1 className="text-2xl font-medium">Ürün Ekle</h1>
            <p className="text-white/80 text-base mt-1">AI ile otomatik analiz</p>
          </div>
        </div>
        
        <div className="px-4 py-6">
          {analysisResult?.imageUrl && (
            <div className="mb-6">
              <img
                src={analysisResult.imageUrl}
                alt="Selected item"
                className="w-full h-64 object-cover rounded-2xl shadow-lg"
              />
            </div>
          )}
          
          <AnalysisStep
            isAnalyzing={isAnalyzing}
            analysisResult={analysisResult}
            formData={formData}
            onFormDataChange={handleFormDataChange}
            onSave={handleSaveItem}
            onBack={handleBackFromAnalysis}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white">
        <div className="px-6 pt-12 pb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-medium">Merhaba! 👋</h1>
              <p className="text-white/80 text-base mt-1">Gardırobunuzu keşfedin</p>
            </div>
            <Button
              onClick={handleAddProduct}
              className="bg-white/20 hover:bg-white/30 rounded-full h-12 w-12 p-0 backdrop-blur-sm border border-white/20"
            >
              <Plus className="h-6 w-6 text-white" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-8">
        {/* Weather Card */}
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Cloud className="h-5 w-5" />
                  <span className="text-white/90 text-sm">Bugünün Havası</span>
                </div>
                <h3 className="text-2xl font-bold mb-1">22°C</h3>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <p className="text-white/80 text-sm">{location}</p>
                </div>
                <p className="text-white/80 text-sm mt-1">Güneşli ve serin</p>
              </div>
              <div className="text-right">
                <p className="text-white/90 text-sm mb-1">Önerilen</p>
                <p className="text-white font-medium">Hafif kıyafetler</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Outfit Suggestions */}
        {outfits.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-blue-500" />
                Bugün için kombinler
              </h2>
            </div>
            
            <Carousel className="w-full">
              <CarouselContent>
                {outfits.map((outfit) => (
                  <CarouselItem key={outfit.id} className="md:basis-1/2 lg:basis-1/3">
                    <Card className="bg-white border-0 shadow-sm rounded-2xl overflow-hidden">
                      <CardContent className="p-0">
                        <div className="aspect-[4/5] bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                          <div className="text-center text-gray-400">
                            <div className="text-4xl mb-2">✨</div>
                            <div className="text-sm">{outfit.name}</div>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{outfit.season}</span>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full">
                              <Heart className="h-4 w-4 text-gray-400" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">✨</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Kombinler hazırlanıyor</h3>
            <p className="text-gray-500 mb-6">
              İlk ürününüzü ekleyin, size özel kombinler oluşturalım
            </p>
            <Button
              onClick={handleAddProduct}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-6 py-3"
            >
              <Plus className="h-4 w-4 mr-2" />
              İlk Ürününüzü Ekleyin
            </Button>
          </div>
        )}

        {/* Recent Items */}
        {recentItems.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                Son eklenenler  
              </h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {recentItems.slice(0, 4).map((item) => (
                <Card key={item.id} className="bg-white border-0 shadow-sm rounded-2xl overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-square relative overflow-hidden">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <div className="text-center text-gray-400">
                            <div className="text-4xl mb-2">👕</div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-gray-900 text-sm leading-tight">{item.name}</h3>
                      {item.brand && (
                        <p className="text-xs text-gray-500 mt-1">{item.brand}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input for fallback */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default Index;
