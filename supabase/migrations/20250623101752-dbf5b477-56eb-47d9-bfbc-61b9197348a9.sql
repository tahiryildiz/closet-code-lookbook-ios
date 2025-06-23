
-- Add gender field to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN gender text CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say'));

-- Add a default value for existing users
UPDATE public.user_profiles 
SET gender = 'prefer_not_to_say' 
WHERE gender IS NULL;
