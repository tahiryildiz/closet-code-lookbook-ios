
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import UploadStep from "./UploadStep";
import AnalysisStep from "./AnalysisStep";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  brand: string;
  category: string;
  primaryColor: string;
  tags: string;
  notes: string;
}

const AddItemModal = ({ isOpen, onClose }: AddItemModalProps) => {
  const [step, setStep] = useState<'upload' | 'details'>('upload');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    brand: '',
    category: '',
    primaryColor: '',
    tags: '',
    notes: ''
  });
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    setIsAnalyzing(true);
    
    try {
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

      const { data: { publicUrl } } = supabase.storage
        .from('clothing-images')
        .getPublicUrl(filePath);

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

  const handleFormDataChange = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
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
          user_id: '00000000-0000-0000-0000-000000000000'
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

      onClose();
      setStep('upload');
      setAnalysisResult(null);
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
          <UploadStep onFileSelect={handleFileSelect} />
        )}

        {step === 'details' && (
          <AnalysisStep
            isAnalyzing={isAnalyzing}
            analysisResult={analysisResult}
            formData={formData}
            onFormDataChange={handleFormDataChange}
            onSave={handleSave}
            onBack={() => setStep('upload')}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddItemModal;
