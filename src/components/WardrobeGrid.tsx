
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WardrobeItem {
  id: string;
  name: string;
  category: string;
  primaryColor: string;
  brand?: string;
  tags: string[];
  image: string;
  notes?: string;
}

interface WardrobeGridProps {
  viewMode: 'grid' | 'list';
  searchQuery: string;
  selectedCategory: string;
}

// Beautiful clothing images from Unsplash
const mockItems: WardrobeItem[] = [
  {
    id: '1',
    name: 'Classic White Button-Down',
    category: 'tops',
    primaryColor: 'White',
    brand: 'Everlane',
    tags: ['professional', 'versatile', 'cotton'],
    image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=400&fit=crop',
    notes: 'Perfect for meetings and casual days'
  },
  {
    id: '2',
    name: 'High-Waisted Denim',
    category: 'bottoms',
    primaryColor: 'Blue',
    brand: 'Levi\'s',
    tags: ['casual', 'denim', 'high-waist'],
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop'
  },
  {
    id: '3',
    name: 'Silk Slip Dress',
    category: 'dresses',
    primaryColor: 'Black',
    brand: 'Reformation',
    tags: ['evening', 'silk', 'elegant'],
    image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=400&fit=crop'
  },
  {
    id: '4',
    name: 'Cashmere Sweater',
    category: 'tops',
    primaryColor: 'Beige',
    brand: 'COS',
    tags: ['cozy', 'luxury', 'cashmere'],
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
  },
  {
    id: '5',
    name: 'Tailored Blazer',
    category: 'outerwear',
    primaryColor: 'Navy',
    brand: 'Theory',
    tags: ['professional', 'structured', 'wool'],
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop'
  },
  {
    id: '6',
    name: 'Midi Skirt',
    category: 'bottoms',
    primaryColor: 'Camel',
    brand: 'Zara',
    tags: ['midi', 'versatile', 'work'],
    image: 'https://images.unsplash.com/photo-1583496661160-fb5886a13d14?w=400&h=400&fit=crop'
  },
  {
    id: '7',
    name: 'Leather Ankle Boots',
    category: 'shoes',
    primaryColor: 'Brown',
    brand: 'Acne Studios',
    tags: ['leather', 'ankle', 'autumn'],
    image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400&h=400&fit=crop'
  },
  {
    id: '8',
    name: 'Structured Handbag',
    category: 'accessories',
    primaryColor: 'Black',
    brand: 'Polene',
    tags: ['leather', 'structured', 'everyday'],
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop'
  }
];

const WardrobeGrid = ({ viewMode, searchQuery, selectedCategory }: WardrobeGridProps) => {
  const filteredItems = mockItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (filteredItems.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">👗</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
        <p className="text-gray-500">Try adjusting your search or add new items to your closet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {filteredItems.map((item) => (
        <Card
          key={item.id}
          className="bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden"
        >
          <CardContent className="p-0">
            <div className="aspect-square relative overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 flex space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 bg-white/90 hover:bg-white rounded-full shadow-sm"
                >
                  <Heart className="h-4 w-4 text-gray-600" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 bg-white/90 hover:bg-white rounded-full shadow-sm"
                >
                  <MoreHorizontal className="h-4 w-4 text-gray-600" />
                </Button>
              </div>
              <div className="absolute bottom-3 left-3">
                <Badge
                  variant="secondary"
                  className="bg-white/95 text-gray-700 text-xs font-medium rounded-full"
                >
                  {item.primaryColor}
                </Badge>
              </div>
            </div>
            <div className="p-4 space-y-2">
              <div>
                <h3 className="font-semibold text-gray-900 text-base leading-tight">{item.name}</h3>
                {item.brand && (
                  <p className="text-sm text-gray-500 font-medium">{item.brand}</p>
                )}
              </div>
              <div className="flex flex-wrap gap-1">
                {item.tags.slice(0, 2).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs border-gray-200 text-gray-600 bg-gray-50 rounded-full"
                  >
                    {tag}
                  </Badge>
                ))}
                {item.tags.length > 2 && (
                  <Badge
                    variant="outline"
                    className="text-xs border-gray-200 text-gray-500 bg-gray-50 rounded-full"
                  >
                    +{item.tags.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default WardrobeGrid;
