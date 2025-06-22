
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  getTurkishLabel, 
  categoryOptions, 
  subcategoryOptions, 
  materialOptions, 
  fitOptions, 
  colorToneOptions, 
  patternOptions, 
  seasonOptions, 
  occasionOptions,
  waistStyleOptions,
  closureTypeOptions,
  pocketStyleOptions,
  hemStyleOptions
} from "@/utils/localization";

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
  // Helper function to translate color names
  const translateColor = (color: string) => {
    const colorTranslations: Record<string, string> = {
      'Red': 'Kırmızı',
      'Blue': 'Mavi',
      'Green': 'Yeşil',
      'Yellow': 'Sarı',
      'Black': 'Siyah',
      'White': 'Beyaz',
      'Gray': 'Gri',
      'Brown': 'Kahverengi',
      'Pink': 'Pembe',
      'Purple': 'Mor',
      'Orange': 'Turuncu',
      'Navy': 'Lacivert',
      'Beige': 'Bej',
      'Rust': 'Pas Rengi',
      'Khaki': 'Haki',
      'Olive': 'Zeytin Yeşili',
      'Maroon': 'Bordo',
      'Cream': 'Krem',
      'Tan': 'Ten Rengi',
      'Light Blue': 'Açık Mavi',
      'Dark Blue': 'Koyu Mavi',
      'Light Gray': 'Açık Gri',
      'Dark Gray': 'Koyu Gri',
      'Unknown': 'Bilinmiyor'
    };
    return colorTranslations[color] || color;
  };

  // Helper function to translate style tags
  const translateStyleTags = (tags: string[]) => {
    const tagTranslations: Record<string, string> = {
      'casual': 'günlük',
      'formal': 'resmi',
      'sport': 'spor',
      'elegant': 'şık',
      'comfortable': 'rahat',
      'trendy': 'moda',
      'classic': 'klasik',
      'modern': 'modern',
      'vintage': 'vintage',
      'chic': 'şık',
      'trousers': 'pantolon',
      'jeans': 'kot',
      'linen': 'keten',
      'cotton': 'pamuk',
      'denim': 'kot kumaş',
      'straight': 'düz',
      'slim': 'dar',
      'regular': 'normal',
      'relaxed': 'rahat',
      'summer': 'yaz',
      'spring': 'ilkbahar',
      'autumn': 'sonbahar',
      'winter': 'kış'
    };
    return tags?.map(tag => tagTranslations[tag.toLowerCase()] || tag).join(', ') || '';
  };

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
      'Light Blue Straight Leg Jeans': 'Açık Mavi Düz Paça Kot Pantolon'
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Kategori</label>
          <Select 
            value={formData.category || analysisResult?.category || ''} 
            onValueChange={(value) => onFormDataChange({ category: value })}
          >
            <SelectTrigger className="bg-gray-50 border-gray-200 rounded-xl text-base py-3">
              <SelectValue placeholder="Kategori seçin">
                {(formData.category || analysisResult?.category) && 
                  getTurkishLabel(formData.category || analysisResult?.category, categoryOptions)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Ana Renk</label>
          <Input
            value={formData.primaryColor || translateColor(analysisResult?.primaryColor) || ''}
            onChange={(e) => onFormDataChange({ primaryColor: e.target.value })}
            className="bg-gray-50 border-gray-200 rounded-xl text-base py-3"
            placeholder="Ana renk girin"
          />
        </div>
      </div>

      {/* Display additional analysis fields in Turkish for reference */}
      {analysisResult && (
        <div className="bg-blue-50 p-4 rounded-xl space-y-3">
          <h4 className="font-semibold text-gray-900 text-sm">AI Analiz Sonuçları:</h4>
          
          {analysisResult.subcategory && (
            <div className="text-sm">
              <span className="font-medium text-gray-700">Alt Kategori:</span>{' '}
              <span className="text-gray-600">{getTurkishLabel(analysisResult.subcategory, subcategoryOptions)}</span>
            </div>
          )}
          
          {analysisResult.material && (
            <div className="text-sm">
              <span className="font-medium text-gray-700">Malzeme:</span>{' '}
              <span className="text-gray-600">{getTurkishLabel(analysisResult.material, materialOptions)}</span>
            </div>
          )}
          
          {analysisResult.fit && (
            <div className="text-sm">
              <span className="font-medium text-gray-700">Kesim:</span>{' '}
              <span className="text-gray-600">{getTurkishLabel(analysisResult.fit, fitOptions)}</span>
            </div>
          )}

          {analysisResult.waist_style && (
            <div className="text-sm">
              <span className="font-medium text-gray-700">Bel Stili:</span>{' '}
              <span className="text-gray-600">{getTurkishLabel(analysisResult.waist_style, waistStyleOptions)}</span>
            </div>
          )}

          {analysisResult.closure_type && (
            <div className="text-sm">
              <span className="font-medium text-gray-700">Kapama Tipi:</span>{' '}
              <span className="text-gray-600">{getTurkishLabel(analysisResult.closure_type, closureTypeOptions)}</span>
            </div>
          )}

          {analysisResult.pocket_style && (
            <div className="text-sm">
              <span className="font-medium text-gray-700">Cep Stili:</span>{' '}
              <span className="text-gray-600">{getTurkishLabel(analysisResult.pocket_style, pocketStyleOptions)}</span>
            </div>
          )}

          {analysisResult.hem_style && (
            <div className="text-sm">
              <span className="font-medium text-gray-700">Paça Stili:</span>{' '}
              <span className="text-gray-600">{getTurkishLabel(analysisResult.hem_style, hemStyleOptions)}</span>
            </div>
          )}
          
          {analysisResult.pattern && (
            <div className="text-sm">
              <span className="font-medium text-gray-700">Desen:</span>{' '}
              <span className="text-gray-600">{getTurkishLabel(analysisResult.pattern, patternOptions)}</span>
            </div>
          )}
          
          {analysisResult.colorTone && (
            <div className="text-sm">
              <span className="font-medium text-gray-700">Renk Tonu:</span>{' '}
              <span className="text-gray-600">{getTurkishLabel(analysisResult.colorTone, colorToneOptions)}</span>
            </div>
          )}
          
          {analysisResult.seasons && analysisResult.seasons.length > 0 && (
            <div className="text-sm">
              <span className="font-medium text-gray-700">Mevsimler:</span>{' '}
              <span className="text-gray-600">
                {analysisResult.seasons.map((season: string) => getTurkishLabel(season, seasonOptions)).join(', ')}
              </span>
            </div>
          )}
          
          {analysisResult.occasions && analysisResult.occasions.length > 0 && (
            <div className="text-sm">
              <span className="font-medium text-gray-700">Durumlar:</span>{' '}
              <span className="text-gray-600">
                {analysisResult.occasions.map((occasion: string) => getTurkishLabel(occasion, occasionOptions)).join(', ')}
              </span>
            </div>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Stil Etiketleri</label>
        <Input
          value={formData.tags || translateStyleTags(analysisResult?.tags) || ''}
          onChange={(e) => onFormDataChange({ tags: e.target.value })}
          className="bg-gray-50 border-gray-200 rounded-xl text-base py-3"
          placeholder="Stil etiketleri girin (virgülle ayırın)"
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
