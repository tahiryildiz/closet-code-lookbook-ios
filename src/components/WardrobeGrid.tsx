
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WardrobeItem {
  id: string;
  name: string;
  category: string;
  primary_color: string;
  brand?: string;
  style_tags: string[];
  image_url: string;
  user_notes?: string;
  material?: string;
  size_info?: string;
  is_favorite?: boolean;
}

interface WardrobeGridProps {
  viewMode: 'grid' | 'list';
  searchQuery: string;
  selectedCategory: string;
  refreshTrigger?: number;
}

const WardrobeGrid = ({ viewMode, searchQuery, selectedCategory, refreshTrigger }: WardrobeGridProps) => {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      console.log('Fetching wardrobe items...');
      const { data, error } = await supabase
        .from('clothing_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching items:', error);
        throw error;
      }

      console.log('Fetched items:', data?.length || 0);

      const formattedItems = data?.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        primary_color: item.primary_color,
        brand: item.brand,
        style_tags: item.style_tags || [],
        image_url: item.image_url,
        user_notes: item.user_notes,
        material: item.material,
        size_info: item.size_info,
        is_favorite: item.is_favorite
      })) || [];

      setItems(formattedItems);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [refreshTrigger]);

  // Set up real-time subscription for new items
  useEffect(() => {
    console.log('Setting up real-time subscription for clothing_items...');
    
    const channel = supabase
      .channel('wardrobe-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'clothing_items'
        },
        (payload) => {
          console.log('New item added:', payload.new);
          // Add the new item to the existing items
          const newItem = {
            id: payload.new.id,
            name: payload.new.name,
            category: payload.new.category,
            primary_color: payload.new.primary_color,
            brand: payload.new.brand,
            style_tags: payload.new.style_tags || [],
            image_url: payload.new.image_url,
            user_notes: payload.new.user_notes,
            material: payload.new.material,
            size_info: payload.new.size_info,
            is_favorite: payload.new.is_favorite
          };
          setItems(prev => [newItem, ...prev]);
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, []);

  const handleFavoriteToggle = async (itemId: string, currentFavorite: boolean) => {
    try {
      const { error } = await supabase
        .from('clothing_items')
        .update({ is_favorite: !currentFavorite })
        .eq('id', itemId);

      if (error) {
        console.error('Error updating favorite:', error);
        toast.error('Favori durumu güncellenirken hata oluştu');
        return;
      }

      // Update local state
      setItems(items.map(item => 
        item.id === itemId ? { ...item, is_favorite: !currentFavorite } : item
      ));

      toast.success(!currentFavorite ? 'Favorilere eklendi' : 'Favorilerden çıkarıldı');
    } catch (error) {
      console.error('Error updating favorite:', error);
      toast.error('Favori durumu güncellenirken hata oluştu');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('clothing_items')
        .delete()
        .eq('id', itemId);

      if (error) {
        console.error('Error deleting item:', error);
        toast.error('Ürün silinirken hata oluştu');
        return;
      }

      setItems(items.filter(item => item.id !== itemId));
      toast.success('Ürün başarıyla silindi');
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Ürün silinirken hata oluştu');
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.style_tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="bg-white border-0 shadow-sm rounded-2xl overflow-hidden">
            <div className="aspect-square bg-gray-200 animate-pulse"></div>
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">👗</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {items.length === 0 ? "Gardırobunuz boş" : "Ürün bulunamadı"}
        </h3>
        <p className="text-gray-500">
          {items.length === 0 
            ? "Dolabınız şu anda boş, siz kıyafetlerinizi yükledikçe burada görünecekler. İlk ürününüzü eklemek için sağ üstteki + butonuna tıklayın." 
            : "Arama kriterlerinizi değiştirin veya yeni ürünler ekleyin"
          }
        </p>
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
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <div className="text-4xl mb-2">👕</div>
                    <div className="text-sm">Resim yok</div>
                  </div>
                </div>
              )}
              <div className="absolute top-3 right-3 flex space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className={`h-8 w-8 p-0 bg-white/90 hover:bg-white rounded-full shadow-sm ${
                    item.is_favorite ? 'text-red-500' : 'text-gray-600'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFavoriteToggle(item.id, item.is_favorite || false);
                  }}
                >
                  <Heart className={`h-4 w-4 ${item.is_favorite ? 'fill-current' : ''}`} />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 bg-white/90 hover:bg-white rounded-full shadow-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4 text-gray-600" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={() => handleFavoriteToggle(item.id, item.is_favorite || false)}
                    >
                      {item.is_favorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      Sil
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                {item.style_tags.slice(0, 2).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs border-gray-200 text-gray-600 bg-gray-50 rounded-full"
                  >
                    {tag}
                  </Badge>
                ))}
                {item.style_tags.length > 2 && (
                  <Badge
                    variant="outline"
                    className="text-xs border-gray-200 text-gray-500 bg-gray-50 rounded-full"
                  >
                    +{item.style_tags.length - 2}
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
