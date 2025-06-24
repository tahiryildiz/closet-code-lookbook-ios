
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sparkles } from "lucide-react";

interface OutfitLoadingProgressProps {
  isVisible: boolean;
}

const OutfitLoadingProgress = ({ isVisible }: OutfitLoadingProgressProps) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Gardırobunuz analiz ediliyor...",
    "Renk uyumları hesaplanıyor...",
    "Stil tercihleri belirleniyor...",
    "Kombinler oluşturuluyor...",
    "Son rötuşlar yapılıyor..."
  ];

  useEffect(() => {
    if (!isVisible) {
      setProgress(0);
      setCurrentStep(0);
      return;
    }

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2;
        
        // Update step based on progress
        const stepIndex = Math.floor((newProgress / 100) * steps.length);
        setCurrentStep(Math.min(stepIndex, steps.length - 1));
        
        return Math.min(newProgress, 95); // Don't complete until actual completion
      });
    }, 2400); // 120 seconds / 50 steps = 2.4 seconds per step

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white rounded-3xl shadow-2xl">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            {/* Loading Animation */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-10 w-10 text-blue-600 animate-pulse" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full w-20 h-20 mx-auto opacity-20 animate-ping"></div>
            </div>

            {/* Title */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                AI Kombinler Hazırlanıyor
              </h3>
              <p className="text-gray-600 text-sm">
                Tahmini bekleme süresi: 120 saniye
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-3">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-gray-600 font-medium">
                {steps[currentStep]}
              </p>
            </div>

            {/* Progress Percentage */}
            <div className="text-sm text-gray-500">
              %{Math.round(progress)} tamamlandı
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OutfitLoadingProgress;
