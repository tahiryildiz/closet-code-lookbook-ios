
-- Add subscription_type field to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN subscription_type text DEFAULT 'free' CHECK (subscription_type IN ('free', 'monthly', 'yearly'));

-- Add usage tracking fields for free users
ALTER TABLE public.user_profiles 
ADD COLUMN daily_outfit_generations integer DEFAULT 0,
ADD COLUMN last_generation_date date DEFAULT CURRENT_DATE,
ADD COLUMN ad_bonus_items integer DEFAULT 0,
ADD COLUMN ad_bonus_generations integer DEFAULT 0,
ADD COLUMN last_ad_bonus_date date DEFAULT CURRENT_DATE;

-- Update existing users to have 'free' subscription by default
UPDATE public.user_profiles 
SET subscription_type = 'free' 
WHERE subscription_type IS NULL;
