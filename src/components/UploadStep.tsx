
import { useRef } from "react";
import { Camera, Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface UploadStepProps {
  onFileSelect: (file: File) => void;
}

const UploadStep = ({ onFileSelect }: UploadStepProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleCameraCapture = () => {
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

      <div className="space-y-4">
        <Card 
          className="border-2 border-dashed border-blue-200 hover:border-blue-300 transition-colors cursor-pointer rounded-2xl"
          onClick={handleCameraCapture}
        >
          <CardContent className="p-8 text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Camera className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-lg">Fotoğraf Çek</h3>
            <p className="text-gray-500">Kameranı kullanarak ürünü yakala</p>
          </CardContent>
        </Card>

        <Card 
          className="border-2 border-dashed border-blue-200 hover:border-blue-300 transition-colors cursor-pointer rounded-2xl"
          onClick={() => fileInputRef.current?.click()}
        >
          <CardContent className="p-8 text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Upload className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-lg">Görsel Yükle</h3>
            <p className="text-gray-500">Fotoğraf galerinizden seç</p>
          </CardContent>
        </Card>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default UploadStep;
