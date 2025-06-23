
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
  // Helper function to generate Turkish product name from analysis
  const generateTurkishProductName = (analysisName: string, category: string, subcategory: string, color: string) => {
    if (!analysisName) return '';
    
    console.log('Generating Turkish product name:', { analysisName, category, subcategory, color });
    
    // If analysis already provided a Turkish name, use it
    if (analysisName && (analysisName.includes('Polo Yaka') || analysisName.includes('Tişört') || 
        analysisName.includes('Gömlek') || analysisName.includes('Pantolon') || 
        analysisName.includes('Ceket') || analysisName.includes('Ayakkabı'))) {
      return analysisName;
    }
    
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
      'Blazer': 'Blazer',
      'Jacket': 'Ceket',
      'Giyim Eşyası': 'Giyim Eşyası',
      'Coat': 'Palto',
      'Cardigan': 'Hırka',
      'Vest': 'Yelek',
      'Sweater': 'Kazak',
      'Hoodie': 'Kapşonlu Sweatshirt',
      'Rust Colored Trousers': 'Pas Renkli Pantolon',
      'Olive Green Trousers': 'Zeytin Yeşili Pantolon'
    };
    
    // First try to find direct translation
    let translatedName = nameTranslations[analysisName];
    
    // If no direct translation, try to extract base item type
    if (!translatedName) {
      // Special handling for polo shirts
      if (subcategory === 'Polo Shirt' || subcategory === 'Polo' || 
          analysisName.toLowerCase().includes('polo')) {
        translatedName = 'Polo Yaka';
      } else if (subcategory === 'Blazer' || analysisName.toLowerCase().includes('blazer')) {
        translatedName = 'Blazer';
      } else if (analysisName.toLowerCase().includes('jean') || analysisName.toLowerCase().includes('denim')) {
        translatedName = 'Kot Pantolon';
      } else if (analysisName.toLowerCase().includes('shirt') && !analysisName.toLowerCase().includes('t-shirt') && !analysisName.toLowerCase().includes('polo')) {
        translatedName = 'Gömlek';
      } else if (analysisName.toLowerCase().includes('t-shirt') || analysisName.toLowerCase().includes('tshirt')) {
        translatedName = 'Tişört';
      } else if (analysisName.toLowerCase().includes('trouser') || analysisName.toLowerCase().includes('pant')) {
        translatedName = 'Pantolon';
      } else if (analysisName.toLowerCase().includes('sweater')) {
        translatedName = 'Kazak';
      } else if (analysisName.toLowerCase().includes('jacket')) {
        translatedName = 'Ceket';
      } else {
        // Try to build from subcategory
        if (subcategory && subcategory !== 'Unknown') {
          const subcategoryTranslation = getTurkishLabel(subcategory, subcategoryOptions);
          if (subcategoryTranslation && subcategoryTranslation !== subcategory) {
            translatedName = subcategoryTranslation;
          } else {
            // Fallback translations for common subcategories
            const fallbackTranslations: Record<string, string> = {
              'T-Shirt': 'Tişört',
              'Shirt': 'Gömlek',
              'Jeans': 'Kot Pantolon',
              'Blazer': 'Blazer',
              'Jacket': 'Ceket',
              'Sneakers': 'Spor Ayakkabı',
              'Dress': 'Elbise',
              'Skirt': 'Etek',
              'Shorts': 'Şort'
            };
            translatedName = fallbackTranslations[subcategory] || subcategory;
          }
        } else {
          translatedName = analysisName; // Fallback to original
        }
      }
    }
    
    // Translate color using the enhanced color options
    const translatedColor = getTurkishLabel(color, colorOptions);
    console.log('Color translation:', color, '->', translatedColor);
    
    // Add color to the product name if color exists and is not already in the name
    if (translatedColor && translatedColor !== 'Bilinmiyor' && translatedColor !== 'Unknown' && translatedColor !== color && 
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
  
  // Only auto-generate name if user hasn't provided one
  const displayName = formData.name || 
    (analysisResult?.name ? generateTurkishProductName(analysisResult.name, productCategory, productSubcategory, productColor) : '');
  
  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Ürün Adı</label>
        <Input
          value={displayName}
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
