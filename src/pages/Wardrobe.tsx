
import { useState, useEffect } from "react";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import WardrobeGrid from "@/components/WardrobeGrid";
import CategoryFilter from "@/components/CategoryFilter";
import AddItemModal from "@/components/AddItemModal";
import { useLocation } from "react-router-dom";

const Wardrobe = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    if (location.state?.showFavorites) {
      setShowFavoritesOnly(true);
    }
  }, [location.state]);

  const handleModalClose = () => {
    setShowAddModal(false);
    setRefreshTrigger(prev => prev + 1);
  };

  const pageTitle = showFavoritesOnly ? "Favorilerim" : "Gardrobum";
  const pageDescription = showFavoritesOnly ? "Favori ürünlerinizi görüntüleyin" : "Gardırobunu düzenle ve yönet";

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header with responsive design */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 md:px-6 pt-14 pb-4 md:pb-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="text-left">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">{pageTitle}</h1>
              <p className="text-gray-500 text-sm md:text-base mt-1">{pageDescription}</p>
            </div>
            {!showFavoritesOnly && (
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-500 hover:bg-blue-600 rounded-full h-10 w-10 md:h-12 md:w-12 p-0 shadow-lg"
              >
                <Plus className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content with mobile-first spacing */}
      <div className="px-4 py-4 md:py-6 space-y-4 md:space-y-6">
        {/* Search and Filters - Responsive layout */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={showFavoritesOnly ? "Favorilerinizi ara..." : "Gardırobunu ara..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-gray-300 focus:border-blue-500 rounded-xl text-base py-3"
            />
          </div>
          
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="bg-white border-gray-300 hover:bg-gray-50 rounded-xl py-3 px-4 font-semibold w-full sm:w-auto"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtreler
          </Button>
        </div>

        {/* Category Filter */}
        {showFilters && (
          <Card className="bg-white border-gray-200 shadow-sm rounded-xl">
            <CardContent className="p-4">
              <CategoryFilter
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </CardContent>
          </Card>
        )}

        {/* Wardrobe Grid */}
        <WardrobeGrid
          viewMode="grid"
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          refreshTrigger={refreshTrigger}
          showFavoritesOnly={showFavoritesOnly}
        />
      </div>

      {/* Add Item Modal */}
      {!showFavoritesOnly && (
        <AddItemModal isOpen={showAddModal} onClose={handleModalClose} />
      )}
    </div>
  );
};

export default Wardrobe;
