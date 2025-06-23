
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Clock, Lightbulb } from "lucide-react";

const fashionTips = [
  {
    icon: Sparkles,
    text: "Renkleri karıştırırken, aynı ton ailesinden seçim yapmak her zaman güvenli bir seçimdir."
  },
  {
    icon: Lightbulb,
    text: "Vücut tipinize uygun kesimler seçerek hem rahat hem şık görünebilirsiniz."
  },
  {
    icon: Sparkles,
    text: "Temel parçalar (basic items) gardırobunuzun %70'ini oluşturmalı, trend parçalar %30'unu."
  },
  {
    icon: Clock,
    text: "Sabah acelesi yaşamamak için bir gece önceden kombin hazırlamak akıllıca."
  },
  {
    icon: Lightbulb,
    text: "Aksesuarlar en sade kombinleri bile özel kılabilir. Küçük dokunuşlar büyük fark yaratır."
  },
  {
    icon: Sparkles,
    text: "Monokrom kombinler (tek renk) hem şık hem de kolay bir seçimdir."
  },
  {
    icon: Clock,
    text: "İyi kalite temel parçalar uzun vadede daha ekonomik bir yatırımdır."
  },
  {
    icon: Lightbulb,
    text: "Katmanlama (layering) tekniği ile mevsim geçişlerinde rahat kombin yapabilirsiniz."
  }
];

interface OutfitLoadingProgressProps {
  isVisible: boolean;
}

const OutfitLoadingProgress = ({ isVisible }: OutfitLoadingProgressProps) => {
  const [progress, setProgress] = useState(0);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setProgress(0);
      setCurrentTipIndex(0);
      setElapsedTime(0);
      return;
    }

    // Progress tracking (40 seconds total)
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + (100 / 40); // Increment every second for 40 seconds
      });
    }, 1000);

    // Tip rotation (every 7 seconds)
    const tipInterval = setInterval(() => {
      setCurrentTipIndex(prev => (prev + 1) % fashionTips.length);
    }, 7000);

    // Elapsed time tracking
    const timeInterval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(tipInterval);
      clearInterval(timeInterval);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const currentTip = fashionTips[currentTipIndex];
  const IconComponent = currentTip.icon;
  const estimatedTime = 40;
  const remainingTime = Math.max(0, estimatedTime - elapsedTime);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="animate-spin">
              <Sparkles className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              AI Kombinlerinizi Oluşturuyor
            </h3>
          </div>
          <p className="text-sm text-gray-600">
            Tahmini bekleme süresi: ~{estimatedTime} saniye
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">İlerleme</span>
            <span className="text-sm text-gray-500">
              {elapsedTime}s / {estimatedTime}s ({remainingTime}s kaldı)
            </span>
          </div>
          <Progress 
            value={progress} 
            className="h-3 bg-gray-200"
          />
          <div className="text-center">
            <span className="text-sm font-semibold text-blue-600">
              %{Math.round(progress)}
            </span>
          </div>
        </div>

        {/* Fashion Tip */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
              <IconComponent className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                Stil İpucu #{currentTipIndex + 1}
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {currentTip.text}
              </p>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span>Gardırobunuz analiz ediliyor ve mükemmel kombinler hazırlanıyor...</span>
        </div>
      </div>
    </div>
  );
};

export default OutfitLoadingProgress;
