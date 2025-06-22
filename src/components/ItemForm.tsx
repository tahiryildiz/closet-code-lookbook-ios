
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getTurkishLabel, categoryOptions, subcategoryOptions, materialOptions, fitOptions, colorToneOptions, patternOptions, seasonOptions, occasionOptions } from "@/utils/localization";

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
  // Get Turkish labels for display
  const getTurkishCategory = (englishValue: string) => {
    return getTurkishLabel(englishValue, categoryOptions);
  };

  const getTurkishSubcategory = (englishValue: string) => {
    return getTurkishLabel(englishValue, subcategoryOptions);
  };

  const getTurkishMaterial = (englishValue: string) => {
    return getTurkishLabel(englishValue, materialOptions);
  };

  const getTurkishFit = (englishValue: string) => {
    return getTurkishLabel(englishValue, fitOptions);
  };

  const getTurkishPattern = (englishValue: string) => {
    return getTurkishLabel(englishValue, patternOptions);
  };

  const getTurkishColorTone = (englishValue: string) => {
    return getTurkishLabel(englishValue, colorToneOptions);
  };

  const getTurkishSeasons = (englishSeasons: string[]) => {
    return englishSeasons?.map(season => getTurkishLabel(season, seasonOptions)).join(', ') || '';
  };

  const getTurkishOccasions = (englishOccasions: string[]) => {
    return englishOccasions?.map(occasion => getTurkishLabel(occasion, occasionOptions)).join(', ') || '';
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Ürün Adı</label>
        <Input
          value={formData.name || analysisResult?.name || ''}
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
                  getTurkishCategory(formData.category || analysisResult?.category)}
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
            value={formData.primaryColor || analysisResult?.primaryColor || ''}
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
              <span className="text-gray-600">{getTurkishSubcategory(analysisResult.subcategory)}</span>
            </div>
          )}
          
          {analysisResult.material && (
            <div className="text-sm">
              <span className="font-medium text-gray-700">Malzeme:</span>{' '}
              <span className="text-gray-600">{getTurkishMaterial(analysisResult.material)}</span>
            </div>
          )}
          
          {analysisResult.fit && (
            <div className="text-sm">
              <span className="font-medium text-gray-700">Kesim:</span>{' '}
              <span className="text-gray-600">{getTurkishFit(analysisResult.fit)}</span>
            </div>
          )}
          
          {analysisResult.pattern && (
            <div className="text-sm">
              <span className="font-medium text-gray-700">Desen:</span>{' '}
              <span className="text-gray-600">{getTurkishPattern(analysisResult.pattern)}</span>
            </div>
          )}
          
          {analysisResult.colorTone && (
            <div className="text-sm">
              <span className="font-medium text-gray-700">Renk Tonu:</span>{' '}
              <span className="text-gray-600">{getTurkishColorTone(analysisResult.colorTone)}</span>
            </div>
          )}
          
          {analysisResult.seasons && analysisResult.seasons.length > 0 && (
            <div className="text-sm">
              <span className="font-medium text-gray-700">Mevsimler:</span>{' '}
              <span className="text-gray-600">{getTurkishSeasons(analysisResult.seasons)}</span>
            </div>
          )}
          
          {analysisResult.occasions && analysisResult.occasions.length > 0 && (
            <div className="text-sm">
              <span className="font-medium text-gray-700">Durumlar:</span>{' '}
              <span className="text-gray-600">{getTurkishOccasions(analysisResult.occasions)}</span>
            </div>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Stil Etiketleri</label>
        <Input
          value={formData.tags || analysisResult?.tags?.join(', ') || ''}
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
