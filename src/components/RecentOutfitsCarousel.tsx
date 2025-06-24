
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Outfit {
  id: string | number;
  name: string;
  items?: string[];
  confidence?: number;
  styling_tips: string;
  generated_image?: string;
  reference_images?: string[];
  clothing_item_ids?: string[];
}

interface RecentOutfitsCarouselProps {
  outfits: Outfit[];
}

const RecentOutfitsCarousel = ({ outfits }: RecentOutfitsCarouselProps) => {
  const navigate = useNavigate();

  if (!outfits || outfits.length === 0) return null;

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-4 px-4 pb-2" style={{ width: `${outfits.length * 200 + 32}px` }}>
        {outfits.map((outfit, index) => (
          <div
            key={outfit.id || index}
            className="flex-shrink-0 w-48"
            onClick={() => navigate('/outfits')}
          >
            <Card className="w-full bg-white border border-gray-100 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 rounded-2xl overflow-hidden group">
              <CardContent className="p-0">
                <div className="aspect-[4/5] bg-gray-50 overflow-hidden relative">
                  {outfit.generated_image && outfit.generated_image !== 'generated_image_exists' ? (
                    <img
                      src={outfit.generated_image}
                      alt={outfit.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        console.error('Failed to load generated image');
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                              <svg class="h-16 w-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                              </svg>
                            </div>
                          `;
                        }
                      }}
                    />
                  ) : outfit.reference_images && outfit.reference_images.length > 0 ? (
                    <img
                      src={outfit.reference_images[0]}
                      alt={outfit.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        console.error('Failed to load reference image');
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                              <svg class="h-16 w-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                              </svg>
                            </div>
                          `;
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                      <Sparkles className="h-16 w-16 text-blue-500" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 text-lg mb-2 leading-tight line-clamp-2">{outfit.name}</h3>
                  <p className="text-gray-500 text-sm font-medium">
                    {outfit.confidence ? `${outfit.confidence}% uyumlu` : 'Kombin'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentOutfitsCarousel;
