
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    gender: ''
  });

  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast({
              title: "Giriş hatası",
              description: "E-posta veya şifre yanlış",
              variant: "destructive"
            });
          } else {
            toast({
              title: "Giriş hatası",
              description: error.message,
              variant: "destructive"
            });
          }
        } else {
          toast({
            title: "Başarılı!",
            description: "Ana sayfaya hoş geldiniz",
          });
          navigate('/');
        }
      } else {
        if (!formData.gender) {
          toast({
            title: "Kayıt hatası",
            description: "Lütfen cinsiyet seçimi yapın",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }

        const { error } = await signUp(formData.email, formData.password);
        if (error) {
          if (error.message.includes('User already registered')) {
            toast({
              title: "Kayıt hatası",
              description: "Bu e-posta adresi zaten kayıtlı",
              variant: "destructive"
            });
          } else {
            toast({
              title: "Kayıt hatası",
              description: error.message,
              variant: "destructive"
            });
          }
        } else {
          // Update user profile with gender information
          const { error: profileError } = await supabase
            .from('user_profiles')
            .update({ gender: formData.gender })
            .eq('id', (await supabase.auth.getUser()).data.user?.id);

          if (profileError) {
            console.error('Error updating profile:', profileError);
          }

          const loginResult = await signIn(formData.email, formData.password);
          if (loginResult.error) {
            toast({
              title: "Hesap oluşturuldu!",
              description: "Hesabınız başarıyla oluşturuldu. Lütfen giriş yapın.",
            });
            setIsLogin(true);
          } else {
            toast({
              title: "Hesap oluşturuldu!",
              description: "Hesabınız başarıyla oluşturuldu ve giriş yaptınız",
            });
            navigate('/');
          }
        }
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Beklenmeyen bir hata oluştu",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleGenderChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      gender: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Tekrar Hoş Geldiniz' : 'Hesap Oluşturun'}
          </h1>
          <p className="text-gray-600">
            {isLogin ? 'Gardırobunuza erişmek için giriş yapın' : 'Akıllı gardırop deneyiminizi başlatın'}
          </p>
        </div>

        {/* Form Card */}
        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  E-posta
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="ornek@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 h-12 bg-gray-50/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Şifre
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 h-12 bg-gray-50/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <label htmlFor="gender" className="text-sm font-medium text-gray-700">
                    Cinsiyet
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
                    <Select value={formData.gender} onValueChange={handleGenderChange}>
                      <SelectTrigger className="pl-10 h-12 bg-gray-50/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all">
                        <SelectValue placeholder="Cinsiyet seçin" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-sm">
                        <SelectItem value="male">Erkek</SelectItem>
                        <SelectItem value="female">Kadın</SelectItem>
                        <SelectItem value="other">Diğer</SelectItem>
                        <SelectItem value="prefer_not_to_say">Belirtmek İstemiyorum</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    İşleniyor...
                  </div>
                ) : (
                  isLogin ? 'Giriş Yap' : 'Hesap Oluştur'
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">veya</span>
                </div>
              </div>
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="mt-4 text-blue-600 hover:text-blue-800 font-medium transition-colors text-sm"
              >
                {isLogin ? 
                  'Henüz hesabınız yok mu? Kayıt olun' : 
                  'Zaten hesabınız var mı? Giriş yapın'
                }
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
