
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getTurkishLabel, subcategoryOptions, colorOptions } from "@/utils/localization";

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
    
    console.log('Translating product name:', { name, category, subcategory, color });
    
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
      'Sweatshirt': 'Sweatshirt',
      'Trousers': 'Pantolon',
      'Rust Colored Trousers': 'Pas Renkli Pantolon',
      'Olive Green Trousers': 'Zeytin Yeşili Pantolon'
    };
    
    // First try to find direct translation
    let translatedName = nameTranslations[name];
    
    // If no direct translation, try to extract base item type
    if (!translatedName) {
      // Special handling for polo shirts
      if (subcategory === 'Polo Shirt' || subcategory === 'Polo' || 
          name.toLowerCase().includes('polo')) {
        translatedName = 'Polo Yaka';
      } else if (name.toLowerCase().includes('jean') || name.toLowerCase().includes('denim')) {
        translatedName = 'Kot Pantolon';
      } else if (name.toLowerCase().includes('shirt') && !name.toLowerCase().includes('t-shirt') && !name.toLowerCase().includes('polo')) {
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
        // Try to build from subcategory
        if (subcategory && subcategory !== 'Unknown') {
          const subcategoryTranslation = getTurkishLabel(subcategory, subcategoryOptions);
          if (subcategoryTranslation && subcategoryTranslation !== subcategory) {
            translatedName = subcategoryTranslation;
          } else {
            translatedName = subcategory;
          }
        } else {
          translatedName = name; // Fallback to original
        }
      }
    }
    
    // Translate color using the enhanced color options
    const translatedColor = getTurkishLabel(color, colorOptions);
    console.log('Color translation:', color, '->', translatedColor);
    
    // Add color to the product name if color exists and is not already in the name
    if (translatedColor && translatedColor !== 'Bilinmiyor' && translatedColor !== color && 
        !translatedName.toLowerCase().includes(translatedColor.toLowerCase())) {
      const finalName = `${translatedColor} ${translatedName}`;
      console.log('Final translated name:', finalName);
      return finalName;
    }
    
    console.log('Final translated name (no color):', translatedName);
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
