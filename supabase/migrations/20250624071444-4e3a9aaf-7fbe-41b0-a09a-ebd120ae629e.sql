
-- Add columns to outfits table for saving functionality
ALTER TABLE public.outfits 
ADD COLUMN IF NOT EXISTS is_saved BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS saved_at TIMESTAMP WITH TIME ZONE;

-- Enable RLS on outfits table if not already enabled
ALTER TABLE public.outfits ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for outfits table
DROP POLICY IF EXISTS "Users can view their own outfits" ON public.outfits;
DROP POLICY IF EXISTS "Users can create their own outfits" ON public.outfits;
DROP POLICY IF EXISTS "Users can update their own outfits" ON public.outfits;
DROP POLICY IF EXISTS "Users can delete their own outfits" ON public.outfits;

CREATE POLICY "Users can view their own outfits" 
  ON public.outfits 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own outfits" 
  ON public.outfits 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own outfits" 
  ON public.outfits 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own outfits" 
  ON public.outfits 
  FOR DELETE 
  USING (auth.uid() = user_id);
