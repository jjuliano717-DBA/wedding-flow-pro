-- =====================================================
-- Security Fixes Migration
-- =====================================================
-- This migration fixes security-related linter errors:
-- 1. Removes SECURITY DEFINER from views (use SECURITY INVOKER instead)
-- 2. Enables RLS on backup table or drops it if not needed
-- =====================================================

-- ============== FIX SECURITY DEFINER VIEWS ==============

-- Fix vendor_performance_metrics view
-- Drop and recreate without SECURITY DEFINER (defaults to SECURITY INVOKER)
DROP VIEW IF EXISTS vendor_performance_metrics CASCADE;

CREATE VIEW vendor_performance_metrics 
WITH (security_invoker=true) AS
WITH vendor_swipes AS (
    SELECT 
        v.id AS vendor_id,
        v.name AS vendor_name,
        v.owner_id AS planner_id,
        COUNT(DISTINCT us.id) AS swipe_count,
        COUNT(DISTINCT CASE 
            WHEN us.swipe_direction IN ('RIGHT', 'SUPER_LIKE') 
            THEN us.id 
        END) AS save_count
    FROM vendors v
    LEFT JOIN inspiration_assets ia ON ia.vendor_id = v.id
    LEFT JOIN user_swipes us ON us.asset_id = ia.id
    GROUP BY v.id, v.name, v.owner_id
),
vendor_inquiries AS (
    SELECT 
        vendor_id,
        COUNT(*) AS inquiry_count,
        COUNT(CASE WHEN status = 'booked' THEN 1 END) AS booking_count
    FROM inquiries
    WHERE vendor_id IS NOT NULL
    GROUP BY vendor_id
)
SELECT 
    vs.vendor_id,
    vs.vendor_name,
    vs.planner_id,
    COALESCE(vs.swipe_count, 0) AS swipe_count,
    COALESCE(vs.save_count, 0) AS save_count,
    COALESCE(vi.inquiry_count, 0) AS inquiry_count,
    COALESCE(vi.booking_count, 0) AS booking_count,
    
    CASE 
        WHEN vs.swipe_count > 0 THEN 
            ROUND((vi.booking_count::NUMERIC / vs.swipe_count::NUMERIC * 100)::NUMERIC, 2)
        ELSE 0
    END AS look_to_book_ratio,
    
    CASE
        WHEN vs.swipe_count > 100 
             AND (vi.booking_count::NUMERIC / NULLIF(vs.swipe_count, 0)::NUMERIC) < 0.01 
        THEN 'Viral'
        
        WHEN vs.swipe_count < 50 
             AND vs.swipe_count > 0
             AND (vi.booking_count::NUMERIC / vs.swipe_count::NUMERIC) > 0.10 
        THEN 'Hidden Gem'
        
        WHEN vs.swipe_count > 100 
             AND (vi.booking_count::NUMERIC / NULLIF(vs.swipe_count, 0)::NUMERIC) > 0.05 
        THEN 'Anchor'
        
        ELSE 'Emerging'
    END AS classification,
    
    NOW() AS calculated_at
    
FROM vendor_swipes vs
LEFT JOIN vendor_inquiries vi ON vi.vendor_id = vs.vendor_id
ORDER BY booking_count DESC, swipe_count DESC;

COMMENT ON VIEW vendor_performance_metrics IS 
'Vendor analytics view with Look-to-Book ratios and classification (Viral/Hidden Gem/Anchor/Emerging). 
Use planner_id column to filter for Black Book private analytics.';

-- Fix vendor_asset_analytics view
DROP VIEW IF EXISTS vendor_asset_analytics CASCADE;

CREATE VIEW vendor_asset_analytics
WITH (security_invoker=true) AS
SELECT 
    ia.vendor_id,
    v.name,
    ia.id AS asset_id,
    ia.category_tag,
    ia.cost_model,
    COUNT(DISTINCT us.id) AS total_swipes,
    COUNT(DISTINCT CASE WHEN us.swipe_direction = 'RIGHT' THEN us.id END) AS right_swipes,
    COUNT(DISTINCT CASE WHEN us.swipe_direction = 'SUPER_LIKE' THEN us.id END) AS super_likes,
    COUNT(DISTINCT CASE WHEN us.swipe_direction = 'LEFT' THEN us.id END) AS left_swipes,
    ROUND(
        CASE 
            WHEN COUNT(DISTINCT us.id) > 0 
            THEN (COUNT(DISTINCT CASE WHEN us.swipe_direction IN ('RIGHT', 'SUPER_LIKE') THEN us.id END)::DECIMAL / COUNT(DISTINCT us.id)) * 100 
            ELSE 0 
        END, 2
    ) AS engagement_rate_pct
FROM inspiration_assets ia
JOIN vendors v ON ia.vendor_id = v.id
LEFT JOIN user_swipes us ON ia.id = us.asset_id
GROUP BY ia.vendor_id, v.name, ia.id, ia.category_tag, ia.cost_model;

COMMENT ON VIEW vendor_asset_analytics IS 'Analytics view for vendor asset engagement metrics';

GRANT SELECT ON vendor_asset_analytics TO authenticated;

-- Fix vendor_availability_calendar view
DROP VIEW IF EXISTS vendor_availability_calendar CASCADE;

CREATE VIEW vendor_availability_calendar
WITH (security_invoker=true) AS
SELECT 
    v.id AS vendor_id,
    v.name,
    va.blocked_date,
    va.reason,
    va.notes,
    CASE 
        WHEN va.reason = 'BOOKED' THEN 'Booked'
        WHEN va.reason = 'UNAVAILABLE' THEN 'Unavailable'
        ELSE 'Unknown'
    END AS status_label
FROM vendors v
LEFT JOIN vendor_availability va ON v.id = va.vendor_id
WHERE va.blocked_date >= CURRENT_DATE
ORDER BY v.name, va.blocked_date;

COMMENT ON VIEW vendor_availability_calendar IS 'Calendar view of vendor blocked dates';

GRANT SELECT ON vendor_availability_calendar TO authenticated;

-- ============== FIX RLS ON BACKUP TABLE ==============

-- Check if the backup table exists and either drop it or enable RLS
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'vendors_backup_20241224'
    ) THEN
        -- Since this is a backup table from December 2024 and we're now in January 2026,
        -- it's likely no longer needed. However, let's be safe and enable RLS rather than drop it.
        -- The user can manually drop it later if confirmed unnecessary.
        
        ALTER TABLE vendors_backup_20241224 ENABLE ROW LEVEL SECURITY;
        
        -- Add a restrictive policy - only admins can view backup data
        DROP POLICY IF EXISTS "Only admins can view backup" ON vendors_backup_20241224;
        CREATE POLICY "Only admins can view backup" ON vendors_backup_20241224
          FOR SELECT USING (
            EXISTS (
              SELECT 1 FROM profiles
              WHERE id = (select auth.uid()) AND role = 'admin'
            )
          );
        
        RAISE NOTICE 'Enabled RLS on vendors_backup_20241224 table';
    END IF;
END $$;

-- =====================================================
-- Summary of changes:
-- 
-- ✅ Fixed 3 security_definer_view warnings by recreating views with security_invoker=true
-- ✅ Fixed 1 rls_disabled_in_public warning by enabling RLS on backup table
-- 
-- Security improvements:
-- - Views now run with querying user's permissions (not creator's)
-- - Backup table can only be accessed by admins
-- - All public tables now have RLS enabled
-- =====================================================
