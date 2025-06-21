
import { useState, useEffect } from "react";
import { Settings, Camera, Heart, Share, Bell, HelpCircle, LogOut, User, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const [notifications, setNotifications] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [stats, setStats] = useState({
    totalItems: 0,
    totalOutfits: 0
  });

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      // Get clothing items count
      const { data: items } = await supabase
        .from('clothing_items')
        .select('id');

      // Get outfits count  
      const { data: outfits } = await supabase
        .from('outfits')
        .select('id');

      setStats({
        totalItems: items?.length || 0,
        totalOutfits: outfits?.length || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header with professional design */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white">
        <div className="px-6 pt-12 pb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-medium">Profil</h1>
              <p className="text-white/80 text-base mt-1">Hesap ayarları ve bilgiler</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 border border-white/20">
              <User className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Profile Info */}
        <Card className="bg-white border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face" />
                  <AvatarFallback>KU</AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-blue-500 hover:bg-blue-600 p-0"
                >
                  <Camera className="h-4 w-4 text-white" />
                </Button>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">Kullanıcı</h2>
                <p className="text-gray-600">Moda Tutkunu</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span>{stats.totalItems} Ürün</span>
                  <span>•</span>
                  <span>{stats.totalOutfits} Kombin</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats - Only show if there's data */}
        {(stats.totalItems > 0 || stats.totalOutfits > 0) && (
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-white border-0 shadow-sm rounded-2xl">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stats.totalItems}</div>
                    <div className="text-sm text-gray-600">Gardırop Ürünü</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-0 shadow-sm rounded-2xl">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Heart className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stats.totalOutfits}</div>
                    <div className="text-sm text-gray-600">Kayıtlı Kombin</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Settings */}
        <Card className="bg-white border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Ayarlar</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-900">Bildirimler</span>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Share className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-900">Analitik Paylaşımı</span>
                </div>
                <Switch checked={sharing} onCheckedChange={setSharing} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <Card className="bg-white border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6 space-y-4">
            <Button variant="ghost" className="w-full justify-start text-left p-3 h-auto rounded-xl hover:bg-gray-50">
              <Heart className="h-5 w-5 text-gray-600 mr-3" />
              <span className="text-gray-900">Favori Ürünler</span>
            </Button>
            
            <Button variant="ghost" className="w-full justify-start text-left p-3 h-auto rounded-xl hover:bg-gray-50">
              <Settings className="h-5 w-5 text-gray-600 mr-3" />
              <span className="text-gray-900">Uygulama Ayarları</span>
            </Button>
            
            <Button variant="ghost" className="w-full justify-start text-left p-3 h-auto rounded-xl hover:bg-gray-50">
              <HelpCircle className="h-5 w-5 text-gray-600 mr-3" />
              <span className="text-gray-900">Yardım & Destek</span>
            </Button>
            
            <Button variant="ghost" className="w-full justify-start text-left p-3 h-auto text-red-600 rounded-xl hover:bg-red-50">
              <LogOut className="h-5 w-5 text-red-600 mr-3" />
              <span>Çıkış Yap</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
