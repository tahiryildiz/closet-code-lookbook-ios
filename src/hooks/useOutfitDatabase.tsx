
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Outfit {
  id: number;
  name: string;
  items: string[];
  item_ids?: string[];
  confidence: number;
  styling_tips: string;
  occasion?: string;
  generated_image?: string;
  reference_images?: string[];
  composition_type?: string;
  item_count?: number;
  aspect_ratio?: string;
  is_saved?: boolean;
  image_url?: string;
}

export const useOutfitDatabase = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const loadOutfits = async (): Promise<Outfit[]> => {
    if (!user) return [];

    try {
      const { data: dbOutfits, error } = await supabase
        .from('outfits')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_saved', false)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error loading outfits from database:', error);
        return [];
      }

      if (!dbOutfits || dbOutfits.length === 0) return [];

      const formattedOutfits = await Promise.all(
        dbOutfits.map(async (outfit, index) => {
          let items: string[] = [];
          let reference_images: string[] = [];
          
          if (outfit.clothing_item_ids && outfit.clothing_item_ids.length > 0) {
            const { data: itemsData } = await supabase
              .from('clothing_items')
              .select('name, image_url')
              .in('id', outfit.clothing_item_ids);

            if (itemsData) {
              items = itemsData.map(item => item.name);
              reference_images = itemsData.map(item => item.image_url).filter(Boolean);
            }
          }

          return {
            id: index + 1,
            name: outfit.name,
            items: items,
            item_ids: outfit.clothing_item_ids || [],
            confidence: 8,
            styling_tips: outfit.ai_styling_tips || '',
            occasion: outfit.occasion,
            is_saved: outfit.is_saved || false,
            reference_images: reference_images,
            generated_image: outfit.image_url || null,
            image_url: outfit.image_url || null,
            composition_type: outfit.image_url ? 'professional_flatlay_vertical' : 'reference_fallback'
          };
        })
      );

      return formattedOutfits;
    } catch (error) {
      console.error('Error in loadOutfits:', error);
      return [];
    }
  };

  const saveOutfitsToDatabase = async (outfitsData: Outfit[]): Promise<string[]> => {
    if (!user) return [];

    const savedOutfitIds: string[] = [];

    try {
      for (const outfit of outfitsData) {
        const outfitToSave = {
          user_id: user.id,
          name: outfit.name,
          clothing_item_ids: outfit.item_ids || [],
          ai_styling_tips: outfit.styling_tips,
          occasion: outfit.occasion,
          is_saved: false,
          image_url: outfit.image_url || null,
        };

        const { data, error } = await supabase
          .from('outfits')
          .insert([outfitToSave])
          .select('id')
          .single();

        if (error) {
          console.error('Error saving outfit to database:', error);
        } else if (data) {
          savedOutfitIds.push(data.id);
        }
      }

      console.log('Successfully saved outfits to database');
    } catch (error) {
      console.error('Error in saveOutfitsToDatabase:', error);
    }

    return savedOutfitIds;
  };

  const saveOutfit = async (outfitId: number, outfits: Outfit[], occasion: string, timeOfDay: string, weather: string): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Hata",
        description: "Lütfen giriş yapın",
        variant: "destructive"
      });
      return false;
    }

    try {
      const outfit = outfits.find(o => o.id === outfitId);
      if (!outfit) return false;

      const outfitToSave = {
        user_id: user.id,
        name: outfit.name,
        clothing_item_ids: outfit.item_ids || [],
        ai_styling_tips: outfit.styling_tips,
        occasion: outfit.occasion || occasion,
        time_of_day: timeOfDay,
        weather_type: weather,
        is_saved: true,
        saved_at: new Date().toISOString(),
        image_url: outfit.image_url || null,
      };

      const { error } = await supabase
        .from('outfits')
        .insert([outfitToSave]);

      if (error) throw error;

      toast({
        title: "Başarılı!",
        description: "Kombin kaydedildi!",
      });

      return true;
    } catch (error) {
      console.error('Error saving outfit:', error);
      toast({
        title: "Hata",
        description: "Kombin kaydedilemedi",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    loadOutfits,
    saveOutfitsToDatabase,
    saveOutfit
  };
};
