
import { useState, useEffect } from "react";
import { Plus, TrendingUp, Calendar, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import RecentItemsCarousel from "@/components/RecentItemsCarousel";
import RecentOutfitsCarousel from "@/components/RecentOutfitsCarousel";
import SavedOutfitsCarousel from "@/components/SavedOutfitsCarousel";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recentItems, setRecentItems] = useState([]);
  const [recentOutfits, setRecentOutfits] = useState([]);
  const [savedOutfits, setSavedOutfits] = useState([]);
  const [stats, setStats] = useState({
    totalItems: 0,
    totalOutfits: 0,
    favoriteItems: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Fetch recent clothing items
        const { data: items } = await supabase
          .from('clothing_items')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        // Fetch saved outfits
        const { data: outfits } = await supabase
          .from('outfits')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_saved', true)
          .order('saved_at', { ascending: false })
          .limit(5);

        // Get stats
        const { count: itemCount } = await supabase
          .from('clothing_items')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        const { count: outfitCount } = await supabase
          .from('outfits')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        const { count: favoriteCount } = await supabase
          .from('clothing_items')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('is_favorite', true);

        setRecentItems(items || []);
        setSavedOutfits(outfits || []);
        setStats({
          totalItems: itemCount || 0,
          totalOutfits: outfitCount || 0,
          favoriteItems: favoriteCount || 0
        });

        // Load recent outfits from localStorage
        const savedOutfitsFromStorage = localStorage.getItem('generatedOutfits');
        if (savedOutfitsFromStorage) {
          try {
            const parsedOutfits = JSON.parse(savedOutfitsFromStorage);
            setRecentOutfits(parsedOutfits.slice(0, 5));
          } catch (error) {
            console.error('Error loading saved outfits:', error);
          }
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Hoş Geldiniz!</h2>
            <p className="text-gray-600 mb-6">Gardırobunuzu yönetmek ve kombin önerileri almak için giriş yapın.</p>
            <Button
              onClick={() => navigate('/auth')}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl"
            >
              Giriş Yap
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white">
        <div className="px-6 pt-12 pb-8">
          <div className="text-left">
            <h1 className="text-2xl font-medium">Merhaba! 👋</h1>
            <p className="text-white/80 text-base mt-1">Bugün nasıl bir kombin istiyorsun?</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => navigate('/wardrobe')}>
            <CardContent className="p-4 text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Plus className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">Kıyafet Ekle</h3>
              <p className="text-xs text-gray-600 mt-1">Gardırobuna yeni ürün ekle</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => navigate('/outfits')}>
            <CardContent className="p-4 text-center">
              <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">Kombin Oluştur</h3>
              <p className="text-xs text-gray-600 mt-1">AI ile kombin önerisi al</p>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-blue-600">{stats.totalItems}</div>
              <div className="text-xs text-gray-600">Toplam Ürün</div>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-indigo-600">{stats.totalOutfits}</div>
              <div className="text-xs text-gray-600">Kombin</div>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-red-600">{stats.favoriteItems}</div>
              <div className="text-xs text-gray-600">Favori</div>
            </CardContent>
          </Card>
        </div>

        {/* Saved Outfits Section */}
        {savedOutfits.length > 0 && (
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-gray-900 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                  Kaydedilen Kombinler
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/outfits')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Hepsini Gör
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <SavedOutfitsCarousel outfits={savedOutfits} />
            </CardContent>
          </Card>
        )}

        {/* Recent Outfits */}
        {recentOutfits.length > 0 && (
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-gray-900 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                  Son Kombinler
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/outfits')}
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  Hepsini Gör
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <RecentOutfitsCarousel outfits={recentOutfits} />
            </CardContent>
          </Card>
        )}

        {/* Recent Items */}
        {recentItems.length > 0 && (
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-gray-900 flex items-center">
                  <Plus className="h-5 w-5 mr-2 text-green-600" />
                  Son Eklenen Ürünler
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/wardrobe')}
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  Hepsini Gör
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <RecentItemsCarousel items={recentItems} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
