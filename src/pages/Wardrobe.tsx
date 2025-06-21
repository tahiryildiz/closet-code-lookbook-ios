
import { useState, useRef } from "react";
import { Plus, Search, Filter } from "lucide-react";
import { Camera } from "@capacitor/camera";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import WardrobeGrid from "@/components/WardrobeGrid";
import CategoryFilter from "@/components/CategoryFilter";
import AnalysisStep from "@/components/AnalysisStep";

const Wardrobe = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showAnalysisStep, setShowAnalysisStep] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddProduct = async () => {
    try {
      // Try to use Capacitor Camera first (for mobile)
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        source: Camera.CameraSource.Prompt, // This shows the iOS menu with camera/gallery options
        resultType: Camera.CameraResultType.DataUrl,
      });

      if (image.dataUrl) {
        setSelectedImage(image.dataUrl);
        setShowAnalysisStep(true);
      }
    } catch (error) {
      console.log('Capacitor camera not available, falling back to file input');
      // Fallback to file input for web
      fileInputRef.current?.click();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSelectedImage(result);
        setShowAnalysisStep(true);
      };
      reader.readAsDataURL(file);
    }
  };

  if (showAnalysisStep && selectedImage) {
    return (
      <AnalysisStep
        imageUrl={selectedImage}
        onBack={() => {
          setShowAnalysisStep(false);
          setSelectedImage(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header with professional design */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white">
        <div className="px-6 pt-12 pb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-medium">Gardrobum</h1>
              <p className="text-white/80 text-base mt-1">Gardırobunu düzenle ve yönet</p>
            </div>
            <Button
              onClick={handleAddProduct}
              className="bg-white/20 hover:bg-white/30 rounded-full h-12 w-12 p-0 backdrop-blur-sm border border-white/20"
            >
              <Plus className="h-6 w-6 text-white" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Search and Filters in same line */}
        <div className="flex items-center space-x-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Gardırobunu ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-gray-200 focus:border-blue-400 rounded-2xl text-base py-3"
            />
          </div>
          
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="bg-white border-gray-200 hover:bg-gray-50 rounded-2xl py-3 px-4 font-semibold"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtreler
          </Button>
        </div>

        {/* Category Filter */}
        {showFilters && (
          <Card className="bg-white border-0 shadow-sm rounded-2xl">
            <CardContent className="p-4">
              <CategoryFilter
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </CardContent>
          </Card>
        )}

        {/* Wardrobe Grid */}
        <WardrobeGrid
          viewMode="grid"
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
        />
      </div>

      {/* Hidden file input for fallback */}
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

export default Wardrobe;
