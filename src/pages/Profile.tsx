import { useState, useEffect } from "react";
import { User, LogOut, Settings, Heart, Star, Edit, Crown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSubscription } from "@/hooks/useSubscription";
import PaywallModal from "@/components/PaywallModal";

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { limits } = useSubscription();
  const [loading, setLoading] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const [outfitCount, setOutfitCount] = useState(0);
  const [favoriteItems, setFavoriteItems] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      // Fetch clothing items count
      const { count: clothingCount } = await supabase
        .from('clothing_items')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Fetch outfits count from database
      const { count: outfitsCount } = await supabase
        .from('outfits')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Fetch favorite clothing items
      const { data: favoriteData } = await supabase
        .from('clothing_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_favorite', true)
        .limit(5);

      // Fetch user profile
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setItemCount(clothingCount || 0);
      setOutfitCount(outfitsCount || 0);
      setFavoriteItems(favoriteData || []);
      setUserProfile(profileData);
    };

    fetchStats();
  }, [user]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut();
      toast({
        title: "Çıkış yapıldı",
        description: "Başarıyla çıkış yaptınız",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Hata",
        description: "Çıkış yaparken bir hata oluştu",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getGenderDisplay = (gender: string) => {
    switch (gender) {
      case 'male':
        return 'Erkek';
      case 'female':
        return 'Kadın';
      case 'other':
        return 'Diğer';
      case 'prefer_not_to_say':
        return 'Belirtilmemiş';
      default:
        return 'Belirtilmemiş';
    }
  };

  const handleFavoritesClick = () => {
    navigate('/wardrobe', { state: { showFavorites: true } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl">
        <div className="px-6 pt-12 pb-8">
          <div className="text-left">
            <div className="w-20 h-20 bg-white/20 rounded-full mb-4 flex items-center justify-center backdrop-blur-sm relative">
              <User className="h-10 w-10 text-white" />
              {limits.isPremium && (
                <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                  <Crown className="h-4 w-4 text-yellow-800" />
                </div>
              )}
            </div>
            <h1 className="text-2xl font-semibold">
              Profil
              {limits.isPremium && (
                <span className="text-yellow-300 text-sm ml-2">Premium</span>
              )}
            </h1>
            <p className="text-blue-100 text-base mt-1">{user?.email}</p>
            {userProfile?.gender && (
              <p className="text-blue-200 text-sm mt-1">{getGenderDisplay(userProfile.gender)}</p>
            )}
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {limits.isPremium ? itemCount : `${itemCount}/${limits.remainingItems + itemCount}`}
              </div>
              <div className="text-sm text-gray-600">
                {limits.isPremium ? 'Sınırsız Ürün' : 'Ürün Limiti'}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-indigo-600 mb-1">{outfitCount}</div>
              <div className="text-sm text-gray-600">
                {limits.isPremium ? 'Sınırsız Kombin' : `Günlük: ${3 - limits.remainingOutfits}/3`}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upgrade to Premium Card - Only show for free users */}
        {!limits.isPremium && (
          <Card className="bg-gradient-to-br from-purple-500 to-blue-600 text-white border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center mb-2">
                    <Crown className="h-6 w-6 text-yellow-300 mr-2" />
                    <h3 className="text-lg font-semibold">Premium'a Geç</h3>
                  </div>
                  <p className="text-purple-100 text-sm mb-4">
                    Sınırsız ürün, kombin ve reklamsız deneyim
                  </p>
                  <Button
                    onClick={() => setShowPaywall(true)}
                    className="bg-white text-purple-600 hover:bg-gray-100 rounded-xl font-semibold"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Yükselt
                  </Button>
                </div>
                <div className="text-6xl opacity-20">👑</div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Menu Items */}
        <div className="space-y-3">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
            <CardContent className="p-0">
              <button className="w-full p-4 flex items-center justify-between hover:bg-blue-50/50 rounded-2xl transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 rounded-full p-2">
                    <Settings className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-900">Ayarlar</span>
                </div>
                <div className="text-gray-400">›</div>
              </button>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
            <CardContent className="p-0">
              <button 
                className="w-full p-4 flex items-center justify-between hover:bg-red-50/50 rounded-2xl transition-colors"
                onClick={handleFavoritesClick}
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-red-100 rounded-full p-2">
                    <Heart className="h-5 w-5 text-red-600" />
                  </div>
                  <span className="font-medium text-gray-900">Favoriler</span>
                </div>
                <div className="text-gray-400">›</div>
              </button>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
            <CardContent className="p-0">
              <button className="w-full p-4 flex items-center justify-between hover:bg-yellow-50/50 rounded-2xl transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="bg-yellow-100 rounded-full p-2">
                    <Star className="h-5 w-5 text-yellow-600" />
                  </div>
                  <span className="font-medium text-gray-900">Uygulamayı Değerlendir</span>
                </div>
                <div className="text-gray-400">›</div>
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Logout Button */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4">
            <Button
              onClick={handleLogout}
              disabled={loading}
              variant="outline"
              className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl py-3 font-semibold transition-all duration-300"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {loading ? 'Çıkış yapılıyor...' : 'Çıkış Yap'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Paywall Modal */}
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        reason="upgrade"
      />
    </div>
  );
};

export default Profile;
