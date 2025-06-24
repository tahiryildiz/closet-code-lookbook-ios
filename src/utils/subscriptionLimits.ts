
import { supabase } from "@/integrations/supabase/client";

export type SubscriptionType = 'free' | 'monthly' | 'yearly';

export interface SubscriptionLimits {
  canAddItem: boolean;
  canGenerateOutfit: boolean;
  remainingItems: number;
  remainingOutfits: number;
  subscriptionType: SubscriptionType;
  isPremium: boolean;
}

export const calculateSubscriptionLimits = async (
  userId: string,
  userProfile: any
): Promise<SubscriptionLimits> => {
  const subscriptionType = (userProfile.subscription_type as SubscriptionType) || 'free';
  const isPremium = subscriptionType === 'monthly' || subscriptionType === 'yearly';

  if (isPremium) {
    return {
      canAddItem: true,
      canGenerateOutfit: true,
      remainingItems: -1, // unlimited
      remainingOutfits: -1, // unlimited
      subscriptionType,
      isPremium: true
    };
  }

  // For free users, check current usage
  const { count: itemCount } = await supabase
    .from('clothing_items')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  const today = new Date().toISOString().split('T')[0];
  
  // Handle daily resets and get current counters
  const { dailyGenerations, adBonusItems, adBonusGenerations } = await handleDailyResets(
    userId, 
    userProfile, 
    today
  );

  // Calculate limits
  const baseItemLimit = 5;
  const totalItemsAllowed = baseItemLimit + Math.min(adBonusItems, 10);

  const baseOutfitLimit = 3;
  const totalOutfitsAllowed = baseOutfitLimit + Math.min(adBonusGenerations, 5);

  return {
    canAddItem: (itemCount || 0) < totalItemsAllowed,
    canGenerateOutfit: dailyGenerations < totalOutfitsAllowed,
    remainingItems: Math.max(0, totalItemsAllowed - (itemCount || 0)),
    remainingOutfits: Math.max(0, totalOutfitsAllowed - dailyGenerations),
    subscriptionType: 'free',
    isPremium: false
  };
};

const handleDailyResets = async (
  userId: string,
  profile: any,
  today: string
) => {
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
      .eq('id', userId);
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
      .eq('id', userId);
    adBonusItems = 0;
    adBonusGenerations = 0;
  } else {
    adBonusItems = profile.ad_bonus_items || 0;
    adBonusGenerations = profile.ad_bonus_generations || 0;
  }

  return { dailyGenerations, adBonusItems, adBonusGenerations };
};
