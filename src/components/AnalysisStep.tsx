
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  if (isAnalyzing) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-6"></div>
        <h3 className="font-semibold text-gray-900 mb-3 text-lg">Ürününüz analiz ediliyor...</h3>
        <p className="text-gray-500 text-base">AI'mız kategori, renk, malzeme ve stili tanımlıyor</p>
      </div>
    );
  }

  if (!analysisResult) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="bg-green-100 rounded-full p-2">
            <Check className="h-4 w-4 text-green-600" />
          </div>
          <span className="text-sm font-semibold text-green-800">
            AI Analizi Tamamlandı (%{analysisResult.confidence} güven)
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
          Gardiroba Kaydet
        </Button>
      </div>
    </div>
  );
};

export default AnalysisStep;
