-- Add google_business_url column to vendors table
ALTER TABLE vendors 
ADD COLUMN IF NOT EXISTS google_business_url TEXT;

-- Add google_business_url column to venues table
ALTER TABLE venues 
ADD COLUMN IF NOT EXISTS google_business_url TEXT;

-- Verify columns were added (optional, for manual verification)
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'vendors' AND column_name = 'google_business_url';
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'venues' AND column_name = 'google_business_url';
