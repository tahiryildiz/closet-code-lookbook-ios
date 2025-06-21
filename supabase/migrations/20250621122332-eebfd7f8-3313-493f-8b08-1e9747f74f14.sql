
-- Enable RLS on existing tables and create proper policies
ALTER TABLE clothing_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfits ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Users can view all clothing items" ON clothing_items;
DROP POLICY IF EXISTS "Users can insert clothing items" ON clothing_items;
DROP POLICY IF EXISTS "Users can update clothing items" ON clothing_items;
DROP POLICY IF EXISTS "Users can delete clothing items" ON clothing_items;

-- Create proper RLS policies for clothing_items
CREATE POLICY "Users can view their own clothing items" ON clothing_items
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own clothing items" ON clothing_items
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clothing items" ON clothing_items
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clothing items" ON clothing_items
FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for outfits
CREATE POLICY "Users can view their own outfits" ON outfits
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own outfits" ON outfits
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own outfits" ON outfits
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own outfits" ON outfits
FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for user_profiles  
CREATE POLICY "Users can view their own profile" ON user_profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
FOR UPDATE USING (auth.uid() = id);

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$$;

-- Create trigger to automatically create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Update storage policies for clothing-images bucket
DROP POLICY IF EXISTS "Anyone can view clothing images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload clothing images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update clothing images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete clothing images" ON storage.objects;

CREATE POLICY "Authenticated users can view clothing images" ON storage.objects
FOR SELECT TO authenticated USING (bucket_id = 'clothing-images');

CREATE POLICY "Authenticated users can upload clothing images" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'clothing-images');

CREATE POLICY "Users can update their own clothing images" ON storage.objects
FOR UPDATE TO authenticated USING (bucket_id = 'clothing-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own clothing images" ON storage.objects
FOR DELETE TO authenticated USING (bucket_id = 'clothing-images' AND auth.uid()::text = (storage.foldername(name))[1]);
