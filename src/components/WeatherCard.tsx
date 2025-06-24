import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Cloud, Sun, CloudRain, Snowflake, Wind, CloudSnow, CloudDrizzle } from "lucide-react";

interface WeatherData {
  temp: number;
  condition: string;
  location: string;
  humidity?: number;
  windSpeed?: number;
  description: string;
}

const WeatherCard = () => {
  const [weather, setWeather] = useState<WeatherData>({
    temp: 18,
    condition: "sunny",
    location: "İstanbul",
    description: "Güneşli"
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        // Get user's location
        const position = await getCurrentLocation();
        
        // Fetch weather data from OpenWeatherMap API
        const weatherData = await fetchCurrentWeather(position.latitude, position.longitude);
        setWeather(weatherData);
      } catch (err) {
        console.error('Failed to fetch weather:', err);
        setError('Hava durumu alınamadı');
        // Keep default weather data
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  const getCurrentLocation = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Default to Istanbul coordinates
          resolve({ latitude: 41.0082, longitude: 28.9784 });
        },
        { timeout: 10000 }
      );
    });
  };

  const fetchCurrentWeather = async (lat: number, lon: number): Promise<WeatherData> => {
    // Using OpenWeatherMap free API - you'll need to set up the API key
    const API_KEY = 'your-openweather-api-key'; // This should be moved to environment variables
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=tr`;

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Weather API failed');
      }

      const data = await response.json();
      
      return {
        temp: Math.round(data.main.temp),
        condition: mapWeatherCondition(data.weather[0].main, data.weather[0].id),
        location: data.name || 'Bilinmeyen Konum',
        humidity: data.main.humidity,
        windSpeed: data.wind?.speed,
        description: data.weather[0].description
      };
    } catch (error) {
      console.error('Weather fetch error:', error);
      // Fallback to mock data based on location
      return {
        temp: 18,
        condition: "sunny",
        location: "İstanbul",
        description: "Güneşli"
      };
    }
  };

  const mapWeatherCondition = (main: string, id: number): string => {
    // Map OpenWeatherMap conditions to our internal conditions
    switch (main.toLowerCase()) {
      case 'clear':
        return 'sunny';
      case 'clouds':
        return 'cloudy';
      case 'rain':
      case 'drizzle':
        return 'rainy';
      case 'snow':
        return 'snowy';
      case 'thunderstorm':
        return 'stormy';
      case 'mist':
      case 'fog':
        return 'foggy';
      default:
        return 'sunny';
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <Sun className="h-10 w-10 text-white" />;
      case "cloudy":
        return <Cloud className="h-10 w-10 text-white" />;
      case "rainy":
        return <CloudRain className="h-10 w-10 text-white" />;
      case "snowy":
        return <CloudSnow className="h-10 w-10 text-white" />;
      case "stormy":
        return <CloudRain className="h-10 w-10 text-white" />;
      case "foggy":
        return <CloudDrizzle className="h-10 w-10 text-white" />;
      default:
        return <Sun className="h-10 w-10 text-white" />;
    }
  };

  const getWeatherText = (condition: string) => {
    switch (condition) {
      case "sunny":
        return "Güneşli";
      case "cloudy":
        return "Bulutlu";
      case "rainy":
        return "Yağmurlu";
      case "snowy":
        return "Karlı";
      case "stormy":
        return "Fırtınalı";
      case "foggy":
        return "Sisli";
      default:
        return "Güneşli";
    }
  };

  // Export weather data for other components to use
  (window as any).currentWeather = weather;

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-white border-0 shadow-lg rounded-3xl overflow-hidden">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm animate-pulse">
                <div className="h-10 w-10 bg-white/30 rounded"></div>
              </div>
              <div>
                <div className="h-8 w-16 bg-white/30 rounded mb-1 animate-pulse"></div>
                <div className="h-4 w-20 bg-white/20 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="text-right">
              <div className="h-5 w-24 bg-white/30 rounded mb-1 animate-pulse"></div>
              <div className="h-4 w-16 bg-white/20 rounded animate-pulse"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-white border-0 shadow-lg rounded-3xl overflow-hidden">
      <CardContent className="p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
              {getWeatherIcon(weather.condition)}
            </div>
            <div>
              <h3 className="text-4xl font-bold mb-1">{weather.temp}°C</h3>
              <p className="text-white/90 text-lg font-medium">{getWeatherText(weather.condition)}</p>
              {error && <p className="text-white/70 text-sm mt-1">{error}</p>}
            </div>
          </div>
          <div className="text-right">
            <p className="text-white font-semibold text-lg">{weather.location}</p>
            <p className="text-white/80 text-base">Bugün</p>
            {weather.humidity && (
              <p className="text-white/70 text-sm">Nem: %{weather.humidity}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
