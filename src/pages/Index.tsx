
import { useState } from "react";
import { Plus, Settings, TrendingUp, Calendar, Sun, CloudRain, ChevronRight, Zap, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import AddItemModal from "@/components/AddItemModal";

const Index = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock data for carousels
  const recentItems = [
    { id: 1, name: "Beyaz Gömlek", image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=400&fit=crop", category: "Üstler" },
    { id: 2, name: "Siyah Pantolon", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop", category: "Altlar" },
    { id: 3, name: "Mavi Ceket", image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop", category: "Dış Giyim" },
    { id: 4, name: "Kahve Ayakkabı", image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400&h=400&fit=crop", category: "Ayakkabılar" },
  ];

  const mostWornItems = [
    { id: 1, name: "Beyaz Spor Ayakkabı", image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop", wearCount: "23×", category: "Ayakkabılar" },
    { id: 2, name: "Siyah Tişört", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop", wearCount: "18×", category: "Üstler" },
    { id: 3, name: "Mavi Kot", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop", wearCount: "15×", category: "Altlar" },
  ];

  const weatherOutfits = [
    { 
      id: 1, 
      name: "Hafif Sweater", 
      category: "Üstler",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop"
    },
    { 
      id: 2, 
      name: "Chino Pantolon", 
      category: "Altlar",
      image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop"
    },
    { 
      id: 3, 
      name: "Hafif Ceket", 
      category: "Dış Giyim",
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop"
    },
    { 
      id: 4, 
      name: "Loafer", 
      category: "Ayakkabılar",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header with dark blue background */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white">
        <div className="px-6 pt-12 pb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-medium">Günaydın</h1>
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full text-white/80 hover:text-white hover:bg-white/10"
              >
                <Settings className="h-5 w-5" />
              </Button>
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-white/20 hover:bg-white/30 rounded-full h-10 w-10 p-0 backdrop-blur-sm border border-white/20"
              >
                <Plus className="h-5 w-5 text-white" />
              </Button>
            </div>
          </div>
          
          <p className="text-white/80 text-base mb-6">Bugün ne giymek istiyorsun?</p>
          
          {/* Weather Card */}
          <Card className="bg-white/15 backdrop-blur-sm border-white/20 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Sun className="h-8 w-8 text-yellow-300" />
                  <div>
                    <div className="text-sm text-white/80">Bugün</div>
                    <div className="font-medium">Güneşli</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-light">22°C</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-8">
        {/* Bugünün havası için şahane gider */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Bugünün havası için şahane gider</h2>
          <Carousel className="w-full">
            <CarouselContent>
              {weatherOutfits.map((item) => (
                <CarouselItem key={item.id} className="basis-[35%]">
                  <Card className="bg-white border-0 shadow-sm rounded-2xl overflow-hidden">
                    <CardContent className="p-0">
                      <div className="aspect-square bg-gray-100">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <h4 className="font-medium text-gray-900 text-sm truncate">{item.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">{item.category}</p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        {/* Generate AI Outfit Button */}
        <Button className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-4 rounded-2xl text-base">
          <Zap className="h-5 w-5 mr-2" />
          AI Kombin Oluştur
        </Button>

        {/* Style Tip of the Day */}
        <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-pink-100 p-3 rounded-full">
                <Lightbulb className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Günün Stil İpucu</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Katmanlama, geçiş mevsimlerinde çok önemlidir. Hafif bir süveter ile üstüne çıkarabilir 
                  veya hava ısınırsa çıkarabilirsiniz.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Son Eklenenler */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Son Eklenenler</h2>
            <Button variant="ghost" className="text-blue-600 hover:text-blue-700 p-0 text-sm">
              Hepsini Gör
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <Carousel className="w-full">
            <CarouselContent>
              {recentItems.map((item) => (
                <CarouselItem key={item.id} className="basis-[35%]">
                  <Card className="bg-white border-0 shadow-sm rounded-2xl overflow-hidden">
                    <CardContent className="p-0">
                      <div className="aspect-square bg-gray-100">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <h4 className="font-medium text-gray-900 text-sm truncate">{item.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">{item.category}</p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        {/* En Çok Giydiklerin */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">En Çok Giydiklerin</h2>
            <Button variant="ghost" className="text-blue-600 hover:text-blue-700 p-0 text-sm">
              Hepsini Gör
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <Carousel className="w-full">
            <CarouselContent>
              {mostWornItems.map((item) => (
                <CarouselItem key={item.id} className="basis-[35%]">
                  <Card className="bg-white border-0 shadow-sm rounded-2xl overflow-hidden relative">
                    <CardContent className="p-0">
                      <div className="aspect-square bg-gray-100 relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <div className="bg-blue-900 text-white text-xs font-medium px-2 py-1 rounded-full">
                            {item.wearCount}
                          </div>
                        </div>
                      </div>
                      <div className="p-3">
                        <h4 className="font-medium text-gray-900 text-sm truncate">{item.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">{item.category}</p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white border-0 shadow-sm rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">23</div>
                  <div className="text-sm text-gray-600">Kombin Oluşturuldu</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-0 shadow-sm rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">7</div>
                  <div className="text-sm text-gray-600">Gün Üst Üste</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Item Modal */}
      <AddItemModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
};

export default Index;
