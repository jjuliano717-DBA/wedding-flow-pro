-- Database Schema Verification Script
-- Run this in Supabase SQL Editor to check if your schema is correct

-- =============================================
-- 1. CHECK VENDORS TABLE STRUCTURE
-- =============================================
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'vendors' 
ORDER BY ordinal_position;

-- Expected columns:
-- - id (uuid)
-- - owner_id (uuid, nullable)
-- - name (text, NOT NULL)  ← Should be 'name', not 'business_name'
-- - contact_email (text, nullable)
-- - contact_phone (text, nullable)
-- - category (text, nullable)
-- - type (text, nullable)
-- - location (text, nullable)
-- - description (text, nullable)
-- - website (text, nullable)
-- - image_url (text, nullable)
-- - created_at (timestamptz, NOT NULL)
-- - updated_at (timestamptz, NOT NULL)  ← This must exist!

-- =============================================
-- 2. CHECK IF TRIGGER EXISTS
-- =============================================
SELECT 
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'vendors'
  AND trigger_name = 'update_vendors_updated_at';

-- Expected: One row showing the trigger exists

-- =============================================
-- 3. CHECK IF TRIGGER FUNCTION EXISTS
-- =============================================
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_name = 'update_updated_at_column'
  AND routine_schema = 'public';

-- Expected: One row showing the function exists

-- =============================================
-- 4. TEST UPDATE (DRY RUN)
-- =============================================
-- This will show if the update would work without actually changing data
EXPLAIN (VERBOSE, FORMAT TEXT)
UPDATE vendors 
SET name = 'Test Update'
WHERE id = (SELECT id FROM vendors LIMIT 1);

-- If this fails, the trigger is broken

-- =============================================
-- 5. CHECK FLORA GROVES FARM PROFILE
-- =============================================
SELECT 
  id,
  name,
  contact_email,
  contact_phone,
  owner_id,
  category,
  location,
  description,
  website
FROM vendors
WHERE contact_email = 'venue@demo.com'
   OR name ILIKE '%flora%groves%';

-- Expected: Should show the Flora Groves Farm profile

-- =============================================
-- RESULTS INTERPRETATION
-- =============================================
-- ✅ If all queries return expected results: Schema is correct!
-- ❌ If column 'updated_at' is missing: Run the fix from walkthrough.md
-- ❌ If column is 'business_name' not 'name': Run the fix from walkthrough.md
-- ❌ If trigger doesn't exist: Run the fix from walkthrough.md
-- ❌ If function doesn't exist: Run the fix from walkthrough.md
