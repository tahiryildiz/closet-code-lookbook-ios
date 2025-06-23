
import { useState } from "react";
import OutfitGenerator from "@/components/OutfitGenerator";

const Outfits = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Outfit Generator */}
        <OutfitGenerator />
      </div>
    </div>
  );
};

export default Outfits;
