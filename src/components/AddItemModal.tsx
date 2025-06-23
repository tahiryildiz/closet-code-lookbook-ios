
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import UploadStep from "./UploadStep";
import AnalysisStep from "./AnalysisStep";
import { useSubscription } from "@/hooks/useSubscription";
import PaywallModal from "./PaywallModal";
import AdModal from "./AdModal";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddItemModal = ({ isOpen, onClose }: AddItemModalProps) => {
  const { limits, updateUsage, addAdBonus } = useSubscription();
  const [step, setStep] = useState<'upload' | 'analysis'>('upload');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);

  useEffect(() => {
    if (isOpen && !limits.canAddItem && !limits.isPremium) {
      setShowPaywall(true);
    }
  }, [isOpen, limits.canAddItem, limits.isPremium]);

  const handleImageSelect = async (file: File) => {
    // Check limits before proceeding
    if (!limits.canAddItem && !limits.isPremium) {
      setShowPaywall(true);
      return;
    }

    setSelectedImage(file);
    setStep('analysis');
  };

  const handleItemAdded = async () => {
    await updateUsage('item');
    handleClose();
  };

  const handleClose = () => {
    setStep('upload');
    setSelectedImage(null);
    setShowPaywall(false);
    setShowAdModal(false);
    onClose();
  };

  const handleAdComplete = async () => {
    await addAdBonus('items');
    setShowAdModal(false);
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
            <div className="max-h-[70vh] overflow-y-auto">
              {step === 'upload' && (
                <UploadStep onImageSelect={handleImageSelect} />
              )}
              
              {step === 'analysis' && selectedImage && (
                <AnalysisStep 
                  image={selectedImage} 
                  onComplete={handleItemAdded}
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
