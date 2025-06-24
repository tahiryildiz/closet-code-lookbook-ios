import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Heart, Shirt, Wand2 } from "lucide-react";
import RecentOutfitsCarousel from "@/components/RecentOutfitsCarousel";
import SavedOutfitsCarousel from "@/components/SavedOutfitsCarousel";
import RecentItemsCarousel from "@/components/RecentItemsCarousel";
import WeatherCard from "@/components/WeatherCard";
import StyleTipsCard from "@/components/StyleTipsCard";
import WeatherRecommendations from "@/components/WeatherRecommendations";
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
  image_url?: string;
}
interface SavedOutfit {
  id: string;
  name: string;
  clothing_item_ids: string[];
  ai_styling_tips: string;
  occasion?: string;
  saved_at: string;
  items?: string[];
  reference_images?: string[];
  generated_image?: string;
  image_url?: string;
}
const Index = () => {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const [recentOutfits, setRecentOutfits] = useState([]);
  const [savedOutfits, setSavedOutfits] = useState([]);
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      try {
        // Fetch recent wardrobe items
        const {
          data: items
        } = await supabase.from('clothing_items').select('*').eq('user_id', user.id).order('created_at', {
          ascending: false
        }).limit(10);
        if (items) {
          setRecentItems(items);
        }

        // Fetch recent outfits (non-saved ones for recent section)
        const {
          data: outfits
        } = await supabase.from('outfits').select('*').eq('user_id', user.id).eq('is_saved', false).order('created_at', {
          ascending: false
        }).limit(10);
        if (outfits) {
          const mappedOutfits = await Promise.all(outfits.map(async outfit => {
            let items: string[] = [];
            let reference_images: string[] = [];
            if (outfit.clothing_item_ids && outfit.clothing_item_ids.length > 0) {
              const {
                data: itemsData
              } = await supabase.from('clothing_items').select('name, image_url').in('id', outfit.clothing_item_ids);
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
              generated_image: outfit.image_url || null
            };
          }));
          setRecentOutfits(mappedOutfits);
        }

        // Fetch saved outfits with proper deduplication
        const {
          data: saved
        } = await supabase.from('outfits').select('*').eq('user_id', user.id).eq('is_saved', true).order('saved_at', {
          ascending: false
        });
        if (saved && saved.length > 0) {
          // Remove duplicates based on clothing_item_ids
          const uniqueOutfits = saved.filter((outfit, index, self) => {
            const itemIdsString = JSON.stringify(outfit.clothing_item_ids?.sort());
            return index === self.findIndex(o => JSON.stringify(o.clothing_item_ids?.sort()) === itemIdsString);
          });

          // Get actual item names and images for each outfit
          const mappedSavedOutfits = await Promise.all(uniqueOutfits.slice(0, 10).map(async outfit => {
            let items: string[] = [];
            let reference_images: string[] = [];
            if (outfit.clothing_item_ids && outfit.clothing_item_ids.length > 0) {
              const {
                data: itemsData
              } = await supabase.from('clothing_items').select('name, image_url').in('id', outfit.clothing_item_ids);
              if (itemsData) {
                items = itemsData.map(item => item.name);
                reference_images = itemsData.map(item => item.image_url).filter(Boolean);
              }
            }
            return {
              ...outfit,
              items: items,
              reference_images: reference_images,
              generated_image: outfit.image_url || null
            };
          }));
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
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <Shirt className="h-10 w-10 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Hoş Geldiniz!</h1>
            <p className="text-gray-600 mb-8">AI destekli gardrop asistanınız ile tanışın</p>
            <Button onClick={() => navigate('/auth')} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold">
              Başlayın
            </Button>
          </div>
        </div>
      </div>;
  }
  if (loading) {
    return <div className="min-h-screen bg-gray-50 pb-20">
        <div className="px-4 pt-16 pb-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded-xl w-48"></div>
            <div className="h-20 bg-gray-200 rounded-2xl"></div>
            <div className="h-32 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="md:px-6 pt-14 pb-6 py-[26px] px-[16px]">
          <div className="text-left">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Ana Sayfa</h1>
            <p className="text-gray-500 text-sm md:text-base mt-1">
              Hoş Geldiniz
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6 md:px-px px-0 py-0">
        {/* Weather Card */}
        <WeatherCard />

        {/* Weather Recommendations */}
        <WeatherRecommendations />

        {/* Style Tips Card */}
        <StyleTipsCard />

        {/* Recent Items */}
        {recentItems.length > 0 && <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900">Son Eklenenler</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/wardrobe')} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Tümünü Gör
              </Button>
            </div>
            <RecentItemsCarousel items={recentItems} />
          </div>}

        {/* Recent Outfits */}
        {recentOutfits.length > 0 && <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900">Son Kombinler</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/outfits')} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Tümünü Gör
              </Button>
            </div>
            <RecentOutfitsCarousel outfits={recentOutfits} />
          </div>}

        {/* Saved Outfits */}
        {savedOutfits.length > 0 && <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900">Favori Kombinler</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/saved-outfits')} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                <Heart className="h-4 w-4 mr-1" />
                Favoriler
              </Button>
            </div>
            <SavedOutfitsCarousel outfits={savedOutfits} />
          </div>}
      </div>
    </div>;
};
export default Index;