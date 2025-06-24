import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import UploadStep from "./UploadStep";
import AnalysisStep from "./AnalysisStep";
import { useSubscription } from "@/hooks/useSubscription";
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
  const [step, setStep] = useState<'upload' | 'analysis'>('upload');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
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
    setStep('analysis');
    setIsAnalyzing(true);

    try {
      // Process first file for now
      const file = files[0];
      
      // Create a data URL for the image
      const imageUrl = URL.createObjectURL(file);
      
      // Send as JSON with the blob URL
      const { data, error } = await supabase.functions.invoke('analyze-clothing', {
        body: { imageUrl },
      });

      if (error) throw error;

      setAnalysisResult({
        ...data,
        imageUrl: imageUrl
      });

      // Update form data with analysis results
      setFormData(prev => ({
        ...prev,
        name: data.name || '',
        brand: data.brand || '',
        category: data.category || '',
        primaryColor: data.primaryColor || '',
        tags: data.tags || '',
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
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleFormDataChange = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleSave = async () => {
    if (!user || !analysisResult) return;

    try {
      const { error } = await supabase
        .from('clothing_items')
        .insert({
          user_id: user.id,
          name: formData.name,
          brand: formData.brand,
          category: formData.category,
          primary_color: formData.primaryColor,
          style_tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
          user_notes: formData.notes,
          image_url: analysisResult.imageUrl,
          ai_analysis: analysisResult,
          confidence: analysisResult.confidence
        });

      if (error) throw error;

      await updateUsage('item');
      
      toast({
        title: "Başarılı!",
        description: "Ürün gardırobunuza eklendi",
      });

      handleClose();
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
  };

  const handleClose = () => {
    setStep('upload');
    setSelectedFiles([]);
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
                <AnalysisStep 
                  isAnalyzing={isAnalyzing}
                  analysisResult={analysisResult}
                  formData={formData}
                  onFormDataChange={handleFormDataChange}
                  onSave={handleSave}
                  onBack={handleBack}
                />
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
