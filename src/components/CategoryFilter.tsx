
import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: 'all', name: 'Tümü', icon: '👕' },
  { id: 'tops', name: 'Üstler', icon: '👔' },
  { id: 'bottoms', name: 'Altlar', icon: '👖' },
  { id: 'dresses', name: 'Elbiseler', icon: '👗' },
  { id: 'outerwear', name: 'Dış Giyim', icon: '🧥' },
  { id: 'shoes', name: 'Ayakkabılar', icon: '👟' },
  { id: 'accessories', name: 'Çantalar', icon: '👜' }
];

const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="w-full">
      <div className="flex overflow-x-auto scrollbar-hide space-x-3 px-1 py-2" style={{ scrollBehavior: 'smooth' }}>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category.id)}
            className={`flex-shrink-0 rounded-full px-4 py-2 font-medium text-sm transition-all duration-200 whitespace-nowrap ${
              selectedCategory === category.id
                ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md'
                : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700 hover:border-gray-300'
            }`}
          >
            <span className="mr-2 text-base">{category.icon}</span>
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
