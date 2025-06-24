
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
    <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-xl rounded-2xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {getWeatherIcon(weather.condition)}
            <div>
              <h3 className="text-3xl font-bold">{weather.temp}°C</h3>
              <p className="text-white/90 text-base">{getWeatherText(weather.condition)}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white/90 text-base font-medium">{weather.location}</p>
            <p className="text-white/70 text-sm">Bugün</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
