
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categoryIcons: Record<string, string> = {
  'all': '👕',
  'Tops': '👔',
  'Bottoms': '👖',
  'Dresses & Suits': '👗',
  'Outerwear': '🧥',
  'Footwear': '👟',
  'Accessories': '👜',
  'Bags': '👜',
  'Underwear & Loungewear': '👙',
  'Swimwear': '🩱',
  'Activewear': '🏃'
};

// Turkish translations for categories
const categoryTranslations: Record<string, string> = {
  'all': 'Tümü',
  'Tops': 'Üstler',
  'Bottoms': 'Altlar',
  'Dresses & Suits': 'Elbise & Takım',
  'Outerwear': 'Dış Giyim',
  'Footwear': 'Ayakkabı',
  'Accessories': 'Aksesuar',
  'Bags': 'Çanta',
  'Underwear & Loungewear': 'İç Giyim',
  'Swimwear': 'Mayo & Bikini',
  'Activewear': 'Spor Giyim'
};

const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchAvailableCategories();
  }, []);

  const fetchAvailableCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('clothing_items')
        .select('category');

      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }

      // Get unique categories from the data
      const uniqueCategories = [...new Set(data?.map(item => item.category) || [])];
      setAvailableCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Create category objects with Turkish names and icons
  const categories = [
    { id: 'all', name: 'Tümü', icon: '👕' },
    ...availableCategories.map(category => ({
      id: category,
      name: categoryTranslations[category] || category,
      icon: categoryIcons[category] || '👕'
    }))
  ];

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
