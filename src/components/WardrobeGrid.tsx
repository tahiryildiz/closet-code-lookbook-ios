
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ItemDetailsModal from "./ItemDetailsModal";
import { getTurkishLabel, categoryOptions, subcategoryOptions } from "@/utils/localization";

interface ClothingItem {
  id: string;
  name: string;
  brand?: string;
  category: string;
  subcategory?: string;
  primary_color?: string;
  image_url: string;
  is_favorite?: boolean;
  style_tags?: string[];
  seasons?: string[];
  occasions?: string[];
  user_notes?: string;
  ai_analysis?: any;
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
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
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

      setItems(filteredData);
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
    <>
      <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-4' : 'space-y-4'}>
        {items.map((item) => (
          <Card 
            key={item.id} 
            className="bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden cursor-pointer"
            onClick={() => setSelectedItem(item)}
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

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-4">
                  <h3 className="text-white font-semibold text-base mb-1">{item.name}</h3>
                  {/* Brand name removed as requested */}
                  
                  <div className="flex items-center justify-between">
                    <Badge className="bg-white/20 text-white border-0 text-xs">
                      {getTurkishLabel(item.category, categoryOptions)}
                    </Badge>
                    {item.primary_color && (
                      <Badge className="bg-white/20 text-white border-0 text-xs">
                        {item.primary_color}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedItem && (
        <ItemDetailsModal
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          onUpdate={(updatedItem) => {
            setItems(prev => prev.map(item => 
              item.id === updatedItem.id ? updatedItem : item
            ));
          }}
        />
      )}
    </>
  );
};

export default WardrobeGrid;
