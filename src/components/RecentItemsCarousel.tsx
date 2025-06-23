
import { Card, CardContent } from "@/components/ui/card";
import { Shirt } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getTurkishLabel, categoryOptions } from "@/utils/localization";

interface WardrobeItem {
  id: string;
  name: string;
  category: string;
  primary_color: string;
  brand?: string;
  image_url: string;
  created_at: string;
}

interface RecentItemsCarouselProps {
  items: WardrobeItem[];
}

const RecentItemsCarousel = ({ items }: RecentItemsCarouselProps) => {
  const navigate = useNavigate();

  if (!items || items.length === 0) return null;

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex space-x-4 pb-2" style={{ width: `${items.length * 140}px` }}>
        {items.map((item) => (
          <div
            key={item.id}
            className="flex-shrink-0 w-32"
            onClick={() => navigate('/wardrobe')}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm rounded-2xl cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105">
              <CardContent className="p-3">
                <div className="aspect-square bg-gray-50 rounded-xl mb-2 overflow-hidden">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <Shirt className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <p className="font-medium text-sm text-gray-900 truncate">{item.name}</p>
                <p className="text-xs text-gray-500">{getTurkishLabel(item.category, categoryOptions)}</p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentItemsCarousel;
