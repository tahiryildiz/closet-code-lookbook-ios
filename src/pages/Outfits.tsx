
import { useState } from "react";
import { Sparkles, TrendingUp, Calendar, Heart, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import OutfitGenerator from "@/components/OutfitGenerator";

const Outfits = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header with professional design */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white">
        <div className="px-6 pt-12 pb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-medium">Kombinler</h1>
              <p className="text-white/80 text-base mt-1">AI destekli stil önerileri</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 border border-white/20">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-white border-0 shadow-sm rounded-2xl">
            <CardContent className="p-4 text-center">
              <div className="bg-blue-100 p-2 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-xl font-bold text-gray-900">23</div>
              <div className="text-xs text-gray-600">Oluşturulan</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-0 shadow-sm rounded-2xl">
            <CardContent className="p-4 text-center">
              <div className="bg-purple-100 p-2 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2">
                <Heart className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-xl font-bold text-gray-900">12</div>
              <div className="text-xs text-gray-600">Favoriler</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-0 shadow-sm rounded-2xl">
            <CardContent className="p-4 text-center">
              <div className="bg-green-100 p-2 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-xl font-bold text-gray-900">7</div>
              <div className="text-xs text-gray-600">Bu Hafta</div>
            </CardContent>
          </Card>
        </div>

        {/* AI Outfit Generator Button */}
        <Button className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-4 rounded-2xl text-base">
          <Sparkles className="h-5 w-5 mr-2" />
          Yeni AI Kombin Oluştur
        </Button>

        {/* Outfit Generator */}
        <OutfitGenerator />
      </div>
    </div>
  );
};

export default Outfits;
