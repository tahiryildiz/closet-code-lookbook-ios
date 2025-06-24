
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Outfit {
  id: string | number;
  name: string;
  items?: string[];
  styling_tips: string;
  generated_image?: string;
  reference_images?: string[];
  clothing_item_ids?: string[];
  occasion?: string;
  confidence?: number;
  is_saved?: boolean;
}

interface OutfitGridProps {
  outfits: Outfit[];
  onSave?: (outfitId: number | string) => void;
}

const OutfitGrid = ({ outfits, onSave }: OutfitGridProps) => {
  const handleShare = (outfit: Outfit) => {
    if (navigator.share) {
      navigator.share({
        title: outfit.name,
        text: `${outfit.name} - ${outfit.items?.join(', ') || 'Kombin'}`,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(`${outfit.name} - ${outfit.items?.join(', ') || 'Kombin'}`);
      toast.success("Kombin panoya kopyalandı!");
    }
  };

  if (!outfits || outfits.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Henüz kombin bulunmuyor</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {outfits.map((outfit, index) => {
        const primaryImage = outfit.generated_image && outfit.generated_image !== 'generated_image_exists' 
          ? outfit.generated_image 
          : (outfit.reference_images && outfit.reference_images.length > 0 
              ? outfit.reference_images[0] 
              : 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop');

        return (
          <Card key={outfit.id || index} className="bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-[4/5] overflow-hidden">
                {outfit.reference_images && outfit.reference_images.length > 1 ? (
                  // Show grid of reference images for multi-item outfits
                  <div className="w-full h-full grid grid-cols-2 gap-1 p-2 bg-gray-50">
                    {outfit.reference_images.slice(0, 4).map((imageUrl, imgIndex) => (
                      <div 
                        key={imgIndex} 
                        className={`relative overflow-hidden rounded-lg bg-white shadow-sm ${
                          outfit.reference_images!.length === 3 && imgIndex === 0 ? 'col-span-2' : ''
                        }`}
                      >
                        <img
                          src={imageUrl}
                          alt={`${outfit.items?.[imgIndex] || 'Outfit item'}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  // Show single image
                  <img
                    src={primaryImage}
                    alt={outfit.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop';
                    }}
                  />
                )}
                
                <div className="absolute top-2 right-2 flex space-x-1">
                  {onSave && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0 bg-white/90 hover:bg-white rounded-full shadow-sm"
                      onClick={() => onSave(outfit.id)}
                      disabled={outfit.is_saved}
                    >
                      <Heart 
                        className={`h-4 w-4 ${
                          outfit.is_saved 
                            ? 'text-red-500 fill-red-500' 
                            : 'text-gray-600 hover:text-red-400'
                        }`} 
                      />
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 w-8 p-0 bg-white/90 hover:bg-white rounded-full shadow-sm"
                    onClick={() => handleShare(outfit)}
                  >
                    <Share className="h-4 w-4 text-gray-600" />
                  </Button>
                </div>
              </div>

              <div className="p-3">
                <h3 className="font-semibold text-sm text-gray-900 mb-1 truncate">{outfit.name}</h3>
                <p className="text-xs text-gray-500 mb-2">
                  {outfit.occasion || 'Kombin'} • {outfit.items?.length || 0} parça
                </p>
                {outfit.items && outfit.items.length > 0 && (
                  <div className="text-xs text-gray-600">
                    {outfit.items.slice(0, 2).join(', ')}
                    {outfit.items.length > 2 && '...'}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default OutfitGrid;
