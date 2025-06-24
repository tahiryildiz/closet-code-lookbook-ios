
import { useState } from "react";
import OutfitGenerator from "@/components/OutfitGenerator";

const Outfits = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 pt-14 pb-6">
          <div className="text-left">
            <h1 className="text-2xl font-bold text-gray-900">Kombinler</h1>
            <p className="text-gray-500 text-base mt-1">AI destekli kombin önerileri</p>
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
