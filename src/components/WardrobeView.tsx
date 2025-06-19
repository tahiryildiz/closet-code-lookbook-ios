
import { useState } from "react";
import { Search, Filter, Grid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import WardrobeGrid from "./WardrobeGrid";
import CategoryFilter from "./CategoryFilter";

const WardrobeView = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-6">
      {/* Search and Controls */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search your wardrobe..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/80 backdrop-blur-sm border-rose-200 focus:border-rose-400 rounded-xl"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="bg-white/60 backdrop-blur-sm border-rose-200 hover:bg-rose-50 rounded-xl"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          
          <div className="flex space-x-1 bg-white/60 backdrop-blur-sm rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-rose-500 hover:bg-rose-600' : ''}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-rose-500 hover:bg-rose-600' : ''}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      {showFilters && (
        <Card className="bg-white/60 backdrop-blur-sm border-rose-200">
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
        viewMode={viewMode}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
      />
    </div>
  );
};

export default WardrobeView;
