
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wand2, RefreshCw, Briefcase, Utensils, Heart, ShoppingBag, Coffee, Music, Home } from "lucide-react";
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
  is_saved?: boolean;
  image_url?: string; // Store the flatlay image URL
}

const OutfitGenerator = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { limits, updateUsage, addAdBonus } = useSubscription();
  const [occasion, setOccasion] = useState("casual");
  const [timeOfDay, setTimeOfDay] = useState("day");
  const [weather, setWeather] = useState("mild");
  const [loading, setLoading] = useState(false);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [hasItems, setHasItems] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);

  // Load existing outfits from database only (remove localStorage logic)
  useEffect(() => {
    const loadOutfits = async () => {
      if (!user) return;

      try {
        // Load from database (recent outfits that are not saved)
        const { data: dbOutfits, error } = await supabase
          .from('outfits')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_saved', false) // Only get non-saved outfits for outfit generator
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) {
          console.error('Error loading outfits from database:', error);
          return;
        }

        if (dbOutfits && dbOutfits.length > 0) {
          // Convert database outfits to display format
          const formattedOutfits = await Promise.all(
            dbOutfits.map(async (outfit, index) => {
              // Get actual item names and images for each outfit
              let items: string[] = [];
              let reference_images: string[] = [];
              
              if (outfit.clothing_item_ids && outfit.clothing_item_ids.length > 0) {
                const { data: itemsData } = await supabase
                  .from('clothing_items')
                  .select('name, image_url')
                  .in('id', outfit.clothing_item_ids);

                if (itemsData) {
                  items = itemsData.map(item => item.name);
                  reference_images = itemsData.map(item => item.image_url).filter(Boolean);
                }
              }

              return {
                id: index + 1,
                name: outfit.name,
                items: items,
                item_ids: outfit.clothing_item_ids || [],
                confidence: 8,
                styling_tips: outfit.ai_styling_tips || '',
                occasion: outfit.occasion,
                is_saved: outfit.is_saved || false,
                reference_images: reference_images,
                // Use the stored flatlay image URL if available, otherwise fall back to generated_image
                generated_image: outfit.image_url || null,
                image_url: outfit.image_url || null,
                composition_type: outfit.image_url ? 'professional_flatlay_vertical' : 'reference_fallback'
              };
            })
          );

          setOutfits(formattedOutfits);
        }
      } catch (error) {
        console.error('Error in loadOutfits:', error);
      }
    };

    loadOutfits();
  }, [user]);

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
    if (!user) return [];

    const savedOutfitIds: string[] = [];

    try {
      // Save each outfit to the database
      for (const outfit of outfitsData) {
        const outfitToSave = {
          user_id: user.id,
          name: outfit.name,
          clothing_item_ids: outfit.item_ids || [],
          ai_styling_tips: outfit.styling_tips,
          occasion: outfit.occasion || occasion,
          time_of_day: timeOfDay,
          weather_type: weather,
          is_saved: false, // These are generated outfits, not saved ones
          image_url: outfit.image_url || null, // Store the flatlay image URL
        };

        const { data, error } = await supabase
          .from('outfits')
          .insert([outfitToSave])
          .select('id')
          .single();

        if (error) {
          console.error('Error saving outfit to database:', error);
        } else if (data) {
          savedOutfitIds.push(data.id);
        }
      }

      console.log('Successfully saved outfits to database');
    } catch (error) {
      console.error('Error in saveOutfitsToDatabase:', error);
    }

    return savedOutfitIds;
  };

  const handleSaveOutfit = async (outfitId: number) => {
    if (!user) {
      toast({
        title: "Hata",
        description: "Lütfen giriş yapın",
        variant: "destructive"
      });
      return;
    }

    try {
      const outfit = outfits.find(o => o.id === outfitId);
      if (!outfit) return;

      const outfitToSave = {
        user_id: user.id,
        name: outfit.name,
        clothing_item_ids: outfit.item_ids || [],
        ai_styling_tips: outfit.styling_tips,
        occasion: outfit.occasion || occasion,
        time_of_day: timeOfDay,
        weather_type: weather,
        is_saved: true,
        saved_at: new Date().toISOString(),
        image_url: outfit.image_url || null, // Include the flatlay image URL
      };

      const { error } = await supabase
        .from('outfits')
        .insert([outfitToSave]);

      if (error) throw error;

      // Update local state
      setOutfits(prev => prev.map(o => 
        o.id === outfitId ? { ...o, is_saved: true } : o
      ));

      toast({
        title: "Başarılı!",
        description: "Kombin kaydedildi!",
      });

    } catch (error) {
      console.error('Error saving outfit:', error);
      toast({
        title: "Hata",
        description: "Kombin kaydedilemedi",
        variant: "destructive"
      });
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
          isPremium: limits.isPremium,
          userId: user.id // Pass userId for image storage
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

      // Process outfits and ensure proper image handling
      const processedOutfits = generatedOutfits.map((outfit: any) => ({
        ...outfit,
        styling_tips: outfit.styling_tips,
        is_saved: false,
        // Prioritize the uploaded flatlay image over generated base64
        generated_image: outfit.image_url || outfit.generated_image,
        image_url: outfit.image_url
      }));

      setOutfits(processedOutfits);
      
      // Save to database and get the saved IDs
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
              <Wand2 className="h-8 w-8 text-blue-600" />
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
        {/* Controls */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6 space-y-6">
            {!limits.isPremium && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
                <p className="text-blue-700 text-sm font-medium">
                  Kalan kombin hakkı: {Math.max(0, limits.remainingOutfits)}
                </p>
              </div>
            )}

            {/* Nerede Giyeceksin? */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Nerede Giyeceksin?</h3>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Zaman</label>
                <Select value={timeOfDay} onValueChange={setTimeOfDay}>
                  <SelectTrigger className="w-full bg-white border-2 border-gray-200 rounded-2xl h-12 font-medium">
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
                  <SelectTrigger className="w-full bg-white border-2 border-gray-200 rounded-2xl h-12 font-medium">
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
                <OutfitCard key={outfit.id} outfit={outfit} onSave={handleSaveOutfit} />
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
