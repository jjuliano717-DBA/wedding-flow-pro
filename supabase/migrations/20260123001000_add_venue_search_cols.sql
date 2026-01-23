-- =====================================================
-- Add Venue Search and Status Columns
-- =====================================================
-- This migration adds columns needed for venue capacity
-- filtering and status tracking
-- =====================================================

-- Add capacity columns for venue search/filtering
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS capacity_min INTEGER;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS capacity_max INTEGER;

-- Add status tracking columns
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT TRUE;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT FALSE;

-- Create index on capacity for faster range queries
CREATE INDEX IF NOT EXISTS idx_vendors_capacity ON vendors(capacity_min, capacity_max) 
  WHERE category = 'venue';

-- Create index on active status for filtering
CREATE INDEX IF NOT EXISTS idx_vendors_active ON vendors(active) 
  WHERE active = TRUE;

-- =====================================================
-- Summary:
-- ✅ Added capacity_min and capacity_max for guest capacity filtering
-- ✅ Added active flag (default: TRUE) for availability status
-- ✅ Added verified flag (default: FALSE) for platform verification
-- ✅ Created indexes for performance on capacity and active status
-- =====================================================
