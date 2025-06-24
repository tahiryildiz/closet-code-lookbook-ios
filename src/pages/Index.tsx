import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Wand2, Shirt, Heart } from "lucide-react";
import RecentOutfitsCarousel from "@/components/RecentOutfitsCarousel";
import SavedOutfitsCarousel from "@/components/SavedOutfitsCarousel";
import RecentItemsCarousel from "@/components/RecentItemsCarousel";
import WeatherRecommendations from "@/components/WeatherRecommendations";
import StyleTipsCard from "@/components/StyleTipsCard";
import FashionFactCard from "@/components/FashionFactCard";

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
  const [recentOutfits, setRecentOutfits] = useState([]);
  const [savedOutfits, setSavedOutfits] = useState([]);
  const [recentItems, setRecentItems] = useState([]);
  const [itemCount, setItemCount] = useState(0);
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

        // Fetch recent outfits (non-saved ones for recent section)
        const { data: outfits } = await supabase
          .from('outfits')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_saved', false) // Only non-saved outfits for recent section
          .order('created_at', { ascending: false })
          .limit(10);

        if (outfits) {
          // Get actual item details for each outfit
          const mappedOutfits = await Promise.all(
            outfits.map(async (outfit) => {
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
                ...outfit,
                items: items,
                reference_images: reference_images,
                styling_tips: outfit.ai_styling_tips || '',
                generated_image: outfit.image_url || null // Use stored image URL
              };
            })
          );
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
          // Map saved outfits with stored image URLs
          const mappedSavedOutfits = await Promise.all(
            saved.map(async (outfit) => {
              let items: string[] = [];
              
              if (outfit.clothing_item_ids && outfit.clothing_item_ids.length > 0) {
                const { data: itemsData } = await supabase
                  .from('clothing_items')
                  .select('name')
                  .in('id', outfit.clothing_item_ids);

                if (itemsData) {
                  items = itemsData.map(item => item.name);
                }
              }

              return {
                ...outfit,
                items: items
              };
            })
          );
          setSavedOutfits(mappedSavedOutfits);
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <Shirt className="h-10 w-10 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Hoş Geldiniz!</h1>
            <p className="text-gray-600 mb-8">AI destekli gardrop asistanınız ile tanışın</p>
            <Button 
              onClick={() => navigate('/auth')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
            >
              Başlayın
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="px-4 pt-16 pb-6">
          <div className="animate-pulse space-y-4">
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
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 md:px-6 pt-14 pb-6">
          <div className="text-left">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Ana Sayfa</h1>
            <p className="text-gray-500 text-sm md:text-base mt-1">
              {itemCount > 0 ? `${itemCount} kıyafet` : 'Gardırobunuzu oluşturun'}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 md:px-6 py-6 space-y-6">
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => navigate('/outfits')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Wand2 className="h-5 w-5 mr-2" />
            Kombin Oluştur
          </Button>
          
          <Button
            onClick={() => navigate('/wardrobe')}
            variant="outline"
            className="border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 font-semibold py-4 rounded-2xl transition-all duration-300"
          >
            <Shirt className="h-5 w-5 mr-2" />
            Gardırop
          </Button>
        </div>

        {/* Weather Recommendations - moved above Style Tips */}
        <WeatherRecommendations />

        {/* Style Tips Card */}
        <StyleTipsCard />

        {/* Recent Outfits */}
        {recentOutfits.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900">Son Kombinler</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/outfits')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Tümünü Gör
              </Button>
            </div>
            <RecentOutfitsCarousel outfits={recentOutfits} />
          </div>
        )}

        {/* Saved Outfits */}
        {savedOutfits.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900">Kaydedilen Kombinler</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/saved-outfits')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                <Heart className="h-4 w-4 mr-1" />
                Favoriler
              </Button>
            </div>
            <SavedOutfitsCarousel outfits={savedOutfits} />
          </div>
        )}

        {/* Recent Items */}
        {recentItems.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900">Son Eklenen Kıyafetler</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/wardrobe')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Tümünü Gör
              </Button>
            </div>
            <RecentItemsCarousel items={recentItems} />
          </div>
        )}

        {/* Fashion Fact */}
        <FashionFactCard />
      </div>
    </div>
  );
};

export default Index;
