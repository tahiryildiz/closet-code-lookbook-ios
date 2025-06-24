
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Sparkles, Wand2, RefreshCw, Briefcase, Utensils, Heart, ShoppingBag, Coffee, Music, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import OutfitCard from "./OutfitCard";
import OutfitLoadingProgress from "./OutfitLoadingProgress";
import PaywallModal from "./PaywallModal";
import AdModal from "./AdModal";

interface Outfit {
  id: number;
  name: string;
  items: string[];
  item_ids?: string[];
  confidence: number;
  styling_tips: string;
  occasion?: string;
  generated_image?: string;
  reference_images?: string[];
  composition_type?: string;
  item_count?: number;
  aspect_ratio?: string;
}

const OutfitGenerator = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { limits, updateUsage, addAdBonus } = useSubscription();
  const [occasion, setOccasion] = useState("casual");
  const [timeOfDay, setTimeOfDay] = useState("day");
  const [weather, setWeather] = useState("mild");
  const [formality, setFormality] = useState("casual");
  const [preferences, setPreferences] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [hasItems, setHasItems] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);

  // Load existing outfits from localStorage on component mount
  useEffect(() => {
    const savedOutfits = localStorage.getItem('generatedOutfits');
    if (savedOutfits) {
      try {
        const parsedOutfits = JSON.parse(savedOutfits);
        setOutfits(parsedOutfits);
      } catch (error) {
        console.error('Error loading saved outfits:', error);
      }
    }
  }, []);

  useEffect(() => {
    const checkItems = async () => {
      if (user) {
        const { count } = await supabase
          .from('clothing_items')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
        
        setHasItems((count || 0) > 0);
      }
    };

    checkItems();
  }, [user]);

  const saveOutfitsToDatabase = async (outfitsData: Outfit[]) => {
    if (!user) return;

    try {
      // Save each outfit to the database
      for (const outfit of outfitsData) {
        const outfitToSave = {
          user_id: user.id,
          name: outfit.name,
          clothing_item_ids: outfit.item_ids || [],
          ai_styling_tips: limits.isPremium ? outfit.styling_tips : outfit.styling_tips?.substring(0, 100) + "...",
          occasion: outfit.occasion || occasion,
          time_of_day: timeOfDay,
          weather_type: weather,
        };

        const { error } = await supabase
          .from('outfits')
          .insert([outfitToSave]);

        if (error) {
          console.error('Error saving outfit to database:', error);
        }
      }

      console.log('Successfully saved outfits to database');
    } catch (error) {
      console.error('Error in saveOutfitsToDatabase:', error);
    }
  };

  const generateOutfits = async () => {
    if (!user) {
      toast({
        title: "Hata",
        description: "Lütfen giriş yapın",
        variant: "destructive"
      });
      return;
    }

    // Check limits before proceeding
    if (!limits.canGenerateOutfit && !limits.isPremium) {
      setShowPaywall(true);
      return;
    }

    setLoading(true);
    
    try {
      const { data: wardrobeItems, error: wardrobeError } = await supabase
        .from('clothing_items')
        .select('*')
        .eq('user_id', user.id);

      if (wardrobeError) throw wardrobeError;

      if (!wardrobeItems || wardrobeItems.length === 0) {
        toast({
          title: "Uyarı",
          description: "Gardırobunuzda henüz kıyafet bulunmuyor. Önce kıyafet ekleyin.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Get user profile for gender information
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('gender')
        .eq('id', user.id)
        .single();

      const response = await supabase.functions.invoke('generate-outfits', {
        body: {
          wardrobeItems,
          occasion,
          timeOfDay,
          weather,
          userGender: userProfile?.gender,
          isPremium: limits.isPremium
        }
      });

      if (response.error) {
        throw new Error(response.error.message || 'API call failed');
      }

      const { outfits: generatedOutfits } = response.data;
      
      if (!generatedOutfits || generatedOutfits.length === 0) {
        toast({
          title: "Uyarı",
          description: "Kombin oluşturulamadı. Lütfen tekrar deneyin.",
          variant: "destructive"
        });
        return;
      }

      // Process styling tips based on subscription
      const processedOutfits = generatedOutfits.map((outfit: Outfit) => ({
        ...outfit,
        styling_tips: limits.isPremium 
          ? outfit.styling_tips 
          : outfit.styling_tips?.substring(0, 100) + "..."
      }));

      setOutfits(processedOutfits);
      
      // Save to localStorage
      localStorage.setItem('generatedOutfits', JSON.stringify(processedOutfits));
      
      // Save to database
      await saveOutfitsToDatabase(processedOutfits);

      // Update usage for free users
      await updateUsage('outfit');

      toast({
        title: "Başarılı!",
        description: `${processedOutfits.length} kombin oluşturuldu!`,
      });

    } catch (error) {
      console.error('Error generating outfits:', error);
      toast({
        title: "Hata",
        description: "Kombin oluşturulurken bir hata oluştu",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdComplete = async () => {
    await addAdBonus('generations');
    setShowAdModal(false);
  };

  const handleWatchAd = () => {
    setShowPaywall(false);
    setShowAdModal(true);
  };

  if (!hasItems) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20 px-4 pt-6">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm rounded-2xl max-w-md mx-auto mt-20">
          <CardContent className="p-8 text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz Kıyafet Yok</h3>
            <p className="text-gray-600 mb-6">
              Kombin oluşturmak için önce gardırobunuza kıyafet eklemeniz gerekiyor.
            </p>
            <Button
              onClick={() => window.location.href = '/wardrobe'}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl"
            >
              Kıyafet Ekle
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const occasions = [
    { id: "work", label: "İş", icon: Briefcase },
    { id: "dinner", label: "Yemek", icon: Utensils },
    { id: "date", label: "Randevu", icon: Heart },
    { id: "shopping", label: "Alışveriş", icon: ShoppingBag },
    { id: "coffee", label: "Kahve", icon: Coffee },
    { id: "party", label: "Parti", icon: Music },
    { id: "casual", label: "Günlük", icon: Home },
  ];

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Kombin Oluştur</h2>
          <p className="text-gray-600">Mükemmel kombinini oluşturalım</p>
        </div>

        {/* Controls */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6 space-y-6">
            {!limits.isPremium && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
                <p className="text-blue-700 text-sm font-medium">
                  Kalan kombin hakkı: {limits.remainingOutfits}
                </p>
              </div>
            )}

            {/* What's the occasion? */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Durum nedir?</h3>
              <div className="grid grid-cols-4 gap-3">
                {occasions.map((occ) => {
                  const IconComponent = occ.icon;
                  return (
                    <button
                      key={occ.id}
                      onClick={() => setOccasion(occ.id)}
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        occasion === occ.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <IconComponent className="h-8 w-8 mx-auto mb-2" />
                      <span className="text-sm font-medium block">{occ.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Level of formality */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Resmiyet seviyesi</h3>
              <ToggleGroup 
                type="single" 
                value={formality} 
                onValueChange={(value) => value && setFormality(value)}
                className="grid grid-cols-3 gap-2"
              >
                <ToggleGroupItem 
                  value="casual" 
                  className="data-[state=on]:bg-blue-600 data-[state=on]:text-white rounded-xl py-3"
                >
                  Günlük
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="semi-formal" 
                  className="data-[state=on]:bg-blue-600 data-[state=on]:text-white rounded-xl py-3"
                >
                  Yarı Resmi
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="formal" 
                  className="data-[state=on]:bg-blue-600 data-[state=on]:text-white rounded-xl py-3"
                >
                  Resmi
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Preferences */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Tercihler</h3>
              <ToggleGroup 
                type="multiple" 
                value={preferences} 
                onValueChange={setPreferences}
                className="grid grid-cols-2 gap-2"
              >
                <ToggleGroupItem 
                  value="comfort" 
                  className="data-[state=on]:bg-blue-600 data-[state=on]:text-white rounded-xl py-3"
                >
                  Konfor Öncelikli
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="trends" 
                  className="data-[state=on]:bg-blue-600 data-[state=on]:text-white rounded-xl py-3"
                >
                  Trendleri Takip Et
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="minimal" 
                  className="data-[state=on]:bg-blue-600 data-[state=on]:text-white rounded-xl py-3"
                >
                  Minimal Stil
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="colorful" 
                  className="data-[state=on]:bg-blue-600 data-[state=on]:text-white rounded-xl py-3"
                >
                  Renkli
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Zaman</label>
                <Select value={timeOfDay} onValueChange={setTimeOfDay}>
                  <SelectTrigger className="w-full bg-white border-gray-200 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Sabah</SelectItem>
                    <SelectItem value="day">Gündüz</SelectItem>
                    <SelectItem value="evening">Akşam</SelectItem>
                    <SelectItem value="night">Gece</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Hava Durumu</label>
                <Select value={weather} onValueChange={setWeather}>
                  <SelectTrigger className="w-full bg-white border-gray-200 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hot">Sıcak</SelectItem>
                    <SelectItem value="warm">Ilık</SelectItem>
                    <SelectItem value="mild">Orta</SelectItem>
                    <SelectItem value="cool">Serin</SelectItem>
                    <SelectItem value="cold">Soğuk</SelectItem>
                    <SelectItem value="rainy">Yağmurlu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={generateOutfits}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 rounded-xl transition-all duration-200 text-lg"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  Oluşturuluyor...
                </>
              ) : (
                <>
                  <Wand2 className="h-5 w-5 mr-2" />
                  Kombin Oluştur
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Loading Progress */}
        <OutfitLoadingProgress isVisible={loading} />

        {/* Generated Outfits */}
        {outfits.length > 0 && !loading && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 px-2">Önerilen Kombinler</h2>
            <div className="grid gap-6">
              {outfits.map((outfit) => (
                <OutfitCard key={outfit.id} outfit={outfit} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Paywall Modal */}
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        reason="outfits"
      />

      {/* Ad Modal */}
      <AdModal
        isOpen={showAdModal}
        onClose={() => setShowAdModal(false)}
        onComplete={handleAdComplete}
        type="generations"
      />
    </>
  );
};

export default OutfitGenerator;
