
import { Share, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useState } from "react";

interface OutfitCardProps {
  outfit: {
    id: number;
    name: string;
    items: string[];
    item_ids?: string[];
    confidence: number;
    styling_tips: string;
    occasion?: string;
    generated_image?: string;
    reference_images?: string[];
    composition_type?: string;
    item_count?: number;
    aspect_ratio?: string;
    is_saved?: boolean;
    // Legacy support
    images?: string[];
    product_images?: string[];
    complete_outfit_images?: boolean;
    image_count?: number;
  };
  onSave?: (outfitId: number) => void;
}

const OutfitCard = ({ outfit, onSave }: OutfitCardProps) => {
  const [isSaved, setIsSaved] = useState(outfit.is_saved || false);
  
  // Prioritize generated vertical flatlay composition, fallback to reference images
  const hasVerticalFlatlay = outfit.generated_image && 
    (outfit.composition_type === 'professional_flatlay_vertical' || 
     outfit.composition_type === 'professional_flatlay');
  const hasReferenceImages = outfit.reference_images && outfit.reference_images.length > 0;
  
  // Display logic based on available images
  const primaryImage = hasVerticalFlatlay ? outfit.generated_image :
    (hasReferenceImages ? outfit.reference_images![0] : 
     'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop');

  const shouldShowGrid = !hasVerticalFlatlay && hasReferenceImages && outfit.reference_images!.length > 1;

  const handleSave = () => {
    if (onSave && !isSaved) {
      onSave(outfit.id);
      setIsSaved(true);
      toast.success("Kombin kaydedildi!");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: outfit.name,
        text: `${outfit.name} - ${outfit.items.join(', ')}`,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(`${outfit.name} - ${outfit.items.join(', ')}`);
      toast.success("Kombin panoya kopyalandı!");
    }
  };

  return (
    <Card className="bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden">
      <CardContent className="p-0">
        {/* Outfit Preview */}
        <div className={`relative overflow-hidden ${
          hasVerticalFlatlay && (outfit.aspect_ratio === '1024x1536' || outfit.aspect_ratio === '1024x1792')
            ? 'aspect-[2/3]' // Vertical aspect ratio for supported dimensions
            : 'aspect-[4/5]' // Default aspect ratio
        }`}>
          {shouldShowGrid ? (
            // Show reference images in grid when no flatlay composition is available
            <div className="w-full h-full grid grid-cols-2 gap-1 p-2 bg-gray-50">
              {outfit.reference_images!.slice(0, 4).map((imageUrl, index) => (
                <div 
                  key={index} 
                  className={`relative overflow-hidden rounded-lg bg-white shadow-sm ${
                    outfit.reference_images!.length === 3 && index === 0 ? 'col-span-2' : ''
                  }`}
                >
                  <img
                    src={imageUrl}
                    alt={`${outfit.items[index] || 'Outfit item'}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error(`Failed to load reference image: ${imageUrl}`);
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop';
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            // Show single flatlay composition or primary image
            <div className="w-full h-full">
              <img
                src={primaryImage}
                alt={outfit.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error(`Failed to load primary image: ${primaryImage}`);
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop';
                }}
              />
            </div>
          )}
          
          <div className="absolute top-4 right-4 flex space-x-2">
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-10 w-10 p-0 bg-white/90 hover:bg-white rounded-full shadow-sm"
              onClick={handleSave}
              disabled={isSaved}
            >
              <Heart 
                className={`h-5 w-5 ${
                  isSaved 
                    ? 'text-red-500 fill-red-500' 
                    : 'text-gray-600 hover:text-red-400'
                }`} 
              />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-10 w-10 p-0 bg-white/90 hover:bg-white rounded-full shadow-sm"
              onClick={handleShare}
            >
              <Share className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Outfit Title */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{outfit.name}</h3>
          </div>

          {/* Items List */}
          <div className="space-y-2">
            <h4 className="text-base font-semibold text-gray-900">Bu kombinasyonda:</h4>
            <div className="space-y-1">
              {outfit.items.map((item, index) => (
                <div key={index} className="text-sm text-gray-600 flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Styling Tips - Only show if available and not in English */}
          {outfit.styling_tips && !outfit.styling_tips.toLowerCase().includes('this outfit') && (
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 rounded-full p-2">
                  <Heart className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-blue-900 mb-1">Stil İpucu</p>
                  <p className="text-sm text-blue-800 leading-relaxed">{outfit.styling_tips}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OutfitCard;
