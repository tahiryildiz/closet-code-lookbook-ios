
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RecentItemsCarousel from "@/components/RecentItemsCarousel";
import RecentOutfitsCarousel from "@/components/RecentOutfitsCarousel";
import SavedOutfitsCarousel from "@/components/SavedOutfitsCarousel";
import WeatherCard from "@/components/WeatherCard";
import StyleTipsCard from "@/components/StyleTipsCard";

interface WardrobeItem {
  id: string;
  name: string;
  category: string;
  primary_color: string;
  brand?: string;
  image_url: string;
  created_at: string;
}

interface Outfit {
  id: string | number;
  name: string;
  items?: string[];
  confidence?: number;
  styling_tips: string;
  generated_image?: string;
  reference_images?: string[];
  clothing_item_ids?: string[];
}

interface SavedOutfit {
  id: string;
  name: string;
  clothing_item_ids: string[];
  ai_styling_tips: string;
  occasion?: string;
  saved_at: string;
}

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentItems, setRecentItems] = useState<WardrobeItem[]>([]);
  const [recentOutfits, setRecentOutfits] = useState<Outfit[]>([]);
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        // Fetch recent wardrobe items
        const { data: items } = await supabase
          .from('clothing_items')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (items) {
          setRecentItems(items);
        }

        // Fetch recent outfits
        const { data: outfits } = await supabase
          .from('outfits')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (outfits) {
          // Map the data to match the Outfit interface
          const mappedOutfits = outfits.map(outfit => ({
            ...outfit,
            styling_tips: outfit.ai_styling_tips || ''
          }));
          setRecentOutfits(mappedOutfits);
        }

        // Fetch saved outfits
        const { data: saved } = await supabase
          .from('outfits')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_saved', true)
          .order('saved_at', { ascending: false })
          .limit(10);

        if (saved) {
          setSavedOutfits(saved);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Günaydın! 👋";
    if (hour < 18) return "İyi günler! 👋";
    return "İyi akşamlar! 👋";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="px-4 pt-16 pb-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded-xl w-48"></div>
            <div className="h-20 bg-gray-200 rounded-2xl"></div>
            <div className="h-32 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="px-4 pt-16 pb-8">
        <div className="ios-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">{greeting()}</h1>
          <p className="text-gray-600 text-lg font-medium">Bugün nasıl bir kombin istiyorsun?</p>
        </div>
      </div>

      {/* Content with better spacing */}
      <div className="space-y-6">
        {/* Weather Card */}
        <div className="px-4 ios-fade-in">
          <WeatherCard />
        </div>

        {/* Style Tips Card */}
        <div className="px-4 ios-fade-in">
          <StyleTipsCard />
        </div>

        {/* Today's Weather Suggestions */}
        <div className="ios-fade-in">
          <Card className="bg-white border-0 shadow-sm mx-4 rounded-2xl overflow-hidden">
            <CardHeader className="px-5 pt-5 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-gray-900">Bugünkü Hava İçin Öneriler</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/outfits')}
                  className="text-blue-600 hover:bg-blue-50 font-semibold -mr-2 text-sm"
                >
                  Tümünü Gör
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-5">
              {recentItems.length > 0 ? (
                <RecentItemsCarousel items={recentItems.slice(0, 6)} />
              ) : (
                <div className="text-center py-12 px-5">
                  <p className="text-gray-500 text-lg mb-6">Henüz gardırobunda ürün yok</p>
                  <Button 
                    onClick={() => navigate('/wardrobe')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl text-base"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    İlk Ürünü Ekle
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Items */}
        {recentItems.length > 0 && (
          <div className="ios-fade-in">
            <Card className="bg-white border-0 shadow-sm mx-4 rounded-2xl overflow-hidden">
              <CardHeader className="px-5 pt-5 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-gray-900">Son Eklenen Ürünler</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/wardrobe')}
                    className="text-blue-600 hover:bg-blue-50 font-semibold -mr-2 text-sm"
                  >
                    Hepsini Gör
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-0 pb-5">
                <RecentItemsCarousel items={recentItems} />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recent Outfits */}
        {recentOutfits.length > 0 && (
          <div className="ios-fade-in">
            <Card className="bg-white border-0 shadow-sm mx-4 rounded-2xl overflow-hidden">
              <CardHeader className="px-5 pt-5 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-gray-900">Son Kombinler</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/outfits')}
                    className="text-blue-600 hover:bg-blue-50 font-semibold -mr-2 text-sm"
                  >
                    Hepsini Gör
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-0 pb-5">
                <RecentOutfitsCarousel outfits={recentOutfits} />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Saved Outfits */}
        {savedOutfits.length > 0 && (
          <div className="ios-fade-in">
            <Card className="bg-white border-0 shadow-sm mx-4 rounded-2xl overflow-hidden">
              <CardHeader className="px-5 pt-5 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-gray-900">Kaydedilen Kombinler</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/saved-outfits')}
                    className="text-blue-600 hover:bg-blue-50 font-semibold -mr-2 text-sm"
                  >
                    Hepsini Gör
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-0 pb-5">
                <SavedOutfitsCarousel outfits={savedOutfits} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
