
import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: 'all', name: 'All Items', icon: '👔' },
  { id: 'tops', name: 'Tops', icon: '👕' },
  { id: 'bottoms', name: 'Bottoms', icon: '👖' },
  { id: 'dresses', name: 'Dresses', icon: '👗' },
  { id: 'outerwear', name: 'Outerwear', icon: '🧥' },
  { id: 'shoes', name: 'Shoes', icon: '👠' },
  { id: 'accessories', name: 'Accessories', icon: '👜' }
];

const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700">Categories</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category.id)}
            className={`rounded-full ${
              selectedCategory === category.id
                ? 'bg-rose-500 hover:bg-rose-600 text-white'
                : 'bg-white/80 border-rose-200 hover:bg-rose-50 text-gray-700'
            }`}
          >
            <span className="mr-1">{category.icon}</span>
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
