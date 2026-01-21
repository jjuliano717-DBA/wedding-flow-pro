-- Add venue-specific columns to vendors table
ALTER TABLE vendors 
ADD COLUMN IF NOT EXISTS guest_capacity INTEGER,
ADD COLUMN IF NOT EXISTS amenities TEXT[],
ADD COLUMN IF NOT EXISTS faqs JSONB,
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS contact_phone TEXT;

COMMENT ON COLUMN vendors.guest_capacity IS 'Maximum guest capacity for the venue';
COMMENT ON COLUMN vendors.amenities IS 'Array of amenities provided by the venue';
COMMENT ON COLUMN vendors.faqs IS 'JSON array of frequently asked questions';
