
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Save, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
}

interface ItemDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: WardrobeItem | null;
  onUpdate: () => void;
}

const categories = [
  'Üst Giyim', 'Alt Giyim', 'Elbise', 'Ayakkabı', 'Aksesuar', 'İç Giyim', 'Dış Giyim'
];

const colors = [
  'Siyah', 'Beyaz', 'Gri', 'Mavi', 'Lacivert', 'Kırmızı', 'Yeşil', 'Sarı', 'Pembe', 'Mor', 'Kahverengi', 'Turuncu'
];

const ItemDetailsModal = ({ isOpen, onClose, item, onUpdate }: ItemDetailsModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    primary_color: '',
    brand: '',
    material: '',
    size_info: '',
    user_notes: ''
  });
  const [styleTags, setStyleTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        category: item.category || '',
        primary_color: item.primary_color || '',
        brand: item.brand || '',
        material: item.material || '',
        size_info: item.size_info || '',
        user_notes: item.user_notes || ''
      });
      setStyleTags(item.style_tags || []);
    }
  }, [item]);

  const handleSave = async () => {
    if (!item) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('clothing_items')
        .update({
          name: formData.name,
          category: formData.category,
          primary_color: formData.primary_color,
          brand: formData.brand || null,
          material: formData.material || null,
          size_info: formData.size_info || null,
          user_notes: formData.user_notes || null,
          style_tags: styleTags,
          updated_at: new Date().toISOString()
        })
        .eq('id', item.id);

      if (error) {
        console.error('Error updating item:', error);
        toast.error('Ürün güncellenirken hata oluştu');
        return;
      }

      toast.success('Ürün başarıyla güncellendi');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Ürün güncellenirken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!item) return;

    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('clothing_items')
        .delete()
        .eq('id', item.id);

      if (error) {
        console.error('Error deleting item:', error);
        toast.error('Ürün silinirken hata oluştu');
        return;
      }

      toast.success('Ürün başarıyla silindi');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Ürün silinirken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const addStyleTag = () => {
    if (newTag.trim() && !styleTags.includes(newTag.trim())) {
      setStyleTags([...styleTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeStyleTag = (tagToRemove: string) => {
    setStyleTags(styleTags.filter(tag => tag !== tagToRemove));
  };

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Ürün Detayları</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Image */}
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Ürün Adı *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ürün adını girin"
              />
            </div>

            <div>
              <Label htmlFor="category">Kategori *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Kategori seçin" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="color">Ana Renk</Label>
              <Select value={formData.primary_color} onValueChange={(value) => setFormData({ ...formData, primary_color: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Renk seçin" />
                </SelectTrigger>
                <SelectContent>
                  {colors.map((color) => (
                    <SelectItem key={color} value={color}>
                      {color}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="brand">Marka</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="Marka adını girin"
              />
            </div>

            <div>
              <Label htmlFor="material">Malzeme</Label>
              <Input
                id="material"
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                placeholder="Malzeme bilgisi"
              />
            </div>

            <div>
              <Label htmlFor="size">Beden</Label>
              <Input
                id="size"
                value={formData.size_info}
                onChange={(e) => setFormData({ ...formData, size_info: e.target.value })}
                placeholder="Beden bilgisi"
              />
            </div>

            <div>
              <Label htmlFor="notes">Notlar</Label>
              <Textarea
                id="notes"
                value={formData.user_notes}
                onChange={(e) => setFormData({ ...formData, user_notes: e.target.value })}
                placeholder="Ürün hakkında notlarınız"
                rows={3}
              />
            </div>

            {/* Style Tags */}
            <div>
              <Label>Stil Etiketleri</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {styleTags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                    <button
                      onClick={() => removeStyleTag(tag)}
                      className="ml-1 text-gray-500 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Yeni etiket ekle"
                  onKeyPress={(e) => e.key === 'Enter' && addStyleTag()}
                />
                <Button type="button" variant="outline" onClick={addStyleTag}>
                  Ekle
                </Button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              disabled={isLoading || !formData.name || !formData.category}
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isLoading}
              variant="destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ItemDetailsModal;
