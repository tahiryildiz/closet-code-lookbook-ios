
import { useState } from "react";
import { X, Camera, Upload, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddItemModal = ({ isOpen, onClose }: AddItemModalProps) => {
  const [step, setStep] = useState<'upload' | 'details'>('upload');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleImageUpload = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setAnalysisResult({
        name: "Navy Blue Wool Blazer",
        category: "outerwear",
        primaryColor: "Navy Blue",
        suggestedBrand: "Hugo Boss",
        tags: ["formal", "business", "wool", "structured"],
        confidence: 94
      });
      setIsAnalyzing(false);
      setStep('details');
    }, 3000);
  };

  const handleSave = () => {
    // Save item logic here
    onClose();
    setStep('upload');
    setAnalysisResult(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-md border-rose-200">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-rose-500" />
            <span>Add New Item</span>
          </DialogTitle>
        </DialogHeader>

        {step === 'upload' && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Take a photo or upload an image of your clothing item. 
                Our AI will automatically analyze and categorize it for you!
              </p>
            </div>

            <div className="space-y-4">
              <Card className="border-2 border-dashed border-rose-200 hover:border-rose-300 transition-colors cursor-pointer">
                <CardContent className="p-8 text-center">
                  <Camera className="h-12 w-12 text-rose-400 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">Take Photo</h3>
                  <p className="text-sm text-gray-500">Use your camera to capture the item</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-dashed border-rose-200 hover:border-rose-300 transition-colors cursor-pointer">
                <CardContent className="p-8 text-center">
                  <Upload className="h-12 w-12 text-rose-400 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">Upload Image</h3>
                  <p className="text-sm text-gray-500">Choose from your photo library</p>
                </CardContent>
              </Card>
            </div>

            <Button 
              onClick={handleImageUpload}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
            >
              Continue with Demo Image
            </Button>
          </div>
        )}

        {step === 'details' && (
          <div className="space-y-6">
            {isAnalyzing ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-rose-500 border-t-transparent mx-auto mb-4"></div>
                <h3 className="font-medium text-gray-900 mb-2">Analyzing your item...</h3>
                <p className="text-sm text-gray-500">Our AI is identifying the category, color, and style</p>
              </div>
            ) : analysisResult && (
              <>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">AI Analysis Complete ({analysisResult.confidence}% confidence)</span>
                  </div>
                  <p className="text-sm text-green-700">We've automatically filled in the details below. Feel free to make any adjustments!</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                    <Input
                      defaultValue={analysisResult.name}
                      className="bg-white/80 border-rose-200 focus:border-rose-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand (Optional)</label>
                    <Input
                      placeholder={`Suggested: ${analysisResult.suggestedBrand}`}
                      className="bg-white/80 border-rose-200 focus:border-rose-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <Input
                      defaultValue={analysisResult.category}
                      className="bg-white/80 border-rose-200 focus:border-rose-400"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                    <Input
                      defaultValue={analysisResult.primaryColor}
                      className="bg-white/80 border-rose-200 focus:border-rose-400"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                    <Input
                      defaultValue={analysisResult.tags.join(', ')}
                      className="bg-white/80 border-rose-200 focus:border-rose-400"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Personal Notes (Optional)</label>
                    <Textarea
                      placeholder="Add any personal notes about this item..."
                      className="bg-white/80 border-rose-200 focus:border-rose-400"
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep('upload')}
                    className="flex-1 border-rose-200 hover:bg-rose-50"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                  >
                    Save to Wardrobe
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddItemModal;
