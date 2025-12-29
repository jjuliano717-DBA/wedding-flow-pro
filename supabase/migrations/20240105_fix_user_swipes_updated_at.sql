-- =====================================================
-- Fix: Add missing updated_at column to user_swipes table
-- File: 20240105_fix_user_swipes_updated_at.sql
-- =====================================================
--
-- Issue: user_swipes table is missing updated_at column
-- This causes the update_updated_at_column() trigger to fail
--
-- =====================================================

-- Add the missing updated_at column
ALTER TABLE user_swipes 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Verify the column was added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'user_swipes'
  AND column_name = 'updated_at';

-- Now create the trigger (if it doesn't exist)
DROP TRIGGER IF EXISTS update_user_swipes_updated_at ON user_swipes;
CREATE TRIGGER update_user_swipes_updated_at
    BEFORE UPDATE ON user_swipes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMENT ON COLUMN user_swipes.updated_at IS 'Timestamp of last update to this swipe record';
