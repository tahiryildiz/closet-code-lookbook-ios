
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
  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Ürün Adı</label>
        <Input
          value={formData.name || analysisResult?.name}
          onChange={(e) => onFormDataChange({ name: e.target.value })}
          className="bg-gray-50 border-gray-200 focus:border-blue-400 rounded-xl text-base py-3"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Marka</label>
        <Input
          value={formData.brand}
          onChange={(e) => onFormDataChange({ brand: e.target.value })}
          placeholder={analysisResult?.suggestedBrand ? `Önerilen: ${analysisResult.suggestedBrand}` : "Marka girin"}
          className="bg-gray-50 border-gray-200 focus:border-blue-400 rounded-xl text-base py-3"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Kategori</label>
          <Input
            value={formData.category || analysisResult?.category}
            onChange={(e) => onFormDataChange({ category: e.target.value })}
            className="bg-gray-50 border-gray-200 rounded-xl text-base py-3"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Renk</label>
          <Input
            value={formData.primaryColor || analysisResult?.primaryColor}
            onChange={(e) => onFormDataChange({ primaryColor: e.target.value })}
            className="bg-gray-50 border-gray-200 rounded-xl text-base py-3"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Stil Etiketleri</label>
        <Input
          value={formData.tags || analysisResult?.tags?.join(', ')}
          onChange={(e) => onFormDataChange({ tags: e.target.value })}
          className="bg-gray-50 border-gray-200 rounded-xl text-base py-3"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Kişisel Notlar (İsteğe Bağlı)</label>
        <Textarea
          value={formData.notes}
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
