
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Thermometer, Shirt } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { getTurkishLabel, categoryOptions } from "@/utils/localization";

interface WardrobeItem {
  id: string;
  name: string;
  category: string;
  primary_color: string;
  brand?: string;
  image_url: string;
}

const WeatherRecommendations = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recommendedItems, setRecommendedItems] = useState<WardrobeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendedItems = async () => {
      if (!user) return;

      try {
        // Get all clothing items first, then filter for weather-appropriate ones
        const { data: items } = await supabase
          .from('clothing_items')
          .select('id, name, category, primary_color, brand, image_url')
          .eq('user_id', user.id)
          .limit(8); // Get more items to filter from

        if (items && items.length > 0) {
          // Filter for weather-appropriate categories or just take first 4 if not enough
          const weatherAppropriate = items.filter(item => 
            ['tshirt', 'shirt', 'pants', 'jacket', 'dress', 'skirt', 'shorts', 'sweater'].includes(item.category)
          );
          
          const selectedItems = weatherAppropriate.length >= 4 
            ? weatherAppropriate.slice(0, 4)
            : items.slice(0, 4);
            
          setRecommendedItems(selectedItems);
        }
      } catch (error) {
        console.error('Error fetching recommended items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedItems();
  }, [user]);

  // Don't render if loading or no user
  if (loading || !user) return null;
  
  // Show the card even if no items, with a message to add items
  if (recommendedItems.length === 0) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center">
            <Thermometer className="h-5 w-5 mr-2 text-orange-600" />
            Bugünkü Hava İçin Öneriler
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/wardrobe')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Kıyafet Ekle
          </Button>
        </div>
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <Shirt className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Hava durumu önerileri için gardırobunuza kıyafet ekleyin</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center">
          <Thermometer className="h-5 w-5 mr-2 text-orange-600" />
          Bugünkü Hava İçin Öneriler
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/wardrobe')}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          Tümünü Gör
        </Button>
      </div>
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 px-3 pb-2" style={{ width: `${recommendedItems.length * 220 + 24}px` }}>
          {recommendedItems.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-52"
              onClick={() => navigate('/wardrobe')}
            >
              <Card className="w-full bg-white border border-gray-100 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 rounded-2xl overflow-hidden group">
                <CardContent className="p-0">
                  <div className="aspect-[4/5] bg-gray-50 overflow-hidden relative">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <Shirt className="h-20 w-20 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 text-xl mb-2 leading-tight line-clamp-2">{item.name}</h3>
                    <p className="text-gray-500 text-base font-medium">{getTurkishLabel(item.category, categoryOptions)}</p>
                    {item.brand && (
                      <p className="text-gray-400 text-sm mt-2 font-medium truncate">{item.brand}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherRecommendations;
