
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Cloud, Sun, CloudRain, Snowflake, Wind } from "lucide-react";

const WeatherCard = () => {
  const [weather, setWeather] = useState({
    temp: 18,
    condition: "sunny",
    location: "İstanbul"
  });

  // Mock weather data - you can integrate with a real weather API later
  useEffect(() => {
    // Simulate weather data
    const conditions = ["sunny", "cloudy", "rainy", "snowy"];
    const temps = [15, 18, 22, 25];
    
    setWeather({
      temp: temps[Math.floor(Math.random() * temps.length)],
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      location: "İstanbul"
    });
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <Sun className="h-10 w-10 text-white" />;
      case "cloudy":
        return <Cloud className="h-10 w-10 text-white" />;
      case "rainy":
        return <CloudRain className="h-10 w-10 text-white" />;
      case "snowy":
        return <Snowflake className="h-10 w-10 text-white" />;
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
      default:
        return "Güneşli";
    }
  };

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
            </div>
          </div>
          <div className="text-right">
            <p className="text-white font-semibold text-lg">{weather.location}</p>
            <p className="text-white/80 text-base">Bugün</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
