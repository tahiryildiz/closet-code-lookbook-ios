
import { useState } from "react";
import { X, Play, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface AdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  type: 'items' | 'generations';
}

const AdModal = ({ isOpen, onClose, onComplete, type }: AdModalProps) => {
  const [adStarted, setAdStarted] = useState(false);
  const [countdown, setCountdown] = useState(5);

  if (!isOpen) return null;

  const getTitle = () => {
    return type === 'items' ? '+3 Ürün Ekleme Hakkı' : '+1 Kombin Oluşturma Hakkı';
  };

  const getDescription = () => {
    return type === 'items' 
      ? '5 saniyelik reklam izleyerek 3 ek ürün ekleme hakkı kazanın!'
      : '5 saniyelik reklam izleyerek 1 ek kombin oluşturma hakkı kazanın!';
  };

  const startAd = () => {
    setAdStarted(true);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete();
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white rounded-3xl shadow-2xl">
        <CardContent className="p-0">
          {!adStarted ? (
            <>
              {/* Header */}
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-t-3xl relative">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
                
                <div className="text-center">
                  <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Gift className="h-8 w-8 text-yellow-300" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{getTitle()}</h2>
                  <p className="text-green-100 text-sm">{getDescription()}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 text-center space-y-6">
                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="text-4xl mb-2">📺</div>
                  <p className="text-gray-700 text-sm">
                    Kısa bir reklam izleyerek bonus hak kazanacaksınız
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={startAd}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 rounded-2xl font-semibold"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Reklamı Başlat
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="w-full py-3 rounded-2xl"
                  >
                    İptal
                  </Button>
                </div>
              </div>
            </>
          ) : (
            /* Ad Playing State */
            <div className="p-8 text-center space-y-6">
              <div className="bg-black rounded-2xl aspect-video flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-6xl mb-4">📺</div>
                  <p className="text-lg">Reklam oynatılıyor...</p>
                  <p className="text-3xl font-bold mt-2">{countdown}</p>
                </div>
              </div>
              
              <p className="text-gray-600">
                Reklam {countdown} saniye sonra bitecek
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdModal;
