
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FormData {
  name: string;
  brand: string;
  category: string;
  primaryColor: string;
  tags: string;
  notes: string;
}

interface ItemFormProps {
  formData: FormData;
  analysisResult: any;
  onFormDataChange: (data: Partial<FormData>) => void;
}

const ItemForm = ({ formData, analysisResult, onFormDataChange }: ItemFormProps) => {
  // Helper function to translate product names
  const translateProductName = (name: string) => {
    if (!name) return '';
    
    const nameTranslations: Record<string, string> = {
      'Linen Trousers': 'Keten Pantolon',
      'Cotton Shirt': 'Pamuk Gömlek',
      'Denim Jeans': 'Kot Pantolon',
      'Wool Sweater': 'Yün Kazak',
      'Silk Blouse': 'İpek Bluz',
      'Leather Jacket': 'Deri Ceket',
      'Canvas Sneakers': 'Kanvas Spor Ayakkabı',
      'Light Blue Straight Leg Jeans': 'Açık Mavi Düz Paça Kot Pantolon',
      'Lacoste Cargo Pants': 'Lacoste Kargo Pantolon',
      'Cargo Pants': 'Kargo Pantolon',
      'Chino Pants': 'Chino Pantolon',
      'Dress Pants': 'Klasik Pantolon',
      'Joggers': 'Eşofman Altı',
      'Shorts': 'Şort'
    };
    
    return nameTranslations[name] || name;
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Ürün Adı</label>
        <Input
          value={formData.name || translateProductName(analysisResult?.name) || ''}
          onChange={(e) => onFormDataChange({ name: e.target.value })}
          className="bg-gray-50 border-gray-200 focus:border-blue-400 rounded-xl text-base py-3"
          placeholder="Ürün adını girin"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Marka</label>
        <Input
          value={formData.brand || ''}
          onChange={(e) => onFormDataChange({ brand: e.target.value })}
          placeholder="Marka girin"
          className="bg-gray-50 border-gray-200 focus:border-blue-400 rounded-xl text-base py-3"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Kişisel Notlar (İsteğe Bağlı)</label>
        <Textarea
          value={formData.notes || ''}
          onChange={(e) => onFormDataChange({ notes: e.target.value })}
          placeholder="Bu ürün hakkında kişisel notlarınızı ekleyin..."
          className="bg-gray-50 border-gray-200 focus:border-blue-400 rounded-xl text-base resize-none"
          rows={3}
        />
      </div>
    </div>
  );
};

export default ItemForm;
