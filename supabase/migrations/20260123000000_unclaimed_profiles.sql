-- =====================================================
-- Unclaimed Venue Profiles Schema
-- =====================================================
-- This migration adds support for unclaimed venue profiles
-- that can be claimed by business owners later
-- =====================================================

-- Make owner_id nullable to support unclaimed profiles
ALTER TABLE vendors ALTER COLUMN owner_id DROP NOT NULL;

-- Add unclaimed profile tracking columns
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS is_claimed BOOLEAN DEFAULT FALSE;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS google_place_id TEXT UNIQUE;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS google_rating DECIMAL(2,1);
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS claim_token UUID DEFAULT gen_random_uuid();

-- Create index for faster lookups of unclaimed venues
CREATE INDEX IF NOT EXISTS idx_vendors_is_claimed ON vendors(is_claimed) WHERE is_claimed = FALSE;
CREATE INDEX IF NOT EXISTS idx_vendors_google_place_id ON vendors(google_place_id) WHERE google_place_id IS NOT NULL;

-- Update existing vendors to be marked as claimed
UPDATE vendors SET is_claimed = TRUE WHERE owner_id IS NOT NULL;

-- Add RLS policy for public viewing of unclaimed venues
DROP POLICY IF EXISTS "Public can view unclaimed venues" ON vendors;
CREATE POLICY "Public can view unclaimed venues" ON vendors
  FOR SELECT USING (is_claimed = FALSE OR owner_id IS NOT NULL);

-- =====================================================
-- Summary:
-- ✅ Made owner_id nullable for unclaimed profiles
-- ✅ Added is_claimed boolean tracking
-- ✅ Added google_place_id for external reference
-- ✅ Added google_rating for display
-- ✅ Added claim_token for secure claiming process
-- ✅ Created indexes for performance
-- ✅ Updated RLS policies for public access
-- =====================================================
