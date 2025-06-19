
import { Heart, Share, Sparkles } from "lucide-react";
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
  };
}

const OutfitCard = ({ outfit }: OutfitCardProps) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-rose-200 hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{outfit.name}</CardTitle>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            {outfit.confidence}% match
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Outfit Preview */}
        <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl">👗</div>
          </div>
          <div className="absolute top-2 right-2">
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 bg-white/80 hover:bg-white">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Outfit includes:</h4>
          <div className="space-y-1">
            {outfit.items.map((item, index) => (
              <div key={index} className="text-sm text-gray-600 flex items-center">
                <div className="w-2 h-2 bg-rose-400 rounded-full mr-2"></div>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Styling Tips */}
        <div className="bg-rose-50 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Sparkles className="h-4 w-4 text-rose-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-rose-700 mb-1">Styling Tip</p>
              <p className="text-sm text-rose-600">{outfit.styling_tips}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Button className="flex-1 bg-rose-500 hover:bg-rose-600 text-white">
            Try This Look
          </Button>
          <Button variant="outline" size="sm" className="border-rose-200 hover:bg-rose-50">
            <Share className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OutfitCard;
