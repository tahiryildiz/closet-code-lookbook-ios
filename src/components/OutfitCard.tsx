
import { Heart, Share, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface OutfitCardProps {
  outfit: {
    id: number;
    name: string;
    items: string[];
    confidence: number;
    styling_tips: string;
    occasion: string;
    image: string;
  };
}

const OutfitCard = ({ outfit }: OutfitCardProps) => {
  return (
    <Card className="bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden">
      <CardContent className="p-0">
        {/* Outfit Preview */}
        <div className="aspect-[4/5] relative overflow-hidden">
          <img
            src={outfit.image}
            alt={outfit.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 flex space-x-2">
            <Button size="sm" variant="ghost" className="h-10 w-10 p-0 bg-white/90 hover:bg-white rounded-full shadow-sm">
              <Heart className="h-5 w-5 text-gray-600" />
            </Button>
            <Button size="sm" variant="ghost" className="h-10 w-10 p-0 bg-white/90 hover:bg-white rounded-full shadow-sm">
              <Share className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
          <div className="absolute top-4 left-4">
            <Badge className="bg-blue-500 text-white rounded-full font-semibold">
              {outfit.confidence}% match
            </Badge>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-4">
            <h3 className="text-white font-bold text-xl mb-1">{outfit.name}</h3>
            <p className="text-white/90 text-sm font-medium">{outfit.occasion}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Items List */}
          <div className="space-y-2">
            <h4 className="text-base font-semibold text-gray-900">What you'll wear:</h4>
            <div className="space-y-1">
              {outfit.items.map((item, index) => (
                <div key={index} className="text-sm text-gray-600 flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Styling Tips */}
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 rounded-full p-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-900 mb-1">Pro Tip</p>
                <p className="text-sm text-blue-800 leading-relaxed">{outfit.styling_tips}</p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl text-base">
            Try This Look
            <ChevronRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OutfitCard;
