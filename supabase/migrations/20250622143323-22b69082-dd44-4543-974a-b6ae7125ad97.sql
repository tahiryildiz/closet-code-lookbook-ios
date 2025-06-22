
-- Add design_details field to the clothing_items table
ALTER TABLE public.clothing_items 
ADD COLUMN IF NOT EXISTS design_details text[];

-- Update existing records to have default values for new field
UPDATE public.clothing_items 
SET design_details = COALESCE(design_details, '{}')
WHERE design_details IS NULL;
