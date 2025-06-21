
-- Add is_favorite column to clothing_items table
ALTER TABLE public.clothing_items 
ADD COLUMN is_favorite boolean DEFAULT false;
