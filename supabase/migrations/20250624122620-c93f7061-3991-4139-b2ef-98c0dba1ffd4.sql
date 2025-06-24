
-- Create storage bucket for outfit flatlay images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'outfit-flatlays',
  'outfit-flatlays', 
  true,
  10485760, -- 10MB limit
  ARRAY['image/png', 'image/jpeg', 'image/webp']
);

-- Create RLS policies for the outfit-flatlays bucket
CREATE POLICY "Users can upload their own outfit flatlays"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'outfit-flatlays' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own outfit flatlays"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'outfit-flatlays' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own outfit flatlays"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'outfit-flatlays' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own outfit flatlays"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'outfit-flatlays' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Add image_url column to outfits table for storing flatlay image URLs
ALTER TABLE outfits ADD COLUMN IF NOT EXISTS image_url TEXT;
