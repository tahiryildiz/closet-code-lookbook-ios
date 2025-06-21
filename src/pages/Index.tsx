
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Redirect authenticated users to wardrobe
    if (!loading && user) {
      navigate('/wardrobe');
    }
  }, [user, loading, navigate]);

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
