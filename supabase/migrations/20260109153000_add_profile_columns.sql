
-- Add missing columns to profiles table

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS stress_level INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS budget_tier TEXT,
ADD COLUMN IF NOT EXISTS style_preferences JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS wedding_date DATE,
ADD COLUMN IF NOT EXISTS guest_count INTEGER,
ADD COLUMN IF NOT EXISTS planning_pace TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS business_name TEXT,
ADD COLUMN IF NOT EXISTS couple_names TEXT;

-- Verify
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles';
