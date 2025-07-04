
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import ItemForm from "./ItemForm";

interface FormData {
  name: string;
  brand: string;
  category: string;
  primaryColor: string;
  tags: string;
  notes: string;
}

interface AnalysisStepProps {
  isAnalyzing: boolean;
  analysisResult: any;
  formData: FormData;
  onFormDataChange: (data: Partial<FormData>) => void;
  onSave: () => void;
  onBack: () => void;
}

const AnalysisStep = ({
  isAnalyzing,
  analysisResult,
  formData,
  onFormDataChange,
  onSave,
  onBack
}: AnalysisStepProps) => {
  console.log('AnalysisStep - isAnalyzing:', isAnalyzing);
  console.log('AnalysisStep - analysisResult:', analysisResult);

  if (isAnalyzing) {
    return (
      <div className="text-center py-12 space-y-6">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 text-xl">AI Analizi Devam Ediyor...</h3>
          <div className="space-y-2">
            <Progress value={75} className="w-full max-w-xs mx-auto h-2" />
            <p className="text-gray-600 text-sm animate-pulse">Ürün detayları belirleniyor...</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 max-w-sm mx-auto">
          <p className="text-blue-700 text-xs leading-relaxed">
            AI'mız ürününüzü detaylıca inceliyor ve en doğru bilgileri sağlamaya çalışıyor. 
            Bu işlem 10-15 saniye sürebilir.
          </p>
        </div>
      </div>
    );
  }

  if (!analysisResult) {
    console.log('No analysis result available');
    return (
      <div className="text-center py-12 space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <h3 className="font-bold text-red-800 text-lg mb-2">Analiz Hatası</h3>
          <p className="text-red-600">
            Ürün analizi tamamlanamadı. Lütfen tekrar deneyin.
          </p>
          <Button
            onClick={onBack}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white"
          >
            Geri Dön
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Display the analyzed product image */}
      {analysisResult.imageUrl && (
        <div className="text-center">
          <div className="aspect-square w-48 mx-auto bg-gray-100 rounded-2xl overflow-hidden shadow-md">
            <img
              src={analysisResult.imageUrl}
              alt="Analyzed product"
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('Image failed to load:', analysisResult.imageUrl);
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>
      )}

      <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="bg-green-100 rounded-full p-2">
            <Check className="h-4 w-4 text-green-600" />
          </div>
          <span className="text-sm font-semibold text-green-800">
            AI Analizi Tamamlandı ({analysisResult.confidence || 50}% güven)
          </span>
        </div>
        <p className="text-sm text-green-700 leading-relaxed">
          Aşağıdaki detayları otomatik olarak doldurduk. İstediğiniz değişiklikleri yapabilirsiniz!
        </p>
      </div>

      <ItemForm
        formData={formData}
        analysisResult={analysisResult}
        onFormDataChange={onFormDataChange}
      />

      <div className="flex space-x-3 pt-2">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1 border-gray-200 hover:bg-gray-50 rounded-xl py-3 text-base font-semibold"
        >
          Geri
        </Button>
        <Button
          onClick={onSave}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-3 text-base font-semibold"
        >
          Gardıroba Kaydet
        </Button>
      </div>
    </div>
  );
};

export default AnalysisStep;
