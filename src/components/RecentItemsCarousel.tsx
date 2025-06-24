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
const RecentItemsCarousel = ({
  items
}: RecentItemsCarouselProps) => {
  const navigate = useNavigate();
  if (!items || items.length === 0) return null;
  return <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-4 px-3 pb-2" style={{
      width: `${items.length * 220 + 24}px`
    }}>
        {items.map(item => <div key={item.id} className="flex-shrink-0 w-52" onClick={() => navigate('/wardrobe')}>
            <Card className="w-full bg-white border border-gray-100 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 rounded-2xl overflow-hidden group">
              <CardContent className="p-0">
                <div className="aspect-[4/5] bg-gray-50 overflow-hidden relative">
                  {item.image_url ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" /> : <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <Shirt className="h-20 w-20 text-gray-400" />
                    </div>}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-xl mb-2 leading-tight line-clamp-2">{item.name}</h3>
                  <p className="text-gray-500 text-base font-medium">{getTurkishLabel(item.category, categoryOptions)}</p>
                  {item.brand}
                </div>
              </CardContent>
            </Card>
          </div>)}
      </div>
    </div>;
};
export default RecentItemsCarousel;