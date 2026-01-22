-- =====================================================
-- RLS Performance Optimization Migration (Conservative)
-- =====================================================
-- This migration fixes performance warnings from Supabase linter by:
-- 1. Wrapping auth.uid() calls with (select auth.uid()) for init plan optimization
-- 2. Consolidating duplicate permissive policies where possible
--
-- Issue: auth.uid() was being re-evaluated for each row
-- Solution: Subquery caching - (select auth.uid()) evaluates once
-- =====================================================

-- ============== PAYMENTS ==============
DROP POLICY IF EXISTS "Users can view their own payments" ON payments;
CREATE POLICY "Users can view their own payments" ON payments
  FOR SELECT USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Vendors can view their own payments" ON payments;
CREATE POLICY "Vendors can view their own payments" ON payments
  FOR SELECT USING (
    vendor_id IN (
      SELECT id FROM vendors WHERE owner_id = (select auth.uid())
    )
  );

-- ============== PROFILES ==============
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

-- ============== FAVORITES ==============
DROP POLICY IF EXISTS "Users can view own favorites" ON favorites;
CREATE POLICY "Users can view own favorites" ON favorites
  FOR SELECT USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own favorites" ON favorites;
CREATE POLICY "Users can insert own favorites" ON favorites
  FOR INSERT WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete own favorites" ON favorites;
CREATE POLICY "Users can delete own favorites" ON favorites
  FOR DELETE USING (user_id = (select auth.uid()));

-- ============== INQUIRIES ==============
DROP POLICY IF EXISTS "Users can view own inquiries" ON inquiries;
CREATE POLICY "Users can view own inquiries" ON inquiries
  FOR SELECT USING (user_id = (select auth.uid()));

-- ============== RATE_LIMITS ==============
DROP POLICY IF EXISTS "Users can view own rate limits" ON rate_limits;
CREATE POLICY "Users can view own rate limits" ON rate_limits
  FOR SELECT USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert own rate limits" ON rate_limits;
CREATE POLICY "Users can insert own rate limits" ON rate_limits
  FOR INSERT WITH CHECK (user_id = (select auth.uid()));

-- ============== VENDORS ==============
DROP POLICY IF EXISTS "Vendors can update own listing" ON vendors;
CREATE POLICY "Vendors can update own listing" ON vendors
  FOR UPDATE USING (owner_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can read vendors by contact email" ON vendors;
CREATE POLICY "Users can read vendors by contact email" ON vendors
  FOR SELECT USING (
    contact_email = (
      SELECT email FROM auth.users WHERE id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can update their own vendor profile" ON vendors;
CREATE POLICY "Users can update their own vendor profile" ON vendors
  FOR UPDATE USING (
    contact_email = (
      SELECT email FROM auth.users WHERE id = (select auth.uid())
    )
  );

-- ============== PROJECTS ==============
-- Consolidate project policies
DROP POLICY IF EXISTS "Users can insert own projects" ON projects;
DROP POLICY IF EXISTS "Users can update own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON projects;
DROP POLICY IF EXISTS "Manage own projects" ON projects;
DROP POLICY IF EXISTS "Users can view own projects" ON projects;

CREATE POLICY "Users can manage own projects" ON projects
  FOR ALL USING (
    user_id = (select auth.uid()) OR
    client_id = (select auth.uid())
  );

-- ============== QUOTES ==============
DROP POLICY IF EXISTS "Vendors can manage their own quotes" ON quotes;
CREATE POLICY "Vendors can manage their own quotes" ON quotes
  FOR ALL USING (
    vendor_id IN (
      SELECT id FROM vendors WHERE owner_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can view quotes sent to them" ON quotes;
CREATE POLICY "Users can view quotes sent to them" ON quotes
  FOR SELECT USING (user_id = (select auth.uid()));

-- ============== INSPIRATION_ASSETS ==============
DROP POLICY IF EXISTS "Vendors can manage their own inspiration assets" ON inspiration_assets;
DROP POLICY IF EXISTS "Vendors can insert own assets" ON inspiration_assets;
DROP POLICY IF EXISTS "Vendors can manage own assets" ON inspiration_assets;

CREATE POLICY "Vendors can manage own assets" ON inspiration_assets
  FOR ALL USING (
    vendor_id IN (
      SELECT id FROM vendors WHERE owner_id = (select auth.uid())
    )
  );

-- ============== VENDOR_AVAILABILITY ==============
DROP POLICY IF EXISTS "Vendors can manage their own availability" ON vendor_availability;
CREATE POLICY "Vendors can manage their own availability" ON vendor_availability
  FOR ALL USING (
    vendor_id IN (
      SELECT id FROM vendors WHERE owner_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Couples can view vendor availability" ON vendor_availability;
CREATE POLICY "Couples can view vendor availability" ON vendor_availability
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'couple'
    )
  );

DROP POLICY IF EXISTS "Planners can view vendor availability" ON vendor_availability;
CREATE POLICY "Planners can view vendor availability" ON vendor_availability
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (select auth.uid()) AND role = 'planner'
    )
  );

-- ============== USER_SWIPES ==============
DROP POLICY IF EXISTS "Users can manage their own swipes" ON user_swipes;
CREATE POLICY "Users can manage their own swipes" ON user_swipes
  FOR ALL USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Vendors can view swipes on their assets" ON user_swipes;
CREATE POLICY "Vendors can view swipes on their assets" ON user_swipes
  FOR SELECT USING (
    asset_id IN (
      SELECT id FROM inspiration_assets 
      WHERE vendor_id IN (
        SELECT id FROM vendors WHERE owner_id = (select auth.uid())
      )
    )
  );

DROP POLICY IF EXISTS "Planners can view swipes for client projects" ON user_swipes;
CREATE POLICY "Planners can view swipes for client projects" ON user_swipes
  FOR SELECT USING (
    user_id IN (
      SELECT client_id FROM projects WHERE user_id = (select auth.uid())
    )
  );

-- ============== GUESTS ==============
DROP POLICY IF EXISTS "Users can manage own and client guests" ON guests;
CREATE POLICY "Users can manage own and client guests" ON guests
  FOR ALL USING (
    user_id = (select auth.uid()) OR
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.client_id = guests.user_id
      AND projects.user_id = (select auth.uid())
    )
  );

-- ============== CHECKLIST_ITEMS ==============
DROP POLICY IF EXISTS "Users can manage own and client checklist" ON checklist_items;
CREATE POLICY "Users can manage own and client checklist" ON checklist_items
  FOR ALL USING (
    user_id = (select auth.uid()) OR
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.client_id = checklist_items.user_id
      AND projects.user_id = (select auth.uid())
    )
  );

-- =====================================================
-- Summary of changes:
-- 
-- ✅ Fixed auth_rls_initplan warnings by wrapping auth.uid() with (select auth.uid())
-- ✅ Consolidated duplicate permissive policies into single policies
-- ✅ Only included policies for tables that definitely exist
-- 
-- Expected performance improvements:
-- - Significantly faster query performance at scale
-- - Reduced database CPU usage
-- - Eliminated redundant policy evaluations
-- =====================================================
