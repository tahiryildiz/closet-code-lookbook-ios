
import { useState } from "react";
import { Wand2, Clock, MapPin, Thermometer, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import OutfitCard from "./OutfitCard";
import { supabase } from "@/integrations/supabase/client";

const OutfitGenerator = () => {
  const [occasion, setOccasion] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('');
  const [weather, setWeather] = useState('');
  const [generatedOutfits, setGeneratedOutfits] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateOutfits = async () => {
    if (!occasion || !timeOfDay || !weather) return;
    
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-outfits', {
        body: { occasion, timeOfDay, weather }
      });

      if (error) throw error;

      setGeneratedOutfits(data.outfits || []);
    } catch (error) {
      console.error('Error generating outfits:', error);
      // Fallback to mock data if API fails
      const mockOutfits = [
        {
          id: 1,
          name: "Profesyonel Şık",
          items: ["Lacivert Blazer", "Beyaz Pamuklu Gömlek", "Siyah Dar Pantolon"],
          confidence: 95,
          styling_tips: "Daha rahat bir profesyonel görünüm için kolları kıvırın"
        },
        {
          id: 2,
          name: "Akıllı Günlük",
          items: ["Beyaz Pamuklu Gömlek", "Siyah Dar Pantolon", "Kahverengi Deri Ayakkabı"],
          confidence: 88,
          styling_tips: "Gömleği pantolona sok ve kemer ekle"
        },
        {
          id: 3,
          name: "Akşam Zarafeti",
          items: ["Kırmızı İpek Elbise", "Siyah Topuklu", "Altın Aksesuarlar"],
          confidence: 92,
          styling_tips: "Akşam yemekleri ve özel etkinlikler için mükemmel"
        }
      ];
      setGeneratedOutfits(mockOutfits);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Outfit Parameters */}
      <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wand2 className="h-5 w-5 text-blue-500" />
            <span>Mükemmel Kombinini Oluştur</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                Durum
              </label>
              <Select value={occasion} onValueChange={setOccasion}>
                <SelectTrigger className="bg-white/80 border-blue-200">
                  <SelectValue placeholder="Durum seçin" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-sm">
                  <SelectItem value="office">Ofis/İş</SelectItem>
                  <SelectItem value="meeting">İş Toplantısı</SelectItem>
                  <SelectItem value="casual">Günlük Gezinti</SelectItem>
                  <SelectItem value="date">Romantik Akşam</SelectItem>
                  <SelectItem value="party">Parti/Etkinlik</SelectItem>
                  <SelectItem value="workout">Spor/Jimnastik</SelectItem>
                  <SelectItem value="travel">Seyahat</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Zaman
              </label>
              <Select value={timeOfDay} onValueChange={setTimeOfDay}>
                <SelectTrigger className="bg-white/80 border-blue-200">
                  <SelectValue placeholder="Zaman seçin" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-sm">
                  <SelectItem value="morning">Sabah</SelectItem>
                  <SelectItem value="afternoon">Öğleden Sonra</SelectItem>
                  <SelectItem value="evening">Akşam</SelectItem>
                  <SelectItem value="night">Gece</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Thermometer className="h-4 w-4 mr-1" />
                Hava Durumu
              </label>
              <Select value={weather} onValueChange={setWeather}>
                <SelectTrigger className="bg-white/80 border-blue-200">
                  <SelectValue placeholder="Hava durumu seçin" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-sm">
                  <SelectItem value="sunny">Güneşli/Sıcak</SelectItem>
                  <SelectItem value="cool">Serin/Ilık</SelectItem>
                  <SelectItem value="cold">Soğuk</SelectItem>
                  <SelectItem value="rainy">Yağmurlu</SelectItem>
                  <SelectItem value="windy">Rüzgarlı</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={generateOutfits}
            disabled={!occasion || !timeOfDay || !weather || isGenerating}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
          >
            {isGenerating ? (
              <>
                <Shuffle className="h-4 w-4 mr-2 animate-spin" />
                Kombinler Oluşturuluyor...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                3 Kombin Önerisi Oluştur
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Outfits */}
      {generatedOutfits.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Kombin Önerileriniz</h2>
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
