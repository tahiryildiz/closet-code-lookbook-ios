
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
        // Get weather-appropriate items (mock logic for now)
        const { data: items } = await supabase
          .from('clothing_items')
          .select('id, name, category, primary_color, brand, image_url')
          .eq('user_id', user.id)
          .in('category', ['tshirt', 'shirt', 'pants', 'jacket']) // Weather-appropriate categories
          .limit(4);

        setRecommendedItems(items || []);
      } catch (error) {
        console.error('Error fetching recommended items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedItems();
  }, [user]);

  if (loading || recommendedItems.length === 0) return null;

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
