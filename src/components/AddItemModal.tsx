
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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [analysisResults, setAnalysisResults] = useState<any[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    brand: '',
    category: '',
    primaryColor: '',
    tags: '',
    notes: ''
  });
  const { toast } = useToast();

  const handleFileSelect = (files: File[]) => {
    console.log('Files received in modal:', files.length);
    setSelectedFiles(files);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const processFiles = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "Hata",
        description: "Lütfen en az bir fotoğraf seçin",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    const results: any[] = [];

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        console.log(`Processing file ${i + 1}/${selectedFiles.length}:`, file.name);

        // Upload file to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `clothing/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('clothing-images')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Upload error for file', file.name, ':', uploadError);
          toast({
            title: "Yükleme hatası",
            description: `${file.name} yüklenirken hata oluştu: ${uploadError.message}`,
            variant: "destructive"
          });
          continue;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('clothing-images')
          .getPublicUrl(filePath);

        console.log('File uploaded successfully:', publicUrl);

        // Call OpenAI analysis through Supabase Edge Function
        try {
          console.log('Calling OpenAI analysis for:', publicUrl);
          
          const { data: analysisData, error: analysisError } = await supabase.functions
            .invoke('analyze-clothing', {
              body: { imageUrl: publicUrl }
            });

          if (analysisError) {
            console.error('Analysis error:', analysisError);
            throw new Error(analysisError.message);
          }

          console.log('Analysis successful:', analysisData);

          results.push({
            ...analysisData,
            imageUrl: publicUrl,
            originalFile: file
          });

        } catch (analysisError) {
          console.error('AI analysis failed for', file.name, ':', analysisError);
          
          // Use fallback analysis
          const fallbackAnalysis = {
            name: 'Kıyafet',
            category: 'Üstler',
            primaryColor: 'Gri',
            tags: ['genel'],
            material: 'Bilinmiyor',
            confidence: 50,
            season: 'Tüm Mevsim',
            style: 'Genel'
          };

          results.push({
            ...fallbackAnalysis,
            imageUrl: publicUrl,
            originalFile: file
          });

          toast({
            title: "Analiz Uyarısı",
            description: `${file.name} için AI analizi başarısız oldu, varsayılan değerler kullanıldı`,
            variant: "destructive"
          });
        }
      }

      if (results.length > 0) {
        setAnalysisResults(results);
        setCurrentItemIndex(0);
        setStep('details');
        toast({
          title: "Başarılı!",
          description: `${results.length} ürün analiz edildi`,
        });
      }
    } catch (error) {
      console.error('Error processing files:', error);
      toast({
        title: "İşlem hatası",
        description: "Fotoğraflar işlenirken bir hata oluştu",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFormDataChange = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleSaveCurrentItem = async () => {
    const currentResult = analysisResults[currentItemIndex];
    
    try {
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        toast({
          title: "Kimlik doğrulama hatası",
          description: "Ürün kaydetmek için giriş yapmanız gerekiyor",
          variant: "destructive"
        });
        return false;
      }

      console.log('Saving item to database:', {
        name: formData.name || currentResult?.name,
        category: formData.category || currentResult?.category,
        image_url: currentResult?.imageUrl
      });

      const { error } = await supabase
        .from('clothing_items')
        .insert({
          name: formData.name || currentResult?.name,
          brand: formData.brand,
          category: formData.category || currentResult?.category,
          primary_color: formData.primaryColor || currentResult?.primaryColor,
          style_tags: formData.tags ? formData.tags.split(', ') : currentResult?.tags,
          user_notes: formData.notes,
          image_url: currentResult?.imageUrl,
          material: currentResult?.material,
          user_id: session.user.id
        });

      if (error) {
        console.error('Save error:', error);
        toast({
          title: "Kaydetme hatası",
          description: `Ürün kaydedilirken hata oluştu: ${error.message}`,
          variant: "destructive"
        });
        return false;
      }

      console.log('Item saved successfully!');
      return true;
    } catch (error) {
      console.error('Error saving item:', error);
      toast({
        title: "Hata",
        description: "Beklenmeyen bir hata oluştu",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleSave = async () => {
    const success = await handleSaveCurrentItem();
    
    if (success) {
      // Check if there are more items to process
      if (currentItemIndex < analysisResults.length - 1) {
        setCurrentItemIndex(prev => prev + 1);
        // Reset form for next item
        setFormData({
          name: '',
          brand: '',
          category: '',
          primaryColor: '',
          tags: '',
          notes: ''
        });
        toast({
          title: "Kaydedildi!",
          description: `Ürün ${currentItemIndex + 1} kaydedildi. Sıradaki ürüne geçiliyor...`,
        });
      } else {
        // All items processed
        toast({
          title: "Tamamlandı!",
          description: `Tüm ürünler (${analysisResults.length}) gardırobunuza eklendi`,
        });
        handleClose();
      }
    }
  };

  const handleClose = () => {
    onClose();
    // Reset all state
    setStep('upload');
    setSelectedFiles([]);
    setAnalysisResults([]);
    setCurrentItemIndex(0);
    setFormData({
      name: '',
      brand: '',
      category: '',
      primaryColor: '',
      tags: '',
      notes: ''
    });
  };

  const handleBack = () => {
    if (step === 'details' && currentItemIndex > 0) {
      setCurrentItemIndex(prev => prev - 1);
    } else {
      setStep('upload');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white rounded-3xl border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center space-x-3 text-xl font-bold">
            <div className="bg-blue-100 rounded-full p-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
            </div>
            <span>
              {step === 'upload' ? 'Yeni Ürün Ekle' : 
               `Ürün ${currentItemIndex + 1}/${analysisResults.length}`}
            </span>
          </DialogTitle>
        </DialogHeader>

        {step === 'upload' && (
          <div className="space-y-6">
            <UploadStep 
              onFileSelect={handleFileSelect}
              selectedFiles={selectedFiles}
              onRemoveFile={handleRemoveFile}
            />
            
            {selectedFiles.length > 0 && (
              <div className="flex space-x-3">
                <button
                  onClick={processFiles}
                  disabled={isAnalyzing}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-2xl transition-colors"
                >
                  {isAnalyzing ? 'Analiz ediliyor...' : `${selectedFiles.length} Ürünü Analiz Et`}
                </button>
              </div>
            )}
          </div>
        )}

        {step === 'details' && analysisResults[currentItemIndex] && (
          <AnalysisStep
            isAnalyzing={isAnalyzing}
            analysisResult={analysisResults[currentItemIndex]}
            formData={formData}
            onFormDataChange={handleFormDataChange}
            onSave={handleSave}
            onBack={handleBack}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddItemModal;
