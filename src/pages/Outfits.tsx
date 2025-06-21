
import OutfitGenerator from "@/components/OutfitGenerator";

const Outfits = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-black">Kombinler</h1>
          <p className="text-base text-gray-600 font-medium">AI destekli stil önerileri</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        <OutfitGenerator />
      </div>
    </div>
  );
};

export default Outfits;
