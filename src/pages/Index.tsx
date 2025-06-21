
import { useState } from "react";
import { Plus, Settings, TrendingUp, Calendar, Sun, CloudRain, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import AddItemModal from "@/components/AddItemModal";

const Index = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock data for carousels
  const recentItems = [
    { id: 1, name: "Beyaz Gömlek", image: "/placeholder.svg" },
    { id: 2, name: "Siyah Pantolon", image: "/placeholder.svg" },
    { id: 3, name: "Mavi Ceket", image: "/placeholder.svg" },
    { id: 4, name: "Kırmızı Elbise", image: "/placeholder.svg" },
  ];

  const mostWornItems = [
    { id: 1, name: "Kot Pantolon", image: "/placeholder.svg", wearCount: 12 },
    { id: 2, name: "Beyaz Tişört", image: "/placeholder.svg", wearCount: 15 },
    { id: 3, name: "Siyah Ayakkabı", image: "/placeholder.svg", wearCount: 8 },
    { id: 4, name: "Kahve Çanta", image: "/placeholder.svg", wearCount: 10 },
  ];

  const weatherOutfits = [
    { id: 1, name: "Hafif Kombin", items: ["Beyaz Tişört", "Kot Pantolon"] },
    { id: 2, name: "Rahat Stil", items: ["Polo Tişört", "Şort"] },
    { id: 3, name: "Şık Görünüm", items: ["Gömlek", "Kumaş Pantolon"] },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* iOS-style Status Bar */}
      <div className="h-11 bg-white"></div>
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-black tracking-tight">StyleSpace</h1>
              <p className="text-base text-gray-600 font-medium">Kişisel Gardırobun</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <Settings className="h-5 w-5 text-gray-700" />
              </Button>
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-500 hover:bg-blue-600 rounded-full h-12 w-12 p-0 shadow-lg"
              >
                <Plus className="h-6 w-6 text-white" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Weather Card */}
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 border-0 shadow-lg rounded-2xl text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Bugünün Havası</h3>
                <p className="text-blue-100">Hafif katmanlar için mükemmel</p>
                <div className="flex items-center mt-2">
                  <Sun className="h-5 w-5 mr-2" />
                  <span className="text-2xl font-bold">22°C</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-blue-100">Güneşli</div>
                <div className="text-xs text-blue-200">İstanbul, TR</div>
              </div>
            </div>
          </CardContent>
        </Card>

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

        {/* Son Eklenenler */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Son Eklenenler</h2>
            <Button variant="ghost" className="text-blue-600 hover:text-blue-700 p-0">
              <span className="text-sm font-medium">Hepsini Gör</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <Carousel className="w-full">
            <CarouselContent>
              {recentItems.map((item) => (
                <CarouselItem key={item.id} className="basis-1/3">
                  <Card className="bg-white border-0 shadow-sm rounded-xl">
                    <CardContent className="p-3">
                      <div className="aspect-square bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                        <span className="text-xs text-gray-500">Fotoğraf</span>
                      </div>
                      <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
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
            <Button variant="ghost" className="text-blue-600 hover:text-blue-700 p-0">
              <span className="text-sm font-medium">Hepsini Gör</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <Carousel className="w-full">
            <CarouselContent>
              {mostWornItems.map((item) => (
                <CarouselItem key={item.id} className="basis-1/3">
                  <Card className="bg-white border-0 shadow-sm rounded-xl">
                    <CardContent className="p-3">
                      <div className="aspect-square bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                        <span className="text-xs text-gray-500">Fotoğraf</span>
                      </div>
                      <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                      <p className="text-xs text-gray-500">{item.wearCount} kez giyildi</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        {/* Bugünün havası için şahane gider */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Bugünün havası için şahane gider</h2>
          <Carousel className="w-full">
            <CarouselContent>
              {weatherOutfits.map((outfit) => (
                <CarouselItem key={outfit.id} className="basis-4/5">
                  <Card className="bg-white border-0 shadow-sm rounded-xl">
                    <CardContent className="p-4">
                      <div className="aspect-[4/3] bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                        <span className="text-sm text-gray-500">Kombin Önizlemesi</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">{outfit.name}</h4>
                      <p className="text-sm text-gray-600">{outfit.items.join(", ")}</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        {/* Günün Önerisi */}
        <Card className="bg-white border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Günün Önerisi</h3>
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <div className="aspect-[4/3] bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                <span className="text-gray-500">Kombin Önizlemesi</span>
              </div>
              <h4 className="font-semibold text-gray-900">Akıllı Günlük Görünüm</h4>
              <p className="text-sm text-gray-600 mt-1">Bugünün havası ve programın için mükemmel</p>
            </div>
            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl">
              Bu Kombini Dene
            </Button>
          </CardContent>
        </Card>

        {/* Son Aktiviteler */}
        <Card className="bg-white border-0 shadow-sm rounded-2xl">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Son Aktiviteler</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Yeni beyaz gömlek eklendi</span>
                <span className="text-xs text-gray-400 ml-auto">2s önce</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">"Ofis Toplantısı" kombini oluşturuldu</span>
                <span className="text-xs text-gray-400 ml-auto">1g önce</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Günlük blazer favorilere eklendi</span>
                <span className="text-xs text-gray-400 ml-auto">2g önce</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Item Modal */}
      <AddItemModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
};

export default Index;
