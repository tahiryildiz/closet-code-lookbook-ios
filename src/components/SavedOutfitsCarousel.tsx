
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
    <div className="overflow-x-auto scrollbar-hide -mx-6">
      <div className="flex space-x-4 px-6 pb-2" style={{ width: `${outfits.length * 280 + 48}px` }}>
        {outfits.map((outfit) => (
          <div
            key={outfit.id}
            className="flex-shrink-0 w-64"
            onClick={() => navigate('/saved-outfits')}
          >
            <Card className="bg-white border border-gray-100 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 rounded-3xl overflow-hidden group">
              <CardContent className="p-0">
                <div className="aspect-[4/5] bg-gray-50 overflow-hidden relative">
                  <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                    <div className="bg-blue-500 rounded-2xl p-6">
                      <Bookmark className="h-16 w-16 text-white" />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 text-lg mb-2 leading-tight">{outfit.name}</h3>
                  <p className="text-gray-500 text-base font-medium">{outfit.occasion || 'Kaydedilen'}</p>
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
