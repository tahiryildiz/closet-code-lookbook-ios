
-- Add missing wear_count column to clothing_items table if it doesn't exist
ALTER TABLE clothing_items ADD COLUMN IF NOT EXISTS wear_count INTEGER DEFAULT 0;

-- Enable RLS on clothing_items table
ALTER TABLE clothing_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to recreate them
DROP POLICY IF EXISTS "Users can view all clothing items" ON clothing_items;
DROP POLICY IF EXISTS "Users can insert clothing items" ON clothing_items;
DROP POLICY IF EXISTS "Users can update clothing items" ON clothing_items;
DROP POLICY IF EXISTS "Users can delete clothing items" ON clothing_items;

-- Create permissive policies for now
CREATE POLICY "Users can view all clothing items" ON clothing_items
FOR SELECT USING (true);

CREATE POLICY "Users can insert clothing items" ON clothing_items
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update clothing items" ON clothing_items
FOR UPDATE USING (true);

CREATE POLICY "Users can delete clothing items" ON clothing_items
FOR DELETE USING (true);

-- Ensure storage policies exist for clothing-images bucket
DROP POLICY IF EXISTS "Anyone can view clothing images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload clothing images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update clothing images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete clothing images" ON storage.objects;

CREATE POLICY "Anyone can view clothing images" ON storage.objects
FOR SELECT USING (bucket_id = 'clothing-images');

CREATE POLICY "Anyone can upload clothing images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'clothing-images');

CREATE POLICY "Anyone can update clothing images" ON storage.objects
FOR UPDATE USING (bucket_id = 'clothing-images');

CREATE POLICY "Anyone can delete clothing images" ON storage.objects
FOR DELETE USING (bucket_id = 'clothing-images');
