
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Lightbulb } from "lucide-react";
import { useState, useEffect } from "react";

const StyleTipsCard = () => {
  const [currentTip, setCurrentTip] = useState(0);

  const styleTips = [
    "Aksesuar seçerken 'üçlü kural'ını uygulayın - maksimum 3 aksesuar.",
    "Monokrom kombinler için aynı rengin farklı tonlarını kullanın.",
    "Desenli üst giyiyorsanız, alt kısmı düz renk tercih edin.",
    "Vücut tipinize uygun kesimler seçerek siluetinizi vurgulayın.",
    "Kontrast renkler kullanarak ilginç kombinler yaratabilirsiniz.",
    "Klasik parçalar ile trend parçaları birleştirmeyi deneyin."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % styleTips.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 shadow-sm rounded-3xl overflow-hidden">
      <CardHeader className="px-6 pt-6 pb-4">
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-3 mr-4">
            <Lightbulb className="h-6 w-6 text-white" />
          </div>
          Günün Stil İpucu
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="bg-white/60 rounded-2xl p-6 backdrop-blur-sm">
          <p className="text-gray-800 text-lg leading-relaxed font-medium">
            {styleTips[currentTip]}
          </p>
        </div>
        <div className="flex justify-center mt-4 space-x-2">
          {styleTips.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentTip ? 'bg-purple-500' : 'bg-purple-200'
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StyleTipsCard;
