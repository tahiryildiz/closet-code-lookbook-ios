
import { useState } from "react";
import { User, LogOut, Settings, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white">
        <div className="px-6 pt-12 pb-8">
          <div className="text-center">
            <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <User className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl font-medium">Profil</h1>
            <p className="text-white/80 text-base mt-1">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white border-0 shadow-sm rounded-2xl">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">0</div>
              <div className="text-sm text-gray-600">Toplam Ürün</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-0 shadow-sm rounded-2xl">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-indigo-600 mb-1">0</div>
              <div className="text-sm text-gray-600">Kombinler</div>
            </CardContent>
          </Card>
        </div>

        {/* Menu Items */}
        <div className="space-y-3">
          <Card className="bg-white border-0 shadow-sm rounded-2xl">
            <CardContent className="p-0">
              <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 rounded-2xl transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-100 rounded-full p-2">
                    <Settings className="h-5 w-5 text-gray-600" />
                  </div>
                  <span className="font-medium text-gray-900">Ayarlar</span>
                </div>
                <div className="text-gray-400">›</div>
              </button>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm rounded-2xl">
            <CardContent className="p-0">
              <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 rounded-2xl transition-colors">
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

          <Card className="bg-white border-0 shadow-sm rounded-2xl">
            <CardContent className="p-0">
              <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 rounded-2xl transition-colors">
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
        <Card className="bg-white border-0 shadow-sm rounded-2xl">
          <CardContent className="p-4">
            <Button
              onClick={handleLogout}
              disabled={loading}
              variant="outline"
              className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl py-3 font-semibold"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {loading ? 'Çıkış yapılıyor...' : 'Çıkış Yap'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
