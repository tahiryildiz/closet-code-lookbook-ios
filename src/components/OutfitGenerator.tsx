import { useState, useEffect } from "react";
import { Wand2, Clock, MapPin, Thermometer, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import OutfitCard from "./OutfitCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import OutfitLoadingProgress from "./OutfitLoadingProgress";

interface WardrobeItem {
  id: string;
  name: string;
  category: string;
  image_url: string;
  primary_color: string;
  brand?: string;
  fit?: string;
  collar?: string;
  sleeve?: string;
  pattern?: string;
  color_tone?: string;
  context_tags?: string[];
  prompt_description?: string;
  material?: string;
}

const OutfitGenerator = () => {
  const { user } = useAuth();
  const [occasion, setOccasion] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('');
  const [weather, setWeather] = useState('');
  const [generatedOutfits, setGeneratedOutfits] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [wardrobeItems, setWardrobeItems] = useState<WardrobeItem[]>([]);
  const [userGender, setUserGender] = useState<string>('');

  // Fetch user's wardrobe items and profile
  useEffect(() => {
    fetchWardrobeItems();
    fetchUserProfile();
    // Load previously generated outfits from localStorage
    loadPreviousOutfits();
  }, [user]);

  const loadPreviousOutfits = () => {
    try {
      const savedOutfits = localStorage.getItem('generatedOutfits');
      if (savedOutfits) {
        const outfits = JSON.parse(savedOutfits);
        setGeneratedOutfits(outfits);
      }
    } catch (error) {
      console.error('Error loading previous outfits:', error);
    }
  };

  const savePreviousOutfits = (outfits: any[]) => {
    try {
      localStorage.setItem('generatedOutfits', JSON.stringify(outfits));
    } catch (error) {
      console.error('Error saving outfits:', error);
    }
  };

  const fetchUserProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('gender')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      setUserGender(data?.gender || '');
      console.log('Fetched user gender:', data?.gender);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchWardrobeItems = async () => {
    try {
      const { data, error } = await supabase
        .from('clothing_items')
        .select(`
          id, name, category, image_url, primary_color, brand,
          fit, collar, sleeve, pattern, color_tone, context_tags,
          prompt_description, material
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching wardrobe items:', error);
        return;
      }

      setWardrobeItems(data || []);
    } catch (error) {
      console.error('Error fetching wardrobe items:', error);
    }
  };

  const generateOutfits = async () => {
    if (!occasion || !timeOfDay || !weather) return;
    
    if (wardrobeItems.length === 0) {
      toast.error('Kombinler oluşturmak için önce gardırobunuza ürün ekleyin');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      console.log('Generating outfits with user gender:', userGender);
      
      const { data, error } = await supabase.functions.invoke('generate-outfits', {
        body: { 
          occasion, 
          timeOfDay, 
          weather,
          userGender,
          wardrobeItems: wardrobeItems.map(item => ({
            id: item.id,
            name: item.name,
            category: item.category,
            color: item.primary_color,
            brand: item.brand,
            image_url: item.image_url,
            fit: item.fit,
            collar: item.collar,
            sleeve: item.sleeve,
            pattern: item.pattern,
            color_tone: item.color_tone,
            context_tags: item.context_tags,
            prompt_description: item.prompt_description,
            material: item.material
          }))
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('Generated outfits response:', data);

      if (data.warning) {
        toast.warning(data.warning);
      }

      const newOutfits = data.outfits || [];
      setGeneratedOutfits(newOutfits);
      savePreviousOutfits(newOutfits);
      
      if (newOutfits.length > 0) {
        toast.success(`${newOutfits.length} kombin önerisi oluşturuldu!`);
      }
    } catch (error) {
      console.error('Error generating outfits:', error);
      toast.error('Kombin oluşturulurken hata oluştu');
      
      // Fallback: Generate outfits from user's actual items
      const fallbackOutfits = generateFallbackOutfits();
      setGeneratedOutfits(fallbackOutfits);
      savePreviousOutfits(fallbackOutfits);
      
      if (fallbackOutfits.length > 0) {
        toast.warning('AI servisi kullanılamadı, rastgele kombinler oluşturuldu');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFallbackOutfits = () => {
    if (wardrobeItems.length < 2) return [];

    const shuffleArray = (array: any[]) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    const createOutfit = (items: WardrobeItem[], outfitNumber: number) => {
      const selectedItems = shuffleArray(items).slice(0, Math.min(3, items.length));
      return {
        id: outfitNumber,
        name: `Kombin ${outfitNumber}`,
        items: selectedItems.map(item => item.name),
        item_ids: selectedItems.map(item => item.id),
        confidence: Math.floor(Math.random() * 20) + 80,
        styling_tips: "Bu kombinasyon gardırobunuzdaki ürünlerden oluşturuldu",
        occasion: occasion,
        images: selectedItems.map(item => item.image_url).filter(Boolean)
      };
    };

    return [
      createOutfit(wardrobeItems, 1),
      createOutfit(wardrobeItems, 2),
      createOutfit(wardrobeItems, 3)
    ];
  };

  return (
    <div className="space-y-6">
      {/* Outfit Parameters */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wand2 className="h-5 w-5 text-blue-500" />
            <span>Mükemmel Kombinini Oluştur</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* ... keep existing code (grid with selects) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                Durum
              </label>
              <Select value={occasion} onValueChange={setOccasion}>
                <SelectTrigger className="bg-white/80 border-blue-200">
                  <SelectValue placeholder="Durum seçin" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-sm">
                  <SelectItem value="office">Ofis/İş</SelectItem>
                  <SelectItem value="meeting">İş Toplantısı</SelectItem>
                  <SelectItem value="casual">Günlük Gezinti</SelectItem>
                  <SelectItem value="date">Romantik Akşam</SelectItem>
                  <SelectItem value="party">Parti/Etkinlik</SelectItem>
                  <SelectItem value="workout">Spor/Jimnastik</SelectItem>
                  <SelectItem value="travel">Seyahat</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Zaman
              </label>
              <Select value={timeOfDay} onValueChange={setTimeOfDay}>
                <SelectTrigger className="bg-white/80 border-blue-200">
                  <SelectValue placeholder="Zaman seçin" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-sm">
                  <SelectItem value="morning">Sabah</SelectItem>
                  <SelectItem value="afternoon">Öğleden Sonra</SelectItem>
                  <SelectItem value="evening">Akşam</SelectItem>
                  <SelectItem value="night">Gece</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Thermometer className="h-4 w-4 mr-1" />
                Hava Durumu
              </label>
              <Select value={weather} onValueChange={setWeather}>
                <SelectTrigger className="bg-white/80 border-blue-200">
                  <SelectValue placeholder="Hava durumu seçin" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-sm">
                  <SelectItem value="sunny">Güneşli/Sıcak</SelectItem>
                  <SelectItem value="cool">Serin/Ilık</SelectItem>
                  <SelectItem value="cold">Soğuk</SelectItem>
                  <SelectItem value="rainy">Yağmurlu</SelectItem>
                  <SelectItem value="windy">Rüzgarlı</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={generateOutfits}
            disabled={!occasion || !timeOfDay || !weather || isGenerating || wardrobeItems.length === 0}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
          >
            {isGenerating ? (
              <>
                <Shuffle className="h-4 w-4 mr-2 animate-spin" />
                Kombinler Oluşturuluyor...
              </>
            ) : wardrobeItems.length === 0 ? (
              "Önce gardırobunuza ürün ekleyin"
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Kombin Önerisi Oluştur
              </>
            )}
          </Button>

          {wardrobeItems.length === 0 && (
            <p className="text-sm text-gray-500 text-center">
              Kombin önerileri oluşturmak için gardırobunuzda en az 2 ürün olmalı
            </p>
          )}
        </CardContent>
      </Card>

      {/* Loading Progress */}
      <OutfitLoadingProgress isVisible={isGenerating} />

      {/* Generated Outfits */}
      {generatedOutfits.length > 0 && !isGenerating && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Kombin Önerileriniz</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {generatedOutfits.map((outfit) => (
              <OutfitCard key={outfit.id} outfit={outfit} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OutfitGenerator;
