
import { useState } from "react";
import { Wand2, Clock, MapPin, Thermometer, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import OutfitCard from "./OutfitCard";

const OutfitGenerator = () => {
  const [occasion, setOccasion] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('');
  const [weather, setWeather] = useState('');
  const [generatedOutfits, setGeneratedOutfits] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateOutfits = async () => {
    if (!occasion || !timeOfDay || !weather) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const mockOutfits = [
        {
          id: 1,
          name: "Professional Chic",
          items: ["Navy Blazer", "White Cotton Shirt", "Black Slim Jeans"],
          confidence: 95,
          styling_tips: "Roll up sleeves for a more relaxed professional look"
        },
        {
          id: 2,
          name: "Smart Casual",
          items: ["White Cotton Shirt", "Black Slim Jeans", "Brown Leather Shoes"],
          confidence: 88,
          styling_tips: "Tuck in the shirt and add a belt for a polished finish"
        },
        {
          id: 3,
          name: "Evening Elegance",
          items: ["Red Silk Dress", "Black Heels", "Gold Accessories"],
          confidence: 92,
          styling_tips: "Perfect for dinner dates or evening events"
        }
      ];
      setGeneratedOutfits(mockOutfits);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Outfit Parameters */}
      <Card className="bg-white/80 backdrop-blur-sm border-rose-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wand2 className="h-5 w-5 text-rose-500" />
            <span>Generate Your Perfect Outfit</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                Occasion
              </label>
              <Select value={occasion} onValueChange={setOccasion}>
                <SelectTrigger className="bg-white/80 border-rose-200">
                  <SelectValue placeholder="Select occasion" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-sm">
                  <SelectItem value="office">Office/Work</SelectItem>
                  <SelectItem value="meeting">Business Meeting</SelectItem>
                  <SelectItem value="casual">Casual Day Out</SelectItem>
                  <SelectItem value="date">Date Night</SelectItem>
                  <SelectItem value="party">Party/Event</SelectItem>
                  <SelectItem value="workout">Workout/Gym</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Time of Day
              </label>
              <Select value={timeOfDay} onValueChange={setTimeOfDay}>
                <SelectTrigger className="bg-white/80 border-rose-200">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-sm">
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="afternoon">Afternoon</SelectItem>
                  <SelectItem value="evening">Evening</SelectItem>
                  <SelectItem value="night">Night</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Thermometer className="h-4 w-4 mr-1" />
                Weather
              </label>
              <Select value={weather} onValueChange={setWeather}>
                <SelectTrigger className="bg-white/80 border-rose-200">
                  <SelectValue placeholder="Select weather" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-sm">
                  <SelectItem value="sunny">Sunny/Warm</SelectItem>
                  <SelectItem value="cool">Cool/Mild</SelectItem>
                  <SelectItem value="cold">Cold</SelectItem>
                  <SelectItem value="rainy">Rainy</SelectItem>
                  <SelectItem value="windy">Windy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={generateOutfits}
            disabled={!occasion || !timeOfDay || !weather || isGenerating}
            className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white"
          >
            {isGenerating ? (
              <>
                <Shuffle className="h-4 w-4 mr-2 animate-spin" />
                Generating Outfits...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Generate 3 Outfit Ideas
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Outfits */}
      {generatedOutfits.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Your Outfit Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {generatedOutfits.map((outfit) => (
              <OutfitCard key={outfit.id} outfit={outfit} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OutfitGenerator;
