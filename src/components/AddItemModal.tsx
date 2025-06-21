
import { useState } from "react";
import { X, Camera, Upload, Sparkles, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddItemModal = ({ isOpen, onClose }: AddItemModalProps) => {
  const [step, setStep] = useState<'upload' | 'details'>('upload');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleImageUpload = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis with enhanced details
    setTimeout(() => {
      setAnalysisResult({
        name: "Oversize Kaşmir Süveter",
        category: "üstler",
        primaryColor: "Krem",
        suggestedBrand: "Everlane",
        tags: ["rahat", "lüks", "oversize", "kaşmir", "sonbahar"],
        confidence: 96,
        material: "%100 Kaşmir",
        season: "Sonbahar/Kış",
        style: "Minimalist"
      });
      setIsAnalyzing(false);
      setStep('details');
    }, 3000);
  };

  const handleSave = () => {
    // Save item logic here
    onClose();
    setStep('upload');
    setAnalysisResult(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white rounded-3xl border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center space-x-3 text-xl font-bold">
            <div className="bg-blue-100 rounded-full p-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
            </div>
            <span>Yeni Ürün Ekle</span>
          </DialogTitle>
        </DialogHeader>

        {step === 'upload' && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600 text-base leading-relaxed">
                Kıyafet ürününün fotoğrafını çek veya yükle. 
                AI'mız otomatik olarak her şeyi analiz edip kategorize edecek!
              </p>
            </div>

            <div className="space-y-4">
              <Card className="border-2 border-dashed border-blue-200 hover:border-blue-300 transition-colors cursor-pointer rounded-2xl">
                <CardContent className="p-8 text-center">
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Camera className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-lg">Fotoğraf Çek</h3>
                  <p className="text-gray-500">Kameranı kullanarak ürünü yakala</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-dashed border-blue-200 hover:border-blue-300 transition-colors cursor-pointer rounded-2xl">
                <CardContent className="p-8 text-center">
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Upload className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-lg">Görsel Yükle</h3>
                  <p className="text-gray-500">Fotoğraf galerinден seç</p>
                </CardContent>
              </Card>
            </div>

            <Button 
              onClick={handleImageUpload}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-xl text-base"
            >
              Demo Görsel ile Devam Et
            </Button>
          </div>
        )}

        {step === 'details' && (
          <div className="space-y-6">
            {isAnalyzing ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-6"></div>
                <h3 className="font-semibold text-gray-900 mb-3 text-lg">Ürününüz analiz ediliyor...</h3>
                <p className="text-gray-500 text-base">AI'mız kategori, renk, malzeme ve stili tanımlıyor</p>
              </div>
            ) : analysisResult && (
              <>
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-green-100 rounded-full p-2">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-sm font-semibold text-green-800">
                      AI Analizi Tamamlandı (%{analysisResult.confidence} güven)
                    </span>
                  </div>
                  <p className="text-sm text-green-700 leading-relaxed">
                    Aşağıdaki detayları otomatik olarak doldurduk. İstediğiniz değişiklikleri yapabilirsiniz!
                  </p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Ürün Adı</label>
                    <Input
                      defaultValue={analysisResult.name}
                      className="bg-gray-50 border-gray-200 focus:border-blue-400 rounded-xl text-base py-3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Marka</label>
                    <Input
                      placeholder={`Önerilen: ${analysisResult.suggestedBrand}`}
                      className="bg-gray-50 border-gray-200 focus:border-blue-400 rounded-xl text-base py-3"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Kategori</label>
                      <Input
                        defaultValue={analysisResult.category}
                        className="bg-gray-50 border-gray-200 rounded-xl text-base py-3"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Renk</label>
                      <Input
                        defaultValue={analysisResult.primaryColor}
                        className="bg-gray-50 border-gray-200 rounded-xl text-base py-3"
                        readOnly
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Stil Etiketleri</label>
                    <Input
                      defaultValue={analysisResult.tags.join(', ')}
                      className="bg-gray-50 border-gray-200 rounded-xl text-base py-3"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Kişisel Notlar (İsteğe Bağlı)</label>
                    <Textarea
                      placeholder="Bu ürün hakkında kişisel notlarınızı ekleyin..."
                      className="bg-gray-50 border-gray-200 focus:border-blue-400 rounded-xl text-base resize-none"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setStep('upload')}
                    className="flex-1 border-gray-200 hover:bg-gray-50 rounded-xl py-3 text-base font-semibold"
                  >
                    Geri
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-3 text-base font-semibold"
                  >
                    Gardiroba Kaydet
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddItemModal;
