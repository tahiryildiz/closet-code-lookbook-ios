
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Shirt, Star, User } from "lucide-react";
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

  // Show authenticated user's home page
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
              <h1 className="text-2xl font-medium">Hoş Geldiniz</h1>
              <p className="text-white/80 text-base mt-1">Akıllı gardırop sisteminiz</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card 
              className="bg-white border-0 shadow-sm rounded-2xl cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate('/wardrobe')}
            >
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <Shirt className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Gardırop</h3>
                <p className="text-sm text-gray-600">Kıyafetlerinizi yönetin</p>
              </CardContent>
            </Card>

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
          </div>

          <Card 
            className="bg-white border-0 shadow-sm rounded-2xl cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate('/profile')}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Profil</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <div className="text-gray-400">›</div>
              </div>
            </CardContent>
          </Card>

          {/* Welcome Message */}
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0 shadow-lg rounded-2xl text-white">
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 text-white mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Akıllı Gardırop</h3>
              <p className="text-white/90 text-sm">
                AI ile gardırobunuzu organize edin ve mükemmel kombinler oluşturun
              </p>
            </CardContent>
          </Card>
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
