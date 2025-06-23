import { Heart, Share, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    // Legacy support
    images?: string[];
    product_images?: string[];
    complete_outfit_images?: boolean;
    image_count?: number;
  };
}

const OutfitCard = ({ outfit }: OutfitCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Enhanced debug logging to track image data reception
  console.log(`🎯 [DEBUG] OutfitCard - outfit data:`, {
    name: outfit.name,
    composition_type: outfit.composition_type,
    aspect_ratio: outfit.aspect_ratio,
    has_generated_image: !!outfit.generated_image,
    generated_image_type: outfit.generated_image ? (
      outfit.generated_image.startsWith('data:image') ? 'base64_data_url' : 'url'
    ) : null,
    generated_image_size: outfit.generated_image ? outfit.generated_image.length : 0,
    generated_image_preview: outfit.generated_image ? outfit.generated_image.substring(0, 50) + '...' : null,
    has_reference_images: !!outfit.reference_images,
    reference_count: outfit.reference_images?.length || 0
  });

  // Validate base64 data if present
  if (outfit.generated_image && outfit.generated_image.startsWith('data:image')) {
    const base64Part = outfit.generated_image.split(',')[1];
    if (base64Part) {
      console.log(`📊 [DEBUG] Base64 validation:`, {
        valid_format: true,
        base64_length: base64Part.length,
        estimated_file_size_kb: Math.round(base64Part.length * 0.75 / 1024),
        base64_start: base64Part.substring(0, 30),
        base64_end: base64Part.substring(base64Part.length - 30)
      });
    } else {
      console.error(`❌ [DEBUG] Invalid base64 data URL format`);
    }
  }
  
  // Prioritize generated vertical flatlay composition, fallback to reference images
  const hasVerticalFlatlay = outfit.generated_image && 
    (outfit.composition_type === 'professional_flatlay_vertical' || 
     outfit.composition_type === 'professional_flatlay');
  const hasReferenceImages = outfit.reference_images && outfit.reference_images.length > 0;
  
  console.log(`🎯 [DEBUG] Display logic:`, {
    hasVerticalFlatlay,
    hasReferenceImages,
    final_composition_type: outfit.composition_type,
    aspect_ratio: outfit.aspect_ratio
  });
  
  // Display logic based on available images
  const primaryImage = hasVerticalFlatlay ? outfit.generated_image :
    (hasReferenceImages ? outfit.reference_images![0] : 
     'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop');

  const shouldShowGrid = !hasVerticalFlatlay && hasReferenceImages && outfit.reference_images!.length > 1;

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (!isFavorite) {
      toast.success("Kombin favorilere eklendi!");
    } else {
      toast.success("Kombin favorilerden çıkarıldı!");
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
        {/* Outfit Preview - Enhanced for vertical compositions */}
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
                onLoad={() => {
                  console.log(`✅ [DEBUG] Successfully loaded image for ${outfit.name}`);
                  if (hasVerticalFlatlay) {
                    console.log(`🎨 [DEBUG] Vertical flatlay composition loaded successfully`);
                  }
                }}
              />
            </div>
          )}
          
          <div className="absolute top-4 right-4 flex space-x-2">
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-10 w-10 p-0 bg-white/90 hover:bg-white rounded-full shadow-sm"
              onClick={handleFavorite}
            >
              <Heart 
                className={`h-5 w-5 transition-colors ${
                  isFavorite 
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
          
          <div className="absolute top-4 left-4 flex space-x-2">
            <Badge className="bg-blue-500 text-white rounded-full font-semibold">
              {outfit.confidence}% uyumlu
            </Badge>
            {hasVerticalFlatlay && (
              <Badge className="bg-green-500 text-white rounded-full font-semibold">
                {outfit.aspect_ratio === '1024x1536' ? 'AI Vertical Flatlay' : 'AI Flatlay'}
              </Badge>
            )}
            {hasReferenceImages && !hasVerticalFlatlay && (
              <Badge className="bg-orange-500 text-white rounded-full font-semibold">
                {outfit.item_count || outfit.reference_images!.length} ürün
              </Badge>
            )}
          </div>
          
          {/* Simplified overlay without titles */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-4">
            {hasVerticalFlatlay && (
              <p className="text-white/80 text-sm">
                {outfit.aspect_ratio === '1024x1536' 
                  ? 'AI-generated vertical flatlay composition' 
                  : 'AI-generated flatlay composition'}
              </p>
            )}
            {hasReferenceImages && !hasVerticalFlatlay && (
              <p className="text-white/80 text-sm">Reference images from your wardrobe</p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
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

          {/* Enhanced Styling Tips */}
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 rounded-full p-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-900 mb-1">Stil İpucu</p>
                <p className="text-sm text-blue-800 leading-relaxed">{outfit.styling_tips}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OutfitCard;
