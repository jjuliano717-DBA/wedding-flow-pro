-- =====================================================
-- Run this SQL directly in Supabase SQL Editor
-- to fix all RLS performance warnings
-- =====================================================

-- ============== INSPIRATION_ASSETS ==============
-- Remove FOR ALL policy, create specific policies

DROP POLICY IF EXISTS "Vendors can manage their own inspiration assets" ON inspiration_assets;
DROP POLICY IF EXISTS "Vendors can insert their own inspiration assets" ON inspiration_assets;
DROP POLICY IF EXISTS "Vendors can update their own inspiration assets" ON inspiration_assets;
DROP POLICY IF EXISTS "Vendors can delete their own inspiration assets" ON inspiration_assets;

CREATE POLICY "Vendors can insert their own inspiration assets" ON inspiration_assets
  FOR INSERT WITH CHECK (
    vendor_id IN (SELECT id FROM vendors WHERE owner_id = (SELECT auth.uid()))
  );

CREATE POLICY "Vendors can update their own inspiration assets" ON inspiration_assets
  FOR UPDATE USING (
    vendor_id IN (SELECT id FROM vendors WHERE owner_id = (SELECT auth.uid()))
  );

CREATE POLICY "Vendors can delete their own inspiration assets" ON inspiration_assets
  FOR DELETE USING (
    vendor_id IN (SELECT id FROM vendors WHERE owner_id = (SELECT auth.uid()))
  );

-- ============== PROFILES ==============
-- Consolidate admin + user policies

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (
    id = (SELECT auth.uid()) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin')
  );

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (
    id = (SELECT auth.uid()) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin')
  );

CREATE POLICY "Users can delete own profile" ON profiles
  FOR DELETE USING (
    id = (SELECT auth.uid()) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin')
  );

-- ============== VENDORS ==============
-- Remove redundant policy

DROP POLICY IF EXISTS "Public can view unclaimed venues" ON vendors;

-- ================================================
-- VERIFICATION: Run this to check for duplicates
-- ================================================
/*
SELECT tablename, cmd, COUNT(*) as count
FROM pg_policies 
WHERE schemaname = 'public'
  AND tablename IN ('inspiration_assets', 'profiles', 'vendors')
GROUP BY tablename, cmd
HAVING COUNT(*) > 1;
*/

-- Expected: 0 rows (no duplicates)
