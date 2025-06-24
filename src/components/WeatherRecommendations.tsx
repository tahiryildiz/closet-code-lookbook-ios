
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-gray-900 flex items-center">
              <Thermometer className="h-5 w-5 mr-2 text-orange-600" />
              Bugünkü Hava İçin Öneriler
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/wardrobe')}
              className="text-orange-600 hover:text-orange-700 text-sm font-medium"
            >
              Kıyafet Ekle
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-center py-8">
            <Shirt className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Hava durumu önerileri için gardırobunuza kıyafet ekleyin</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-gray-900 flex items-center">
            <Thermometer className="h-5 w-5 mr-2 text-orange-600" />
            Bugünkü Hava İçin Öneriler
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/wardrobe')}
            className="text-orange-600 hover:text-orange-700 text-sm font-medium"
          >
            Tümünü Gör
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-3">
          {recommendedItems.map((item) => (
            <div
              key={item.id}
              className="bg-gray-50 rounded-xl p-3 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => navigate('/wardrobe')}
            >
              <div className="aspect-square bg-white rounded-lg mb-2 overflow-hidden">
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
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherRecommendations;
