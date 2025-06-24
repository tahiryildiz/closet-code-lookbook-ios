
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

const StyleTipsCard = () => {
  const [currentTip, setCurrentTip] = useState(0);

  const styleTips = [
    "Monokrom kombinler için aynı rengin farklı tonlarını kullanın.",
    "Desenli üst giyiyorsanız, alt kısmı düz renk tercih edin.",
    "Aksesuar seçerken 'üçlü kural'ını uygulayın - maksimum 3 aksesuar.",
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
    <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border-0 shadow-lg rounded-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-gray-900 flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
          Günün Stil İpucu
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-gray-700 leading-relaxed">
          {styleTips[currentTip]}
        </p>
      </CardContent>
    </Card>
  );
};

export default StyleTipsCard;
