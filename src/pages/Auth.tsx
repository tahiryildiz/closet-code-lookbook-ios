
import { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
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
            description: "Gardırobunuza hoş geldiniz",
          });
          navigate('/wardrobe');
        }
      } else {
        const { error } = await signUp(formData.email, formData.password, formData.fullName);
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
          toast({
            title: "Kayıt başarılı!",
            description: "Hesabınız oluşturuldu, giriş yapabilirsiniz",
          });
          setIsLogin(true);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-3xl">
        <CardHeader className="text-center pb-2">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {isLogin ? 'Giriş Yap' : 'Hesap Oluştur'}
          </CardTitle>
          <p className="text-gray-600 mt-2">
            {isLogin ? 'Gardırobuna erişmek için giriş yap' : 'Yeni bir hesap oluşturup başla'}
          </p>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  name="fullName"
                  placeholder="Ad Soyad"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="pl-10 bg-gray-50 border-gray-200 focus:border-blue-400 rounded-xl py-3"
                  required={!isLogin}
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="email"
                name="email"
                placeholder="E-posta adresiniz"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10 bg-gray-50 border-gray-200 focus:border-blue-400 rounded-xl py-3"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Şifreniz"
                value={formData.password}
                onChange={handleInputChange}
                className="pl-10 pr-10 bg-gray-50 border-gray-200 focus:border-blue-400 rounded-xl py-3"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl transition-all duration-200"
            >
              {loading ? 'İşleniyor...' : (isLogin ? 'Giriş Yap' : 'Hesap Oluştur')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              {isLogin ? 'Hesabın yok mu? Kayıt ol' : 'Zaten hesabın var mı? Giriş yap'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
