
-- First, drop the existing foreign key constraint
ALTER TABLE public.user_profiles 
DROP CONSTRAINT IF EXISTS user_profiles_id_fkey;

-- Recreate the foreign key constraint with CASCADE DELETE
ALTER TABLE public.user_profiles 
ADD CONSTRAINT user_profiles_id_fkey 
FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
