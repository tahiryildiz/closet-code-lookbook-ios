
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
  material?: string;
  sub_category?: string;
}

interface WeatherData {
  temp: number;
  condition: string;
  location: string;
  description: string;
}

const WeatherRecommendations = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recommendedItems, setRecommendedItems] = useState<WardrobeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    // Get weather data from the WeatherCard component
    const getWeatherData = () => {
      const weatherData = (window as any).currentWeather;
      if (weatherData) {
        setCurrentWeather(weatherData);
      }
    };

    // Check for weather data immediately and then periodically
    getWeatherData();
    const interval = setInterval(getWeatherData, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchWeatherAppropriateItems = async () => {
      if (!user || !currentWeather) return;

      try {
        // Get all clothing items first
        const { data: items } = await supabase
          .from('clothing_items')
          .select('id, name, category, primary_color, brand, image_url, material, sub_category')
          .eq('user_id', user.id);

        if (items && items.length > 0) {
          // Filter items based on current weather conditions
          const weatherAppropriate = filterItemsByWeather(items, currentWeather);
          
          // Take up to 4 most appropriate items
          setRecommendedItems(weatherAppropriate.slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching weather-appropriate items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherAppropriateItems();
  }, [user, currentWeather]);

  const filterItemsByWeather = (items: WardrobeItem[], weather: WeatherData): WardrobeItem[] => {
    const temp = weather.temp;
    const condition = weather.condition;

    return items.filter(item => {
      // Temperature-based filtering
      if (temp >= 25) {
        // Hot weather - avoid heavy items
        const hotWeatherCategories = ['tshirt', 'tank_top', 'shorts', 'skirt', 'dress', 'sandals', 'light_shirt'];
        const avoidCategories = ['sweater', 'hoodie', 'jacket', 'coat', 'boots', 'long_sleeve'];
        
        if (avoidCategories.includes(item.category)) return false;
        if (hotWeatherCategories.includes(item.category)) return true;
        
        // Material-based filtering for hot weather
        if (item.material) {
          const lightMaterials = ['cotton', 'linen', 'silk', 'chiffon'];
          const heavyMaterials = ['wool', 'cashmere', 'fleece', 'leather'];
          
          if (heavyMaterials.some(material => item.material?.toLowerCase().includes(material))) return false;
          if (lightMaterials.some(material => item.material?.toLowerCase().includes(material))) return true;
        }
      } else if (temp >= 15 && temp < 25) {
        // Mild weather - most items appropriate
        const mildWeatherCategories = [
          'tshirt', 'shirt', 'pants', 'jeans', 'dress', 'skirt', 
          'light_jacket', 'cardigan', 'sneakers', 'flats'
        ];
        if (mildWeatherCategories.includes(item.category)) return true;
      } else if (temp < 15) {
        // Cold weather - prefer warm items
        const coldWeatherCategories = [
          'sweater', 'hoodie', 'jacket', 'coat', 'pants', 'jeans', 
          'boots', 'long_sleeve', 'cardigan'
        ];
        const avoidCategories = ['shorts', 'tank_top', 'sandals'];
        
        if (avoidCategories.includes(item.category)) return false;
        if (coldWeatherCategories.includes(item.category)) return true;
        
        // Material-based filtering for cold weather
        if (item.material) {
          const warmMaterials = ['wool', 'cashmere', 'fleece', 'denim'];
          if (warmMaterials.some(material => item.material?.toLowerCase().includes(material))) return true;
        }
      }

      // Condition-based filtering
      if (condition === 'rainy') {
        // Prefer closed shoes and jackets
        const rainyCategories = ['jacket', 'boots', 'pants', 'jeans'];
        const avoidCategories = ['sandals', 'shorts'];
        
        if (avoidCategories.includes(item.category)) return false;
        if (rainyCategories.includes(item.category)) return true;
      }

      // Default: include item if no specific rules exclude it
      return true;
    });
  };

  const getWeatherDescription = () => {
    if (!currentWeather) return "";
    
    const temp = currentWeather.temp;
    if (temp >= 25) return "sıcak";
    if (temp >= 15) return "ılık";
    return "soğuk";
  };

  // Don't render if loading or no user
  if (loading || !user) return null;
  
  // Show the card even if no items, with a message to add items
  if (recommendedItems.length === 0) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center">
            <Thermometer className="h-5 w-5 mr-2 text-orange-600" />
            {currentWeather ? `${getWeatherDescription()} hava için öneriler` : 'Bugünkü Hava İçin Öneriler'}
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
          <p className="text-gray-500 text-sm">
            {currentWeather 
              ? `${currentWeather.temp}°C ${getWeatherDescription()} hava için uygun kıyafet bulunamadı` 
              : 'Hava durumu önerileri için gardırobunuza kıyafet ekleyin'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center">
          <Thermometer className="h-5 w-5 mr-2 text-orange-600" />
          {currentWeather ? `${currentWeather.temp}°C ${getWeatherDescription()} hava için öneriler` : 'Bugünkü Hava İçin Öneriler'}
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
