import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getTurkishLabel, categoryOptions, subcategoryOptions, colorOptions } from "@/utils/localization";

interface ClothingItem {
  id: string;
  name: string;
  brand?: string;
  category: string;
  subcategory?: string;
  primary_color: string;
  image_url: string;
  is_favorite?: boolean;
  style_tags: string[];
  seasons?: string[];
  occasions?: string[];
  user_notes?: string;
  ai_analysis?: any;
  material?: string;
  size_info?: string;
}

interface WardrobeGridProps {
  viewMode: 'grid' | 'list';
  searchQuery: string;
  selectedCategory: string;
  refreshTrigger?: number;
}

const WardrobeGrid = ({ viewMode, searchQuery, selectedCategory, refreshTrigger }: WardrobeGridProps) => {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchItems();
  }, [selectedCategory, refreshTrigger]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('clothing_items')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply category filter
      if (selectedCategory !== 'all') {
        const englishCategory = selectedCategory === 'üst-giyim' ? 'Tops' : 
                               selectedCategory === 'altlar' ? 'Bottoms' :
                               selectedCategory === 'elbise-takım' ? 'Dresses & Suits' :
                               selectedCategory === 'dış-giyim' ? 'Outerwear' :
                               selectedCategory === 'ayakkabı' ? 'Footwear' :
                               selectedCategory === 'aksesuar' ? 'Accessories' :
                               selectedCategory === 'çanta' ? 'Bags' :
                               selectedCategory === 'iç-giyim' ? 'Underwear & Loungewear' :
                               selectedCategory === 'mayo-bikini' ? 'Swimwear' :
                               selectedCategory === 'spor-giyim' ? 'Activewear' : selectedCategory;
        
        query = query.eq('category', englishCategory);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching items:', error);
        toast({
          title: "Hata",
          description: "Ürünler yüklenirken bir hata oluştu",
          variant: "destructive"
        });
        return;
      }

      let filteredData = data || [];

      // Apply search filter
      if (searchQuery) {
        filteredData = filteredData.filter(item => 
          item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.primary_color?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Ensure style_tags is always an array
      const processedData = filteredData.map(item => ({
        ...item,
        style_tags: item.style_tags || []
      }));

      setItems(processedData);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Hata",
        description: "Beklenmeyen bir hata oluştu",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (itemId: string, currentFavorite: boolean) => {
    try {
      const { error } = await supabase
        .from('clothing_items')
        .update({ is_favorite: !currentFavorite })
        .eq('id', itemId);

      if (error) throw error;

      setItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, is_favorite: !currentFavorite } : item
      ));

      toast({
        title: !currentFavorite ? "Favorilere eklendi" : "Favorilerden çıkarıldı",
        description: "Değişiklik kaydedildi"
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Hata",
        description: "Favori durumu güncellenirken hata oluştu",
        variant: "destructive"
      });
    }
  };

  const deleteItem = async (itemId: string, itemName: string) => {
    if (!confirm(`"${itemName}" ürününü silmek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('clothing_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setItems(prev => prev.filter(item => item.id !== itemId));

      toast({
        title: "Ürün silindi",
        description: `${itemName} gardırobunuzdan kaldırıldı`
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Hata",
        description: "Ürün silinirken hata oluştu",
        variant: "destructive"
      });
    }
  };

  const translateProductName = (name: string, category: string, subcategory: string, primaryColor: string) => {
    if (!name) return '';
    
    // Enhanced translation mapping
    const nameTranslations: Record<string, string> = {
      'Linen Trousers': 'Keten Pantolon',
      'Cotton Shirt': 'Pamuk Gömlek',
      'Denim Jeans': 'Kot Pantolon',
      'Light Blue Denim Jeans': 'Açık Mavi Kot Pantolon',
      'Dark Blue Denim Jeans': 'Koyu Mavi Kot Pantolon',
      'Blue Denim Jeans': 'Mavi Kot Pantolon',
      'Jeans': 'Kot Pantolon',
      'Wool Sweater': 'Yün Kazak',
      'Silk Blouse': 'İpek Bluz',
      'Leather Jacket': 'Deri Ceket',
      'Canvas Sneakers': 'Kanvas Spor Ayakkabı',
      'Light Blue Straight Leg Jeans': 'Açık Mavi Düz Paça Kot Pantolon',
      'Lacoste Cargo Pants': 'Kargo Pantolon',
      'Cargo Pants': 'Kargo Pantolon',
      'Chino Pants': 'Chino Pantolon',
      'Dress Pants': 'Klasik Pantolon',
      'Joggers': 'Eşofman Altı',
      'Shorts': 'Şort',
      'T-Shirt': 'Tişört',
      'Shirt': 'Gömlek',
      'Blouse': 'Bluz',
      'Polo Shirt': 'Polo Yaka',
      'Polo': 'Polo Yaka',
      'Sweatshirt': 'Sweatshirt'
    };

    // First try direct translation
    let translatedName = nameTranslations[name];
    
    // If no direct translation, build from category/subcategory
    if (!translatedName) {
      // Special handling for polo shirts first
      if (subcategory === 'Polo Shirt' || subcategory === 'Polo' || 
          name.toLowerCase().includes('polo')) {
        translatedName = 'Polo Yaka';
      } else if (subcategory) {
        const subcategoryLabel = getTurkishLabel(subcategory, subcategoryOptions);
        if (subcategoryLabel && subcategoryLabel !== subcategory) {
          translatedName = subcategoryLabel;
        }
      }
      
      // Fallback to category
      if (!translatedName) {
        const categoryLabel = getTurkishLabel(category, categoryOptions);
        if (categoryLabel && categoryLabel !== category) {
          translatedName = categoryLabel;
        }
      }
      
      // Last resort - try partial matching
      if (!translatedName) {
        if (name.toLowerCase().includes('jean') || name.toLowerCase().includes('denim')) {
          translatedName = 'Kot Pantolon';
        } else if (name.toLowerCase().includes('shirt') && !name.toLowerCase().includes('polo')) {
          translatedName = 'Gömlek';
        } else if (name.toLowerCase().includes('t-shirt') || name.toLowerCase().includes('tshirt')) {
          translatedName = 'Tişört';
        } else if (name.toLowerCase().includes('trouser') || name.toLowerCase().includes('pant')) {
          translatedName = 'Pantolon';
        } else {
          translatedName = name; // Fallback to original
        }
      }
    }
    
    // Add color if available and not already included (using Turkish translation)
    const translatedColor = getTurkishLabel(primaryColor, colorOptions);
    if (translatedColor && translatedColor !== 'Unknown' && translatedColor !== primaryColor && !translatedName.toLowerCase().includes(translatedColor.toLowerCase())) {
      return `${translatedColor} ${translatedName}`;
    }
    
    return translatedName;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-gray-200 animate-pulse rounded-2xl aspect-[3/4]" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          {searchQuery ? 'Arama kriterlerinize uygun ürün bulunamadı' : 'Henüz hiç ürün eklemediniz'}
        </p>
      </div>
    );
  }

  return (
    <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-4' : 'space-y-4'}>
      {items.map((item) => (
        <Card 
          key={item.id} 
          className="bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden"
        >
          <CardContent className="p-0">
            <div className="aspect-[3/4] relative">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(item.id, item.is_favorite || false);
                }}
                className="absolute top-3 right-3 bg-white/80 hover:bg-white rounded-full p-2 shadow-sm transition-colors"
              >
                <Heart 
                  className={`h-4 w-4 ${item.is_favorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteItem(item.id, translateProductName(item.name, item.category, item.subcategory || '', item.primary_color));
                }}
                className="absolute top-3 left-3 bg-white/80 hover:bg-white rounded-full p-2 shadow-sm transition-colors hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </button>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-4">
                <h3 className="text-white font-semibold text-base mb-1">
                  {translateProductName(item.name, item.category, item.subcategory || '', item.primary_color)}
                </h3>
                
                <div className="flex items-center justify-between">
                  <Badge className="bg-white/20 text-white border-0 text-xs">
                    {getTurkishLabel(item.category, categoryOptions)}
                  </Badge>
                  {item.primary_color && (
                    <Badge className="bg-white/20 text-white border-0 text-xs">
                      {getTurkishLabel(item.primary_color, colorOptions)}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default WardrobeGrid;
