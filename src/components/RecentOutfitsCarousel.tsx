
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Outfit {
  id: number;
  name: string;
  items: string[];
  confidence: number;
  styling_tips: string;
  generated_image?: string;
  reference_images?: string[];
}

interface RecentOutfitsCarouselProps {
  outfits: Outfit[];
}

const RecentOutfitsCarousel = ({ outfits }: RecentOutfitsCarouselProps) => {
  const navigate = useNavigate();

  if (!outfits || outfits.length === 0) return null;

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex space-x-4 pb-2" style={{ width: `${outfits.length * 140}px` }}>
        {outfits.map((outfit) => (
          <div
            key={outfit.id}
            className="flex-shrink-0 w-32"
            onClick={() => navigate('/outfits')}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm rounded-2xl cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105">
              <CardContent className="p-3">
                <div className="aspect-square bg-gray-50 rounded-xl mb-2 overflow-hidden">
                  {outfit.generated_image ? (
                    <img
                      src={outfit.generated_image}
                      alt={outfit.name}
                      className="w-full h-full object-cover"
                    />
                  ) : outfit.reference_images && outfit.reference_images.length > 0 ? (
                    <img
                      src={outfit.reference_images[0]}
                      alt={outfit.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <Sparkles className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <p className="font-medium text-sm text-gray-900 truncate">{outfit.name}</p>
                <p className="text-xs text-gray-500">{outfit.confidence}% uyumlu</p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentOutfitsCarousel;
