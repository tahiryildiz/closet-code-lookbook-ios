
import { Card, CardContent } from "@/components/ui/card";
import { Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SavedOutfit {
  id: string;
  name: string;
  clothing_item_ids: string[];
  ai_styling_tips: string;
  occasion?: string;
  saved_at: string;
}

interface SavedOutfitsCarouselProps {
  outfits: SavedOutfit[];
}

const SavedOutfitsCarousel = ({ outfits }: SavedOutfitsCarouselProps) => {
  const navigate = useNavigate();

  if (!outfits || outfits.length === 0) return null;

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex space-x-4 pb-2" style={{ width: `${outfits.length * 140}px` }}>
        {outfits.map((outfit) => (
          <div
            key={outfit.id}
            className="flex-shrink-0 w-32"
            onClick={() => navigate('/saved-outfits')}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm rounded-2xl cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105">
              <CardContent className="p-3">
                <div className="aspect-square bg-gray-50 rounded-xl mb-2 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                    <Bookmark className="h-8 w-8 text-blue-500" />
                  </div>
                </div>
                <p className="font-medium text-sm text-gray-900 truncate">{outfit.name}</p>
                <p className="text-xs text-gray-500">{outfit.occasion || 'Kaydedilen'}</p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedOutfitsCarousel;
