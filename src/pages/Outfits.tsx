
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
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
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Outfit Generator */}
        <OutfitGenerator />

        {/* AI Outfit Generator Button at bottom */}
        <div className="fixed bottom-24 left-4 right-4">
          <Button className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-4 rounded-2xl text-base shadow-lg">
            <Sparkles className="h-5 w-5 mr-2" />
            Yeni AI Kombin Oluştur
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Outfits;
