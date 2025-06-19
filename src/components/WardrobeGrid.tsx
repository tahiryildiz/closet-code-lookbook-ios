
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

// Mock data - in real app this would come from state/database
const mockItems: WardrobeItem[] = [
  {
    id: '1',
    name: 'Navy Blazer',
    category: 'outerwear',
    primaryColor: 'Navy',
    brand: 'Hugo Boss',
    tags: ['formal', 'business', 'versatile'],
    image: '/placeholder.svg',
    notes: 'Perfect for business meetings'
  },
  {
    id: '2',
    name: 'White Cotton Shirt',
    category: 'tops',
    primaryColor: 'White',
    brand: 'Uniqlo',
    tags: ['casual', 'basic', 'cotton'],
    image: '/placeholder.svg'
  },
  {
    id: '3',
    name: 'Black Slim Jeans',
    category: 'bottoms',
    primaryColor: 'Black',
    brand: 'Levi\'s',
    tags: ['casual', 'denim', 'slim-fit'],
    image: '/placeholder.svg'
  },
  {
    id: '4',
    name: 'Red Silk Dress',
    category: 'dresses',
    primaryColor: 'Red',
    brand: 'Zara',
    tags: ['formal', 'evening', 'silk'],
    image: '/placeholder.svg'
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
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">👗</div>
        <p className="text-gray-500">No items found</p>
        <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-4' : 'space-y-4'}>
      {filteredItems.map((item) => (
        <Card
          key={item.id}
          className="bg-white/80 backdrop-blur-sm border-rose-200 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
        >
          <CardContent className="p-0">
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-4xl">
                {item.category === 'tops' && '👕'}
                {item.category === 'bottoms' && '👖'}
                {item.category === 'dresses' && '👗'}
                {item.category === 'outerwear' && '🧥'}
                {item.category === 'shoes' && '👠'}
                {item.category === 'accessories' && '👜'}
              </div>
              <div className="absolute top-2 right-2">
                <Badge
                  variant="secondary"
                  className="bg-white/90 text-xs"
                >
                  {item.primaryColor}
                </Badge>
              </div>
            </div>
            <div className="p-3 space-y-2">
              <div>
                <h3 className="font-medium text-gray-900 text-sm">{item.name}</h3>
                {item.brand && (
                  <p className="text-xs text-gray-500">{item.brand}</p>
                )}
              </div>
              <div className="flex flex-wrap gap-1">
                {item.tags.slice(0, 2).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs border-rose-200 text-rose-600"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default WardrobeGrid;
