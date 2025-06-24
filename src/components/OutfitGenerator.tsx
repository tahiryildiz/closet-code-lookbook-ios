
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { useOutfitDatabase } from "@/hooks/useOutfitDatabase";
import OutfitControls from "./OutfitControls";
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
  image_url?: string;
}

const OutfitGenerator = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { limits, updateUsage, addAdBonus } = useSubscription();
  const { loadOutfits, saveOutfitsToDatabase, saveOutfit } = useOutfitDatabase();
  
  const [occasion, setOccasion] = useState("casual");
  const [timeOfDay, setTimeOfDay] = useState("day");
  const [weather, setWeather] = useState("mild");
  const [loading, setLoading] = useState(false);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [hasItems, setHasItems] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);

  useEffect(() => {
    const loadExistingOutfits = async () => {
      const existingOutfits = await loadOutfits();
      setOutfits(existingOutfits);
    };
    loadExistingOutfits();
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

  const handleSaveOutfit = async (outfitId: number) => {
    const success = await saveOutfit(outfitId, outfits, occasion, timeOfDay, weather);
    if (success) {
      setOutfits(prev => prev.map(o => 
        o.id === outfitId ? { ...o, is_saved: true } : o
      ));
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
          userId: user.id
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

      const processedOutfits = generatedOutfits.map((outfit: any) => ({
        ...outfit,
        styling_tips: outfit.styling_tips,
        is_saved: false,
        generated_image: outfit.image_url || outfit.generated_image,
        image_url: outfit.image_url
      }));

      setOutfits(processedOutfits);
      await saveOutfitsToDatabase(processedOutfits);
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
            <button
              onClick={() => window.location.href = '/wardrobe'}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl"
            >
              Kıyafet Ekle
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <OutfitControls
          occasion={occasion}
          setOccasion={setOccasion}
          timeOfDay={timeOfDay}
          setTimeOfDay={setTimeOfDay}
          weather={weather}
          setWeather={setWeather}
          onGenerate={generateOutfits}
          loading={loading}
          remainingOutfits={limits.remainingOutfits}
          isPremium={limits.isPremium}
        />

        <OutfitLoadingProgress isVisible={loading} />

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

      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        reason="outfits"
      />

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
