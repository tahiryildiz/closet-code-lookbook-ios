import { useState } from "react";
import { X, Crown, Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWatchAd?: () => void;
  reason?: 'items' | 'outfits' | 'upgrade';
}

const PaywallModal = ({ isOpen, onClose, onWatchAd, reason = 'upgrade' }: PaywallModalProps) => {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');

  if (!isOpen) return null;

  const getTitle = () => {
    switch (reason) {
      case 'items':
        return "Ürün Ekleme Limitiniz Doldu";
      case 'outfits':
        return "Günlük Kombin Limitiniz Doldu";
      default:
        return "Premium'a Yükselt";
    }
  };

  const getDescription = () => {
    switch (reason) {
      case 'items':
        return "Daha fazla ürün eklemek için Premium'a geçin veya reklam izleyerek bonus hak kazanın.";
      case 'outfits':
        return "Daha fazla kombin oluşturmak için Premium'a geçin veya reklam izleyerek bonus hak kazanın.";
      default:
        return "Sınırsız özelliklerle gardırobunuzun tam potansiyelini keşfedin.";
    }
  };

  const getAdButtonText = () => {
    switch (reason) {
      case 'items':
        return "Reklam izleyerek 3 ürün ekleme hakkı kazan";
      case 'outfits':
        return "Reklam izleyerek 1 kombin oluşturma hakkı kazan";
      default:
        return "Reklam İzleyerek Devam Et";
    }
  };

  const handleSubscribe = (plan: 'monthly' | 'yearly') => {
    toast({
      title: "Yakında!",
      description: "Ödeme sistemi yakında aktif olacak. Şimdilik tüm özellikler ücretsiz!",
    });
    onClose();
  };

  const freeFeatures = [
    "5 ürün ekleme",
    "Günde 3 kombin oluşturma",
    "Kısıtlı stil önerileri",
    "Reklamlar"
  ];

  const premiumFeatures = [
    "Sınırsız ürün ekleme",
    "Sınırsız kombin oluşturma",
    "Detaylı stil önerileri",
    "Reklamsız deneyim",
    "Öncelikli destek"
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <CardContent className="p-0">
          {/* Header */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-6 rounded-t-3xl relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Crown className="h-8 w-8 text-yellow-300" />
              </div>
              <h2 className="text-2xl font-bold mb-2">{getTitle()}</h2>
              <p className="text-blue-100 text-sm">{getDescription()}</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Feature Comparison */}
            <div className="grid grid-cols-2 gap-4">
              {/* Free Plan */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 text-center">Ücretsiz</h3>
                <div className="space-y-2">
                  {freeFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <div className="w-4 h-4 rounded-full bg-gray-300 mr-2 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Premium Plan */}
              <div className="space-y-3">
                <h3 className="font-semibold text-blue-600 text-center">Premium</h3>
                <div className="space-y-2">
                  {premiumFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-900">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pricing Options */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 text-center">Planı Seç</h3>
              
              {/* Monthly Plan */}
              <button
                onClick={() => setSelectedPlan('monthly')}
                className={`w-full p-4 rounded-2xl border-2 transition-all ${
                  selectedPlan === 'monthly'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="font-semibold">Aylık Premium</div>
                    <div className="text-sm text-gray-600">₺29.99/ay</div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 ${
                    selectedPlan === 'monthly' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  }`}>
                    {selectedPlan === 'monthly' && (
                      <div className="w-full h-full rounded-full bg-white scale-50" />
                    )}
                  </div>
                </div>
              </button>

              {/* Yearly Plan */}
              <button
                onClick={() => setSelectedPlan('yearly')}
                className={`w-full p-4 rounded-2xl border-2 transition-all relative ${
                  selectedPlan === 'yearly'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="absolute -top-2 left-4 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                  %40 İndirim
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="font-semibold">Yıllık Premium</div>
                    <div className="text-sm text-gray-600">
                      <span className="line-through text-gray-400">₺359.88</span>{" "}
                      <span className="text-purple-600 font-semibold">₺179.99/yıl</span>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 ${
                    selectedPlan === 'yearly' ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                  }`}>
                    {selectedPlan === 'yearly' && (
                      <div className="w-full h-full rounded-full bg-white scale-50" />
                    )}
                  </div>
                </div>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => handleSubscribe(selectedPlan)}
                className={`w-full py-3 rounded-2xl font-semibold ${
                  selectedPlan === 'yearly'
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                } text-white`}
              >
                <Zap className="h-5 w-5 mr-2" />
                Premium'a Başla
              </Button>

              {(reason === 'items' || reason === 'outfits') && onWatchAd && (
                <Button
                  variant="outline"
                  onClick={onWatchAd}
                  className="w-full py-3 rounded-2xl font-semibold border-gray-300 hover:bg-gray-50"
                >
                  {getAdButtonText()}
                </Button>
              )}
            </div>

            <p className="text-xs text-gray-500 text-center">
              İstediğiniz zaman iptal edebilirsiniz. Gizlilik politikası ve kullanım şartları geçerlidir.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaywallModal;
