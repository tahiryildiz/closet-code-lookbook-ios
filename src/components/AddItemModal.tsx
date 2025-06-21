
import { useState, useRef } from "react";
import { X, Camera, Upload, Sparkles, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddItemModal = ({ isOpen, onClose }: AddItemModalProps) => {
  const [step, setStep] = useState<'upload' | 'details'>('upload');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    primaryColor: '',
    tags: '',
    notes: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      handleImageUpload(file);
    }
  };

  const handleCameraCapture = () => {
    // For now, trigger file input - in a real app you'd use camera API
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (file: File) => {
    setIsAnalyzing(true);
    
    try {
      // Upload image to Supabase storage first
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `clothing/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('clothing-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast({
          title: "Yükleme hatası",
          description: "Fotoğraf yüklenirken bir hata oluştu",
          variant: "destructive"
        });
        setIsAnalyzing(false);
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('clothing-images')
        .getPublicUrl(filePath);

      // Simulate AI analysis with enhanced details
      setTimeout(() => {
        setAnalysisResult({
          name: "Yeni Kıyafet",
          category: "üstler",
          primaryColor: "Beyaz",
          suggestedBrand: "",
          tags: ["rahat", "günlük"],
          confidence: 85,
          material: "Pamuk",
          season: "Tüm Mevsim",
          style: "Casual",
          imageUrl: publicUrl
        });
        setIsAnalyzing(false);
        setStep('details');
      }, 2000);
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "İşlem hatası",
        description: "Fotoğraf işlenirken bir hata oluştu",
        variant: "destructive"
      });
      setIsAnalyzing(false);
    }
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('clothing_items')
        .insert({
          name: formData.name || analysisResult?.name,
          brand: formData.brand,
          category: formData.category || analysisResult?.category,
          primary_color: formData.primaryColor || analysisResult?.primaryColor,
          style_tags: formData.tags ? formData.tags.split(', ') : analysisResult?.tags,
          user_notes: formData.notes,
          image_url: analysisResult?.imageUrl,
          material: analysisResult?.material,
          user_id: '00000000-0000-0000-0000-000000000000' // This should be actual user ID in production
        });

      if (error) {
        console.error('Save error:', error);
        toast({
          title: "Kaydetme hatası",
          description: "Ürün kaydedilirken bir hata oluştu",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Başarılı!",
        description: "Ürün gardırobunuza eklendi",
      });

      // Reset form
      onClose();
      setStep('upload');
      setAnalysisResult(null);
      setSelectedFile(null);
      setFormData({
        name: '',
        brand: '',
        category: '',
        primaryColor: '',
        tags: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error saving item:', error);
      toast({
        title: "Hata",
        description: "Beklenmeyen bir hata oluştu",
        variant: "destructive"
      });
    }
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
              <Card 
                className="border-2 border-dashed border-blue-200 hover:border-blue-300 transition-colors cursor-pointer rounded-2xl"
                onClick={handleCameraCapture}
              >
                <CardContent className="p-8 text-center">
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Camera className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-lg">Fotoğraf Çek</h3>
                  <p className="text-gray-500">Kameranı kullanarak ürünü yakala</p>
                </CardContent>
              </Card>

              <Card 
                className="border-2 border-dashed border-blue-200 hover:border-blue-300 transition-colors cursor-pointer rounded-2xl"
                onClick={() => fileInputRef.current?.click()}
              >
                <CardContent className="p-8 text-center">
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Upload className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-lg">Görsel Yükle</h3>
                  <p className="text-gray-500">Fotoğraf galerinizden seç</p>
                </CardContent>
              </Card>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
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
                      value={formData.name || analysisResult.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-gray-50 border-gray-200 focus:border-blue-400 rounded-xl text-base py-3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Marka</label>
                    <Input
                      value={formData.brand}
                      onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                      placeholder={analysisResult.suggestedBrand ? `Önerilen: ${analysisResult.suggestedBrand}` : "Marka girin"}
                      className="bg-gray-50 border-gray-200 focus:border-blue-400 rounded-xl text-base py-3"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Kategori</label>
                      <Input
                        value={formData.category || analysisResult.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="bg-gray-50 border-gray-200 rounded-xl text-base py-3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Renk</label>
                      <Input
                        value={formData.primaryColor || analysisResult.primaryColor}
                        onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="bg-gray-50 border-gray-200 rounded-xl text-base py-3"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Stil Etiketleri</label>
                    <Input
                      value={formData.tags || analysisResult.tags.join(', ')}
                      onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                      className="bg-gray-50 border-gray-200 rounded-xl text-base py-3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Kişisel Notlar (İsteğe Bağlı)</label>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
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
