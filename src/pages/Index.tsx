
import { useState } from "react";
import { Camera, Sparkles, Shirt, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import WardrobeView from "@/components/WardrobeView";
import OutfitGenerator from "@/components/OutfitGenerator";
import AddItemModal from "@/components/AddItemModal";

const Index = () => {
  const [activeTab, setActiveTab] = useState<'wardrobe' | 'outfits'>('wardrobe');
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-rose-100 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">StyleSpace</h1>
              <p className="text-sm text-gray-600">Your AI Style Assistant</p>
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 rounded-full h-12 w-12 p-0"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-6 py-4">
        <div className="flex space-x-1 bg-white/60 backdrop-blur-sm rounded-full p-1 border border-rose-100">
          <button
            onClick={() => setActiveTab('wardrobe')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-full font-medium transition-all duration-300 ${
              activeTab === 'wardrobe'
                ? 'bg-white text-rose-600 shadow-sm'
                : 'text-gray-600 hover:text-rose-500'
            }`}
          >
            <Shirt className="h-4 w-4" />
            <span>My Wardrobe</span>
          </button>
          <button
            onClick={() => setActiveTab('outfits')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-full font-medium transition-all duration-300 ${
              activeTab === 'outfits'
                ? 'bg-white text-rose-600 shadow-sm'
                : 'text-gray-600 hover:text-rose-500'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>Outfit Ideas</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-6">
        {activeTab === 'wardrobe' ? <WardrobeView /> : <OutfitGenerator />}
      </div>

      {/* Add Item Modal */}
      <AddItemModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
};

export default Index;
