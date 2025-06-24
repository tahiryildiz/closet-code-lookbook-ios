
import { useState } from "react";
import OutfitGenerator from "@/components/OutfitGenerator";

const Outfits = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header - Responsive padding */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 pt-14 pb-4">
          <div className="text-left">
            <h1 className="text-xl font-bold text-gray-900">Kombinler</h1>
            <p className="text-gray-500 text-sm mt-1">AI destekli kombin önerileri</p>
          </div>
        </div>
      </div>

      {/* Content - Consistent mobile-first spacing */}
      <div className="px-4 py-4">
        <OutfitGenerator />
      </div>
    </div>
  );
};

export default Outfits;
