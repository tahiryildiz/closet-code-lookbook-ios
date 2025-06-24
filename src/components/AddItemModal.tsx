
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import UploadStep from "./UploadStep";
import AnalysisStep from "./AnalysisStep";
import FashionFactCard from "./FashionFactCard";
import { useSubscription } from "@/hooks/useSubscription";
import { useImageStorage } from "@/hooks/useImageStorage";
import PaywallModal from "./PaywallModal";
import AdModal from "./AdModal";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

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
  const { user } = useAuth();
  const { toast } = useToast();
  const { limits, updateUsage, addAdBonus, checkLimits } = useSubscription();
  const { uploadImage, isUploading } = useImageStorage();
  const [step, setStep] = useState<'upload' | 'analysis'>('upload');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
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
  const [showPaywall, setShowPaywall] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  useEffect(() => {
    // Only show paywall if user has no rights left and is not premium
    if (isOpen && !limits.canAddItem && !limits.isPremium) {
      setShowPaywall(true);
    }
  }, [isOpen, limits.canAddItem, limits.isPremium]);

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (files: File[]) => {
    // Check if user has rights to add items
    if (!limits.canAddItem && !limits.isPremium) {
      setShowPaywall(true);
      return;
    }

    if (files.length === 0) return;

    // For premium users, process files directly
    if (limits.isPremium) {
      await processFiles(files);
      return;
    }

    // For free users who still have rights, process files directly
    if (limits.canAddItem) {
      await processFiles(files);
      return;
    }

    // This should not happen given the checks above, but as fallback
    setShowPaywall(true);
  };

  const processFiles = async (files: File[]) => {
    setSelectedFiles(files);
    setCurrentFileIndex(0);
    setStep('analysis');
    await analyzeCurrentFile(files, 0);
  };

  const analyzeCurrentFile = async (files: File[], index: number) => {
    if (index >= files.length) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const file = files[index];
      
      // Upload image to Supabase Storage first
      const uploadedImageUrl = await uploadImage(file);
      if (!uploadedImageUrl) {
        throw new Error('Image upload failed');
      }
      
      // Convert file to base64 for AI analysis
      const base64ImageUrl = await convertFileToBase64(file);
      
      // Send the base64 data URL to the edge function
      const { data, error } = await supabase.functions.invoke('analyze-clothing', {
        body: { imageUrl: base64ImageUrl },
      });

      if (error) throw error;

      setAnalysisResult({
        ...data,
        imageUrl: uploadedImageUrl // Use the permanent storage URL
      });

      // Update form data with analysis results
      setFormData(prev => ({
        ...prev,
        name: data.name || '',
        brand: data.brand || '',
        category: data.category || '',
        primaryColor: data.primary_color || '',
        tags: data.style_tags ? data.style_tags.join(', ') : '',
        notes: data.notes || ''
      }));

    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analiz Hatası",
        description: "Ürün analizi sırasında bir hata oluştu",
        variant: "destructive"
      });
      setAnalysisResult(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    
    // Adjust current index if needed
    if (currentFileIndex >= newFiles.length && newFiles.length > 0) {
      setCurrentFileIndex(newFiles.length - 1);
      analyzeCurrentFile(newFiles, newFiles.length - 1);
    } else if (newFiles.length === 0) {
      setStep('upload');
      setCurrentFileIndex(0);
    }
  };

  const handleFormDataChange = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleSave = async () => {
    if (!user || !analysisResult) return;

    try {
      // Map AI analysis fields to database fields correctly using exact column names
      const { error } = await supabase
        .from('clothing_items')
        .insert({
          user_id: user.id,
          name: formData.name || analysisResult.name,
          brand: formData.brand || analysisResult.brand,
          category: formData.category || analysisResult.category,
          subcategory: analysisResult.subcategory,
          primary_color: formData.primaryColor || analysisResult.primary_color,
          secondary_colors: analysisResult.secondary_colors || [],
          color_tone: analysisResult.color_tone,
          pattern: analysisResult.pattern,
          pattern_type: analysisResult.pattern_type,
          material: analysisResult.material,
          fit: analysisResult.fit,
          collar: analysisResult.collar,
          sleeve: analysisResult.sleeve,
          neckline: analysisResult.neckline,
          design_details: analysisResult.design_details || [],
          closure_type: analysisResult.closure_type,
          waist_style: analysisResult.waist_style,
          pocket_style: analysisResult.pocket_style,
          hem_style: analysisResult.hem_style,
          lapel_style: analysisResult.lapel_style,
          cuff_style: analysisResult.cuff_style,
          has_lining: analysisResult.has_lining || false,
          button_count: analysisResult.button_count,
          accessories: analysisResult.accessories || [],
          seasons: analysisResult.seasons || [],
          occasions: analysisResult.occasions || [],
          style_tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : (analysisResult.style_tags || []),
          user_notes: formData.notes,
          image_url: analysisResult.imageUrl,
          image_description: analysisResult.image_description,
          ai_analysis: analysisResult,
          confidence: analysisResult.confidence,
          context_tags: analysisResult.context_tags || [],
          prompt_description: analysisResult.prompt_description
        });

      if (error) throw error;

      await updateUsage('item');
      
      toast({
        title: "Başarılı!",
        description: `Ürün gardırobunuza eklendi (${currentFileIndex + 1}/${selectedFiles.length})`,
      });

      // Check if there are more files to process
      if (currentFileIndex < selectedFiles.length - 1) {
        // Move to next file
        const nextIndex = currentFileIndex + 1;
        setCurrentFileIndex(nextIndex);
        
        // Reset form data for next item
        setFormData({
          name: '',
          brand: '',
          category: '',
          primaryColor: '',
          tags: '',
          notes: ''
        });
        
        // Analyze next file
        await analyzeCurrentFile(selectedFiles, nextIndex);
      } else {
        // All files processed, close modal
        toast({
          title: "Tamamlandı!",
          description: `${selectedFiles.length} ürün başarıyla eklendi`,
        });
        handleClose();
      }

    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Hata",
        description: "Ürün kaydedilirken bir hata oluştu",
        variant: "destructive"
      });
    }
  };

  const handleBack = () => {
    setStep('upload');
    setAnalysisResult(null);
    setIsAnalyzing(false);
    setCurrentFileIndex(0);
  };

  const handleClose = () => {
    setStep('upload');
    setSelectedFiles([]);
    setCurrentFileIndex(0);
    setAnalysisResult(null);
    setIsAnalyzing(false);
    setPendingFiles([]);
    setFormData({
      name: '',
      brand: '',
      category: '',
      primaryColor: '',
      tags: '',
      notes: ''
    });
    setShowPaywall(false);
    setShowAdModal(false);
    onClose();
  };

  const handleAdComplete = async () => {
    await addAdBonus('items');
    setShowAdModal(false);
    // Refresh limits to get updated counts
    await checkLimits();
    // Process the pending files after ad completion
    if (pendingFiles.length > 0) {
      await processFiles(pendingFiles);
      setPendingFiles([]);
    }
  };

  const handleWatchAd = () => {
    setShowPaywall(false);
    setShowAdModal(true);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden">
          <CardContent className="p-0">
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-6 relative">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              
              <h2 className="text-xl font-semibold text-center">
                {step === 'upload' ? 'Yeni Ürün Ekle' : 'Ürün Analizi'}
              </h2>
              
              {step === 'analysis' && selectedFiles.length > 1 && (
                <div className="text-center mt-2 text-blue-100 text-sm">
                  {currentFileIndex + 1} / {selectedFiles.length} ürün
                </div>
              )}
              
              {!limits.isPremium && (
                <div className="text-center mt-2 text-blue-100 text-sm">
                  Kalan hak: {limits.remainingItems}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="max-h-[70vh] overflow-y-auto p-6">
              {step === 'upload' && (
                <UploadStep 
                  onFileSelect={handleFileSelect}
                  selectedFiles={selectedFiles}
                  onRemoveFile={handleRemoveFile}
                />
              )}
              
              {step === 'analysis' && (
                <div className="space-y-4">
                  <AnalysisStep 
                    isAnalyzing={isAnalyzing || isUploading}
                    analysisResult={analysisResult}
                    formData={formData}
                    onFormDataChange={handleFormDataChange}
                    onSave={handleSave}
                    onBack={handleBack}
                  />
                  
                  {/* Fashion Fact Card - show during analysis and after */}
                  {(isAnalyzing || isUploading || analysisResult) && (
                    <div className="mt-4">
                      <FashionFactCard />
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Paywall Modal */}
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        onWatchAd={handleWatchAd}
        reason="items"
      />

      {/* Ad Modal */}
      <AdModal
        isOpen={showAdModal}
        onClose={() => setShowAdModal(false)}
        onComplete={handleAdComplete}
        type="items"
      />
    </>
  );
};

export default AddItemModal;
