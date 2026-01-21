-- Add missing columns for venue profile management
-- This migration adds street_address and venue_type columns if they don't exist

-- Add street_address column
ALTER TABLE public.vendors 
ADD COLUMN IF NOT EXISTS street_address TEXT;

-- Add venue_type column
ALTER TABLE public.vendors 
ADD COLUMN IF NOT EXISTS venue_type TEXT;

-- Add index for venue type filtering (only for venues)
CREATE INDEX IF NOT EXISTS idx_vendors_venue_type 
ON public.vendors(venue_type) 
WHERE category = 'venue';

-- Add comments for documentation
COMMENT ON COLUMN public.vendors.street_address IS 'Physical street address of the venue/vendor';
COMMENT ON COLUMN public.vendors.venue_type IS 'Specific venue category from the 37-type taxonomy (e.g., barn, hotel, winery)';

-- Verify columns exist
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'vendors'
AND table_schema = 'public'
AND column_name IN ('street_address', 'venue_type', 'google_business_url', 'service_zipcodes')
ORDER BY column_name;
