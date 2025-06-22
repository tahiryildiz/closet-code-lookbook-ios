
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
  // Helper function to translate product names and add color
  const translateProductName = (name: string, category: string, subcategory: string, color: string) => {
    if (!name) return '';
    
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
      'Polo Shirt': 'Polo Tişört',
      'Sweatshirt': 'Sweatshirt',
      'Trousers': 'Pantolon',
      'Rust Colored Trousers': 'Kahverengi Pantolon'
    };
    
    // Color translations
    const colorTranslations: Record<string, string> = {
      'Black': 'Siyah',
      'White': 'Beyaz',
      'Gray': 'Gri',
      'Grey': 'Gri',
      'Blue': 'Mavi',
      'Light Blue': 'Açık Mavi',
      'Dark Blue': 'Koyu Mavi',  
      'Navy': 'Lacivert',
      'Red': 'Kırmızı',
      'Green': 'Yeşil',
      'Yellow': 'Sarı',
      'Pink': 'Pembe',
      'Purple': 'Mor',
      'Brown': 'Kahverengi',
      'Orange': 'Turuncu',
      'Beige': 'Bej',
      'Cream': 'Krem',
      'Olive': 'Zeytin Yeşili',
      'Khaki': 'Haki',
      'Rust': 'Kahverengi'
    };
    
    // First try to find direct translation
    let translatedName = nameTranslations[name];
    
    // If no direct translation, try to extract base item type
    if (!translatedName) {
      if (name.toLowerCase().includes('jean') || name.toLowerCase().includes('denim')) {
        translatedName = 'Kot Pantolon';
      } else if (name.toLowerCase().includes('shirt') && !name.toLowerCase().includes('t-shirt')) {
        translatedName = 'Gömlek';
      } else if (name.toLowerCase().includes('t-shirt') || name.toLowerCase().includes('tshirt')) {
        translatedName = 'Tişört';
      } else if (name.toLowerCase().includes('trouser') || name.toLowerCase().includes('pant')) {
        translatedName = 'Pantolon';
      } else if (name.toLowerCase().includes('sweater')) {
        translatedName = 'Kazak';
      } else if (name.toLowerCase().includes('jacket')) {
        translatedName = 'Ceket';
      } else {
        // Try to build from category/subcategory
        if (subcategory && subcategory !== 'Unknown') {
          if (subcategory === 'Trousers') translatedName = 'Pantolon';
          else if (subcategory === 'T-Shirt') translatedName = 'Tişört';
          else if (subcategory === 'Shirt') translatedName = 'Gömlek';
          else if (subcategory === 'Jeans') translatedName = 'Kot Pantolon';
          else translatedName = subcategory;
        } else if (category && category !== 'Unknown') {
          if (category === 'Tops') translatedName = 'Üst';
          else if (category === 'Bottoms') translatedName = 'Alt';
          else translatedName = category;
        } else {
          translatedName = name; // Fallback to original
        }
      }
    }
    
    const translatedColor = colorTranslations[color] || color;
    
    // Add color to the product name if color exists and is not already in the name
    if (translatedColor && translatedColor !== 'Unknown' && !translatedName.toLowerCase().includes(translatedColor.toLowerCase())) {
      return `${translatedColor} ${translatedName}`;
    }
    
    return translatedName;
  };

  // Get the color for the product name
  const productColor = analysisResult?.primary_color || '';
  const productCategory = analysisResult?.category || '';
  const productSubcategory = analysisResult?.subcategory || '';
  
  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Ürün Adı</label>
        <Input
          value={formData.name || translateProductName(analysisResult?.name || '', productCategory, productSubcategory, productColor) || ''}
          onChange={(e) => onFormDataChange({ name: e.target.value })}
          className="bg-gray-50 border-gray-200 focus:border-blue-400 rounded-xl text-base py-3"
          placeholder="Ürün adını girin"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Marka</label>
        <Input
          value={formData.brand || (analysisResult?.brand && analysisResult.brand !== 'Unknown' ? analysisResult.brand : '')}
          onChange={(e) => onFormDataChange({ brand: e.target.value })}
          placeholder="Ürün markasını girebilirsiniz"
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
