
import { useRef, useEffect } from "react";
import { Camera } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface UploadStepProps {
  onFileSelect: (file: File) => void;
  autoTrigger?: boolean;
}

const UploadStep = ({ onFileSelect, autoTrigger = false }: UploadStepProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoTrigger) {
      // Small delay to ensure the modal is fully rendered
      setTimeout(() => {
        fileInputRef.current?.click();
      }, 100);
    }
  }, [autoTrigger]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleCardClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-gray-600 text-base leading-relaxed">
          Kıyafet ürününün fotoğrafını çek veya yükle. 
          AI'mız otomatik olarak her şeyi analiz edip kategorize edecek!
        </p>
      </div>

      <Card 
        className="border-2 border-dashed border-blue-200 hover:border-blue-300 transition-colors cursor-pointer rounded-2xl"
        onClick={handleCardClick}
      >
        <CardContent className="p-8 text-center">
          <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Camera className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2 text-lg">Fotoğraf Seç</h3>
          <p className="text-gray-500">Kameranı kullan veya galerinizden seç</p>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default UploadStep;
