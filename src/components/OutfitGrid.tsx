
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share, Heart, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Outfit {
  id: string;
  name: string;
  styling_tips: string;
  items?: string[];
  reference_images?: string[];
  clothing_item_ids?: string[];
  occasion?: string;
  is_saved?: boolean;
  generated_image?: string;
}

interface OutfitGridProps {
  outfits: Outfit[];
  onDelete?: (outfitId: string) => void;
}

const OutfitGrid = ({ outfits, onDelete }: OutfitGridProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const handleDelete = async (outfitId: string) => {
    if (!onDelete) return;
    
    setDeletingId(outfitId);
    try {
      await onDelete(outfitId);
      toast.success("Kombin favorilerden kaldırıldı!");
    } catch (error) {
      toast.error("Kombin silinirken hata oluştu");
    } finally {
      setDeletingId(null);
    }
  };

  if (!outfits || outfits.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz kaydedilen kombin yok</h3>
        <p className="text-gray-500">Beğendiğiniz kombinleri kaydetmeye başlayın</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {outfits.map((outfit) => {
        const hasVerticalFlatlay = outfit.generated_image;
        const hasReferenceImages = outfit.reference_images && outfit.reference_images.length > 0;
        
        const primaryImage = hasVerticalFlatlay ? outfit.generated_image :
          (hasReferenceImages ? outfit.reference_images![0] : 
           'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop');

        const shouldShowGrid = !hasVerticalFlatlay && hasReferenceImages && outfit.reference_images!.length > 1;

        return (
          <Card key={outfit.id} className="bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              {/* Outfit Preview */}
              <div className="relative overflow-hidden aspect-[4/5]">
                {shouldShowGrid ? (
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
                          alt={`${outfit.items?.[index] || 'Outfit item'}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="w-full h-full">
                    <img
                      src={primaryImage}
                      alt={outfit.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
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
                    onClick={() => handleShare(outfit)}
                  >
                    <Share className="h-5 w-5 text-gray-600" />
                  </Button>
                  {onDelete && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-10 w-10 p-0 bg-white/90 hover:bg-white rounded-full shadow-sm"
                      onClick={() => handleDelete(outfit.id)}
                      disabled={deletingId === outfit.id}
                    >
                      <Trash2 className={`h-5 w-5 ${deletingId === outfit.id ? 'text-gray-400' : 'text-red-500 hover:text-red-600'}`} />
                    </Button>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{outfit.name}</h3>
                </div>

                {outfit.items && outfit.items.length > 0 && (
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
                )}

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
      })}
    </div>
  );
};

export default OutfitGrid;
