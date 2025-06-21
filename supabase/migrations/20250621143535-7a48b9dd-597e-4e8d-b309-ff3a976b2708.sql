
-- Add detailed metadata columns to clothing_items table
ALTER TABLE clothing_items 
ADD COLUMN fit text,
ADD COLUMN collar text,
ADD COLUMN sleeve text,
ADD COLUMN pattern text,
ADD COLUMN color_tone text,
ADD COLUMN context_tags text[],
ADD COLUMN prompt_description text;

-- Add indexes for better query performance
CREATE INDEX idx_clothing_items_fit ON clothing_items(fit);
CREATE INDEX idx_clothing_items_pattern ON clothing_items(pattern);
CREATE INDEX idx_clothing_items_context_tags ON clothing_items USING GIN(context_tags);
