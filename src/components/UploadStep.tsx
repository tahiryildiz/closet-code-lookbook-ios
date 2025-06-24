
import { useRef } from "react";
import { Upload, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UploadStepProps {
  onFileSelect: (files: File[]) => void;
  selectedFiles?: File[];
  onRemoveFile?: (index: number) => void;
}

const UploadStep = ({ onFileSelect, selectedFiles = [], onRemoveFile }: UploadStepProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      console.log('Files selected:', files.length);
      onFileSelect([...selectedFiles, ...files]);
    }
    // Reset input
    event.target.value = '';
  };

  const handleGallerySelect = () => {
    console.log('Gallery select clicked');
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-gray-600 text-base leading-relaxed">
          Kıyafet ürünlerinin fotoğraflarını yükle. 
          AI'mız otomatik olarak her şeyi analiz edip kategorize edecek!
        </p>
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Seçilen Fotoğraflar ({selectedFiles.length})</h4>
          <div className="grid grid-cols-2 gap-3">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Selected ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                {onRemoveFile && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                    onClick={() => onRemoveFile(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedFiles.length === 0 && (
        <Card 
          className="border-2 border-dashed border-blue-200 hover:border-blue-300 transition-colors cursor-pointer rounded-2xl"
          onClick={handleGallerySelect}
        >
          <CardContent className="p-8 text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Upload className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-lg">Görsel Yükle</h3>
            <p className="text-gray-500">Tek tek veya toplu şekilde ürün yükleyebilirsiniz</p>
          </CardContent>
        </Card>
      )}

      {/* Gallery input - multiple photos */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default UploadStep;
