-- =============================================
-- Migration: Add Venue Profile Management Fields
-- Date: 2024-01-07
-- Purpose: Add missing fields for comprehensive venue profile management
-- =============================================

-- Add missing columns
ALTER TABLE vendors 
ADD COLUMN IF NOT EXISTS street_address TEXT,
ADD COLUMN IF NOT EXISTS venue_type TEXT;

-- Add index for venue type filtering
CREATE INDEX IF NOT EXISTS idx_vendors_venue_type ON vendors(venue_type) WHERE category = 'venue';

-- Add comments for documentation
COMMENT ON COLUMN vendors.street_address IS 'Full street address of the venue';
COMMENT ON COLUMN vendors.venue_type IS 'Specific venue category from the 37-type taxonomy';
COMMENT ON COLUMN vendors.service_zipcodes IS 'Array of ZIP codes the business serves';

-- Verify the columns were added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'vendors' 
AND column_name IN ('street_address', 'venue_type', 'service_zipcodes')
ORDER BY column_name;
