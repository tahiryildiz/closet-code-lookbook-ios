
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
    <div className="overflow-x-auto scrollbar-hide -mx-2">
      <div className="flex space-x-4 px-2 pb-2" style={{ width: `${outfits.length * 160 + 32}px` }}>
        {outfits.map((outfit) => (
          <div
            key={outfit.id}
            className="flex-shrink-0 w-36"
            onClick={() => navigate('/saved-outfits')}
          >
            <Card className="bg-white border border-gray-100 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 rounded-2xl overflow-hidden group">
              <CardContent className="p-0">
                <div className="aspect-[4/5] bg-gray-50 overflow-hidden relative">
                  <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                    <div className="bg-blue-500 rounded-2xl p-4">
                      <Bookmark className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 text-base mb-1 truncate">{outfit.name}</h3>
                  <p className="text-gray-500 text-sm font-medium">{outfit.occasion || 'Kaydedilen'}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedOutfitsCarousel;
