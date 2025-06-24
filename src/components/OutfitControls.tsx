import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wand2, RefreshCw, Briefcase, Utensils, Heart, ShoppingBag, Coffee, Music, Home } from "lucide-react";
interface OutfitControlsProps {
  occasion: string;
  setOccasion: (value: string) => void;
  timeOfDay: string;
  setTimeOfDay: (value: string) => void;
  weather: string;
  setWeather: (value: string) => void;
  onGenerate: () => void;
  loading: boolean;
  remainingOutfits: number;
  isPremium: boolean;
}
const OutfitControls = ({
  occasion,
  setOccasion,
  timeOfDay,
  setTimeOfDay,
  weather,
  setWeather,
  onGenerate,
  loading,
  remainingOutfits,
  isPremium
}: OutfitControlsProps) => {
  const occasions = [{
    id: "work",
    label: "İş",
    icon: Briefcase
  }, {
    id: "dinner",
    label: "Yemek",
    icon: Utensils
  }, {
    id: "date",
    label: "Randevu",
    icon: Heart
  }, {
    id: "shopping",
    label: "Alışveriş",
    icon: ShoppingBag
  }, {
    id: "coffee",
    label: "Kahve",
    icon: Coffee
  }, {
    id: "party",
    label: "Parti",
    icon: Music
  }, {
    id: "casual",
    label: "Günlük",
    icon: Home
  }];
  return <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm rounded-2xl">
      <CardContent className="p-4 md:p-6 space-y-4 md:space-y-6 px-[2px]">
        {!isPremium && <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
            <p className="text-blue-700 text-sm font-medium">
              Kalan kombin hakkı: {Math.max(0, remainingOutfits)}
            </p>
          </div>}

        {/* Nerede Giyeceksin? - Responsive grid */}
        <div className="space-y-3">
          <h3 className="text-base md:text-lg font-semibold text-gray-900">Nerede Giyeceksin?</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 md:gap-3">
            {occasions.map(occ => {
            const IconComponent = occ.icon;
            return <button key={occ.id} onClick={() => setOccasion(occ.id)} className={`p-3 md:p-4 rounded-2xl border-2 transition-all ${occasion === occ.id ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}>
                  <IconComponent className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-1 md:mb-2" />
                  <span className="text-xs md:text-sm font-medium block">{occ.label}</span>
                </button>;
          })}
          </div>
        </div>

        {/* Time and Weather - Responsive layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Zaman</label>
            <Select value={timeOfDay} onValueChange={setTimeOfDay}>
              <SelectTrigger className="w-full bg-white border-2 border-gray-200 rounded-2xl h-11 md:h-12 font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Sabah</SelectItem>
                <SelectItem value="day">Gündüz</SelectItem>
                <SelectItem value="evening">Akşam</SelectItem>
                <SelectItem value="night">Gece</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Hava Durumu</label>
            <Select value={weather} onValueChange={setWeather}>
              <SelectTrigger className="w-full bg-white border-2 border-gray-200 rounded-2xl h-11 md:h-12 font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hot">Sıcak</SelectItem>
                <SelectItem value="warm">Ilık</SelectItem>
                <SelectItem value="mild">Orta</SelectItem>
                <SelectItem value="cool">Serin</SelectItem>
                <SelectItem value="cold">Soğuk</SelectItem>
                <SelectItem value="rainy">Yağmurlu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={onGenerate} disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 md:py-4 rounded-xl transition-all duration-200 text-base md:text-lg">
          {loading ? <>
              <RefreshCw className="h-4 md:h-5 w-4 md:w-5 mr-2 animate-spin" />
              Oluşturuluyor...
            </> : <>
              <Wand2 className="h-4 md:h-5 w-4 md:w-5 mr-2" />
              Kombin Oluştur
            </>}
        </Button>
      </CardContent>
    </Card>;
};
export default OutfitControls;