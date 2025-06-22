
-- Add new clothing metadata fields to clothing_items table (excluding pattern_type which already exists)
ALTER TABLE clothing_items 
ADD COLUMN waist_style text,
ADD COLUMN closure_type text,
ADD COLUMN pocket_style text,
ADD COLUMN hem_style text;

-- Add indexes for better query performance
CREATE INDEX idx_clothing_items_waist_style ON clothing_items(waist_style);
CREATE INDEX idx_clothing_items_closure_type ON clothing_items(closure_type);
CREATE INDEX idx_clothing_items_pocket_style ON clothing_items(pocket_style);
CREATE INDEX idx_clothing_items_hem_style ON clothing_items(hem_style);
