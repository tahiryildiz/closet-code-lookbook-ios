
-- Add missing detailed attribute columns to the clothing_items table
ALTER TABLE public.clothing_items 
ADD COLUMN IF NOT EXISTS neckline text,
ADD COLUMN IF NOT EXISTS lapel_style text,
ADD COLUMN IF NOT EXISTS has_lining boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS button_count text,
ADD COLUMN IF NOT EXISTS accessories text[],
ADD COLUMN IF NOT EXISTS image_description text,
ADD COLUMN IF NOT EXISTS confidence integer,
ADD COLUMN IF NOT EXISTS cuff_style text;

-- Update existing records to have default values for new fields
UPDATE public.clothing_items 
SET 
  neckline = COALESCE(neckline, 'Unknown'),
  lapel_style = COALESCE(lapel_style, 'Not Applicable'),
  has_lining = COALESCE(has_lining, false),
  button_count = COALESCE(button_count, 'Unknown'),
  accessories = COALESCE(accessories, '{}'),
  image_description = COALESCE(image_description, ''),
  confidence = COALESCE(confidence, 0),
  cuff_style = COALESCE(cuff_style, 'None')
WHERE 
  neckline IS NULL OR 
  lapel_style IS NULL OR 
  has_lining IS NULL OR 
  button_count IS NULL OR 
  accessories IS NULL OR 
  image_description IS NULL OR 
  confidence IS NULL OR 
  cuff_style IS NULL;
