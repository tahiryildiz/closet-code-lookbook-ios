
import { useState } from "react";
import { Camera, Sparkles, Shirt, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import WardrobeView from "@/components/WardrobeView";
import OutfitGenerator from "@/components/OutfitGenerator";
import AddItemModal from "@/components/AddItemModal";

const Index = () => {
  const [activeTab, setActiveTab] = useState<'wardrobe' | 'outfits'>('wardrobe');
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* iOS-style Status Bar */}
      <div className="h-11 bg-white"></div>
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-11 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-black tracking-tight">StyleSpace</h1>
              <p className="text-base text-gray-600 font-medium">Your Personal Closet</p>
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

      {/* iOS-style Tab Navigation */}
      <div className="px-4 py-3 bg-white">
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setActiveTab('wardrobe')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold text-base transition-all duration-200 ${
              activeTab === 'wardrobe'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600'
            }`}
          >
            <Shirt className="h-5 w-5" />
            <span>My Closet</span>
          </button>
          <button
            onClick={() => setActiveTab('outfits')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold text-base transition-all duration-200 ${
              activeTab === 'outfits'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600'
            }`}
          >
            <Sparkles className="h-5 w-5" />
            <span>Outfits</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-6">
        {activeTab === 'wardrobe' ? <WardrobeView /> : <OutfitGenerator />}
      </div>

      {/* Add Item Modal */}
      <AddItemModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
};

export default Index;
