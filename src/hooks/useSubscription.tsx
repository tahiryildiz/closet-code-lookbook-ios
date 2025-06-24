
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { calculateSubscriptionLimits, SubscriptionLimits } from "@/utils/subscriptionLimits";

export const useSubscription = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [limits, setLimits] = useState<SubscriptionLimits>({
    canAddItem: true,
    canGenerateOutfit: true,
    remainingItems: 5,
    remainingOutfits: 3,
    subscriptionType: 'free',
    isPremium: false
  });
  const [loading, setLoading] = useState(true);

  const checkLimits = async () => {
    if (!user) return;

    try {
      // Get user profile with subscription info
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profile) return;

      const calculatedLimits = await calculateSubscriptionLimits(user.id, profile);
      setLimits(calculatedLimits);
    } catch (error) {
      console.error('Error checking subscription limits:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUsage = async (type: 'item' | 'outfit') => {
    if (!user || limits.isPremium) return true;

    try {
      if (type === 'outfit') {
        const today = new Date().toISOString().split('T')[0];
        
        // Get current profile to calculate new generation count
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('daily_outfit_generations, last_generation_date')
          .eq('id', user.id)
          .single();

        const isToday = profile?.last_generation_date === today;
        const currentGenerations = isToday ? (profile?.daily_outfit_generations || 0) : 0;
        
        const { error } = await supabase
          .from('user_profiles')
          .update({
            daily_outfit_generations: currentGenerations + 1,
            last_generation_date: today
          })
          .eq('id', user.id);

        if (error) throw error;
      }

      await checkLimits();
      return true;
    } catch (error) {
      console.error('Error updating usage:', error);
      toast({
        title: "Hata",
        description: "Kullanım güncellenirken bir hata oluştu",
        variant: "destructive"
      });
      return false;
    }
  };

  const addAdBonus = async (type: 'items' | 'generations') => {
    if (!user || limits.isPremium) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Get current profile to calculate new bonus amounts
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('ad_bonus_items, ad_bonus_generations, last_ad_bonus_date')
        .eq('id', user.id)
        .single();

      // Reset bonuses if it's a new day
      const isToday = profile?.last_ad_bonus_date === today;
      const currentAdBonusItems = isToday ? (profile?.ad_bonus_items || 0) : 0;
      const currentAdBonusGenerations = isToday ? (profile?.ad_bonus_generations || 0) : 0;

      const updateData = type === 'items' 
        ? { 
            ad_bonus_items: Math.min(currentAdBonusItems + 3, 10), // Cap at 10
            last_ad_bonus_date: today 
          }
        : { 
            ad_bonus_generations: Math.min(currentAdBonusGenerations + 1, 5), // Cap at 5
            last_ad_bonus_date: today 
          };

      const { error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      // Refresh limits after adding bonus
      await checkLimits();
      
      toast({
        title: "Bonus Unlocked!",
        description: type === 'items' ? "+3 ürün ekleme hakkı kazandınız!" : "+1 kombin oluşturma hakkı kazandınız!",
      });
    } catch (error) {
      console.error('Error adding ad bonus:', error);
    }
  };

  useEffect(() => {
    checkLimits();
  }, [user]);

  return {
    limits,
    loading,
    checkLimits,
    updateUsage,
    addAdBonus
  };
};
