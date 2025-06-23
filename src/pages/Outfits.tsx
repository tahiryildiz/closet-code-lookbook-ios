
import { useState } from "react";
import OutfitGenerator from "@/components/OutfitGenerator";

const Outfits = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white">
        <div className="px-6 pt-12 pb-8">
          <div className="text-left">
            <h1 className="text-2xl font-medium">Kombinler</h1>
            <p className="text-white/80 text-base mt-1">AI destekli kombin önerileri</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Outfit Generator */}
        <OutfitGenerator />
      </div>
    </div>
  );
};

export default Outfits;
