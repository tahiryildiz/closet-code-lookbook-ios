
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Shirt, Plus, Cloud, Sun, CloudRain, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Show authenticated user's home page with weather card and add products section
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-20">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white">
          <div className="px-6 pt-12 pb-8">
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-2xl font-medium">Ana Sayfa</h1>
              <p className="text-white/80 text-base mt-1">Hoş geldiniz, {user.email.split('@')[0]}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-6 space-y-6">
          {/* Weather Card */}
          <Card className="bg-gradient-to-r from-blue-400 to-blue-600 border-0 shadow-lg rounded-2xl text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Bugün Hava</h3>
                  <p className="text-white/90 text-sm mb-2">İstanbul</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold">22°C</span>
                    <Sun className="h-6 w-6 text-yellow-300" />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white/90 text-sm">Güneşli</p>
                  <p className="text-white/80 text-xs mt-1">Kombinleriniz için ideal hava!</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add Products Section */}
          <Card className="bg-white border-0 shadow-sm rounded-2xl">
            <CardContent className="p-6 text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Gardırobunu Oluştur</h3>
              <p className="text-gray-600 mb-6">
                Kıyafetlerini ekleyerek AI destekli akıllı gardırop deneyimini başlat
              </p>
              <Button
                onClick={() => navigate('/wardrobe')}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl transition-all duration-200"
              >
                <Shirt className="h-5 w-5 mr-2" />
                Kıyafet Ekle
              </Button>
            </CardContent>
          </Card>

          {/* Quick Access Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card 
              className="bg-white border-0 shadow-sm rounded-2xl cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate('/outfits')}
            >
              <CardContent className="p-6 text-center">
                <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Kombinler</h3>
                <p className="text-sm text-gray-600">AI kombini oluştur</p>
              </CardContent>
            </Card>

            <Card 
              className="bg-white border-0 shadow-sm rounded-2xl cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate('/profile')}
            >
              <CardContent className="p-6 text-center">
                <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Profil</h3>
                <p className="text-sm text-gray-600">Ayarlarınız</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Show unauthenticated user's landing page
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="pt-12 pb-8 px-6 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <Sparkles className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Akıllı Gardırop
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          AI ile gardırobunu organize et, kombinler oluştur ve stilini keşfet
        </p>
      </div>

      {/* CTA */}
      <div className="px-6 py-12 text-center">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl max-w-md mx-auto">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Hemen Başla
            </h2>
            <p className="text-gray-600 mb-6">
              Akıllı gardırop deneyimini keşfetmek için hesap oluştur
            </p>
            <Button
              onClick={() => navigate('/auth')}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl transition-all duration-200"
            >
              Giriş Yap / Kayıt Ol
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
