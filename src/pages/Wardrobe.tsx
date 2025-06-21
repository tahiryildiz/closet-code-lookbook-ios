
import { useState } from "react";
import { Plus, Search, Filter, Grid, List, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import WardrobeGrid from "@/components/WardrobeGrid";
import CategoryFilter from "@/components/CategoryFilter";
import AddItemModal from "@/components/AddItemModal";

const Wardrobe = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header with professional design */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white">
        <div className="px-6 pt-12 pb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-medium">Gardrobum</h1>
              <p className="text-white/80 text-base mt-1">Gardırobunu düzenle ve yönet</p>
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-white/20 hover:bg-white/30 rounded-full h-12 w-12 p-0 backdrop-blur-sm border border-white/20"
            >
              <Plus className="h-6 w-6 text-white" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Search and Controls */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Gardırobunu ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-gray-200 focus:border-blue-400 rounded-2xl text-base py-3"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white border-gray-200 hover:bg-gray-50 rounded-2xl py-3 px-4 font-semibold"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtreler
            </Button>
            
            <div className="flex space-x-1 bg-white rounded-2xl p-1 border border-gray-200">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={`rounded-xl ${viewMode === 'grid' ? 'bg-blue-900 hover:bg-blue-800 text-white' : 'hover:bg-gray-100'}`}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={`rounded-xl ${viewMode === 'list' ? 'bg-blue-900 hover:bg-blue-800 text-white' : 'hover:bg-gray-100'}`}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        {showFilters && (
          <Card className="bg-white border-0 shadow-sm rounded-2xl">
            <CardContent className="p-4">
              <CategoryFilter
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-white border-0 shadow-sm rounded-2xl">
            <CardContent className="p-4 text-center">
              <div className="text-xl font-bold text-blue-600">127</div>
              <div className="text-xs text-gray-600">Toplam Ürün</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-0 shadow-sm rounded-2xl">
            <CardContent className="p-4 text-center">
              <div className="text-xl font-bold text-purple-600">8</div>
              <div className="text-xs text-gray-600">Kategori</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-0 shadow-sm rounded-2xl">
            <CardContent className="p-4 text-center">
              <div className="text-xl font-bold text-green-600">45</div>
              <div className="text-xs text-gray-600">Bu Ay Giyilen</div>
            </CardContent>
          </Card>
        </div>

        {/* Wardrobe Grid */}
        <WardrobeGrid
          viewMode={viewMode}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
        />
      </div>

      {/* Add Item Modal */}
      <AddItemModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
};

export default Wardrobe;
