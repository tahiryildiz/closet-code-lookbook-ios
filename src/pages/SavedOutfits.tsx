
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import OutfitGrid from "@/components/OutfitGrid";

interface SavedOutfit {
  id: string;
  name: string;
  clothing_item_ids: string[];
  ai_styling_tips: string;
  occasion?: string;
  saved_at: string;
  items?: string[];
  reference_images?: string[];
  generated_image?: string;
  image_url?: string;
}

const SavedOutfits = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedOutfits = async () => {
      if (!user) return;

      try {
        // Fetch saved outfits
        const { data: outfits, error } = await supabase
          .from('outfits')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_saved', true)
          .order('saved_at', { ascending: false });

        if (error) {
          console.error('Error loading saved outfits:', error);
          return;
        }

        if (outfits && outfits.length > 0) {
          // Get actual item names and images for each outfit
          const outfitsWithItems = await Promise.all(
            outfits.map(async (outfit) => {
              if (outfit.clothing_item_ids && outfit.clothing_item_ids.length > 0) {
                const { data: items } = await supabase
                  .from('clothing_items')
                  .select('name, image_url')
                  .in('id', outfit.clothing_item_ids);

                if (items) {
                  return {
                    ...outfit,
                    items: items.map(item => item.name),
                    reference_images: items.map(item => item.image_url).filter(Boolean),
                    generated_image: outfit.image_url || null // Use stored flatlay image
                  };
                }
              }
              return {
                ...outfit,
                generated_image: outfit.image_url || null
              };
            })
          );

          setSavedOutfits(outfitsWithItems);
        }
      } catch (error) {
        console.error('Error fetching saved outfits:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedOutfits();
  }, [user]);

  // Convert SavedOutfit to Outfit format for OutfitGrid
  const formattedOutfits = savedOutfits.map(outfit => ({
    id: outfit.id,
    name: outfit.name,
    styling_tips: outfit.ai_styling_tips,
    items: outfit.items,
    reference_images: outfit.reference_images,
    clothing_item_ids: outfit.clothing_item_ids,
    occasion: outfit.occasion,
    is_saved: true,
    generated_image: outfit.generated_image || outfit.image_url // Support both field names
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 pt-14 pb-6">
            <div className="flex items-center mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-blue-500 hover:bg-blue-50 mr-3 -ml-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Kaydedilen Kombinler</h1>
                <p className="text-gray-500 text-base mt-1">Favori kombinleriniz</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-500">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 pt-14 pb-6">
          <div className="flex items-center mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-blue-500 hover:bg-blue-50 mr-3 -ml-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Kaydedilen Kombinler</h1>
              <p className="text-gray-500 text-base mt-1">
                {savedOutfits.length} favori kombin
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        <OutfitGrid outfits={formattedOutfits} />
      </div>
    </div>
  );
};

export default SavedOutfits;
