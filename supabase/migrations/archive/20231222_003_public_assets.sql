-- =============================================
-- Migration: Make Inspiration Assets Publicly Viewable
-- Date: 2023-12-22
-- =============================================

-- Drop the restrictive policy
DROP POLICY IF EXISTS "Couples can view all inspiration assets" ON inspiration_assets;
DROP POLICY IF EXISTS "Planners can view all inspiration assets" ON inspiration_assets;

-- Create a new public policy
CREATE POLICY "Anyone can view inspiration assets"
    ON inspiration_assets FOR SELECT
    USING (true);

-- Also ensure anyone can view vendors (already exists but for safety)
DROP POLICY IF EXISTS "Anyone can view vendors" ON vendors;
CREATE POLICY "Anyone can view vendors"
    ON vendors FOR SELECT
    USING (true);
