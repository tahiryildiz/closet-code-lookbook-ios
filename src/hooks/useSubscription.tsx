
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type SubscriptionType = 'free' | 'monthly' | 'yearly';

interface SubscriptionLimits {
  canAddItem: boolean;
  canGenerateOutfit: boolean;
  remainingItems: number;
  remainingOutfits: number;
  subscriptionType: SubscriptionType;
  isPremium: boolean;
}

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

      const subscriptionType = (profile.subscription_type as SubscriptionType) || 'free';
      const isPremium = subscriptionType === 'monthly' || subscriptionType === 'yearly';

      if (isPremium) {
        setLimits({
          canAddItem: true,
          canGenerateOutfit: true,
          remainingItems: -1, // unlimited
          remainingOutfits: -1, // unlimited
          subscriptionType,
          isPremium: true
        });
        return;
      }

      // For free users, check current usage
      const { count: itemCount } = await supabase
        .from('clothing_items')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      const today = new Date().toISOString().split('T')[0];
      
      // Reset daily counters if it's a new day
      let dailyGenerations = 0;
      let adBonusItems = 0;
      let adBonusGenerations = 0;
      
      if (profile.last_generation_date !== today) {
        // Reset daily outfit generations for new day
        await supabase
          .from('user_profiles')
          .update({
            daily_outfit_generations: 0,
            last_generation_date: today
          })
          .eq('id', user.id);
        dailyGenerations = 0;
      } else {
        dailyGenerations = profile.daily_outfit_generations || 0;
      }

      if (profile.last_ad_bonus_date !== today) {
        // Reset ad bonuses for new day
        await supabase
          .from('user_profiles')
          .update({
            ad_bonus_items: 0,
            ad_bonus_generations: 0,
            last_ad_bonus_date: today
          })
          .eq('id', user.id);
        adBonusItems = 0;
        adBonusGenerations = 0;
      } else {
        adBonusItems = profile.ad_bonus_items || 0;
        adBonusGenerations = profile.ad_bonus_generations || 0;
      }

      // Calculate limits
      const baseItemLimit = 5;
      const totalItemsAllowed = baseItemLimit + Math.min(adBonusItems, 10);

      const baseOutfitLimit = 3;
      const totalOutfitsAllowed = baseOutfitLimit + Math.min(adBonusGenerations, 5);

      setLimits({
        canAddItem: (itemCount || 0) < totalItemsAllowed,
        canGenerateOutfit: dailyGenerations < totalOutfitsAllowed,
        remainingItems: Math.max(0, totalItemsAllowed - (itemCount || 0)),
        remainingOutfits: Math.max(0, totalOutfitsAllowed - dailyGenerations),
        subscriptionType: 'free',
        isPremium: false
      });
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
