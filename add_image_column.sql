
-- Add image_url column to vendors table
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS image_url text;
