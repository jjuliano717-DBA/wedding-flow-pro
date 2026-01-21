-- =============================================
-- Validation & Testing Queries
-- =============================================

-- =============================================
-- 1. VERIFY TABLE CREATION
-- =============================================

-- Check all new tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'inspiration_assets',
    'vendor_availability',
    'user_swipes',
    'budget_slots',
    'budget_candidates'
)
ORDER BY table_name;

-- =============================================
-- 2. VERIFY ENUMS
-- =============================================

-- Check all enums are created
SELECT typname 
FROM pg_type 
WHERE typname IN (
    'asset_category_tag',
    'cost_model_type',
    'availability_reason',
    'swipe_direction',
    'budget_slot_status'
)
ORDER BY typname;

-- =============================================
-- 3. VERIFY RLS IS ENABLED
-- =============================================

SELECT 
    schemaname,
    tablename,
    rowsecurity AS rls_enabled
FROM pg_tables
WHERE tablename IN (
    'inspiration_assets',
    'vendor_availability',
    'user_swipes',
    'budget_slots',
    'budget_candidates'
)
ORDER BY tablename;

-- =============================================
-- 4. VERIFY RLS POLICIES
-- =============================================

SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE tablename IN (
    'inspiration_assets',
    'vendor_availability',
    'user_swipes',
    'budget_slots',
    'budget_candidates'
)
ORDER BY tablename, policyname;

-- =============================================
-- 5. TEST RLS POLICIES (Run as different user roles)
-- =============================================

-- 5.1 Test Vendor Cannot Modify Another Vendor's Availability
-- Set up: Assume you're logged in as VENDOR_USER_1 (owns VENDOR_ID_1)
-- This should FAIL:
/*
INSERT INTO vendor_availability (vendor_id, blocked_date, reason)
VALUES ('VENDOR_ID_2', '2024-12-25', 'BOOKED');
-- Expected: No rows affected (blocked by RLS)
*/

-- This should SUCCEED:
/*
INSERT INTO vendor_availability (vendor_id, blocked_date, reason)
VALUES ('VENDOR_ID_1', '2024-12-25', 'UNAVAILABLE');
-- Expected: 1 row inserted
*/

-- 5.2 Test Couple Can View But Not Modify Vendor Availability
-- Set up: Assume you're logged in as COUPLE_USER
-- This should SUCCEED (read-only):
/*
SELECT * FROM vendor_availability;
-- Expected: Returns all rows
*/

-- This should FAIL:
/*
INSERT INTO vendor_availability (vendor_id, blocked_date, reason)
VALUES ('VENDOR_ID_1', '2025-01-01', 'BOOKED');
-- Expected: No rows affected (blocked by RLS)
*/

-- =============================================
-- 6. VERIFY FOREIGN KEY RELATIONSHIPS
-- =============================================

SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_name IN (
    'inspiration_assets',
    'vendor_availability',
    'user_swipes',
    'budget_slots',
    'budget_candidates'
)
ORDER BY tc.table_name, kcu.column_name;

-- =============================================
-- 7. VERIFY INDEXES
-- =============================================

SELECT
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename IN (
    'inspiration_assets',
    'vendor_availability',
    'user_swipes',
    'budget_slots',
    'budget_candidates'
)
ORDER BY tablename, indexname;

-- =============================================
-- 8. VERIFY TRIGGERS
-- =============================================

SELECT
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE event_object_table IN (
    'inspiration_assets',
    'vendor_availability',
    'budget_slots',
    'budget_candidates'
)
ORDER BY event_object_table, trigger_name;

-- =============================================
-- 9. SAMPLE ANALYTICS QUERIES
-- =============================================

-- 9.1 Vendor Analytics: Swipe performance by asset
SELECT
    ia.vendor_id,
    ia.category_tag,
    ia.id AS asset_id,
    COUNT(*) AS total_swipes,
    SUM(CASE WHEN us.swipe_direction = 'RIGHT' THEN 1 ELSE 0 END) AS right_swipes,
    SUM(CASE WHEN us.swipe_direction = 'SUPER_LIKE' THEN 1 ELSE 0 END) AS super_likes,
    SUM(CASE WHEN us.swipe_direction = 'LEFT' THEN 1 ELSE 0 END) AS left_swipes,
    ROUND(
        100.0 * SUM(CASE WHEN us.swipe_direction IN ('RIGHT', 'SUPER_LIKE') THEN 1 ELSE 0 END) / COUNT(*),
        2
    ) AS engagement_rate_pct
FROM inspiration_assets ia
LEFT JOIN user_swipes us ON ia.id = us.asset_id
GROUP BY ia.vendor_id, ia.category_tag, ia.id
ORDER BY engagement_rate_pct DESC NULLS LAST;

-- 9.2 Check vendor availability for a specific date range
SELECT
    v.id AS vendor_id,
    v.business_name,
    va.blocked_date,
    va.reason,
    va.notes
FROM vendors v
LEFT JOIN vendor_availability va ON v.id = va.vendor_id
WHERE va.blocked_date BETWEEN '2024-06-01' AND '2024-08-31'
ORDER BY va.blocked_date, v.business_name;

-- 9.3 Budget slot utilization
SELECT
    bs.project_id,
    bs.category,
    bs.target_budget / 100.0 AS target_budget_dollars,
    bs.status,
    COUNT(bc.id) AS num_candidates,
    SUM(CASE WHEN bc.is_selected THEN 1 ELSE 0 END) AS num_selected,
    MIN(bc.calculated_total_real) / 100.0 AS min_cost_dollars,
    MAX(bc.calculated_total_real) / 100.0 AS max_cost_dollars,
    AVG(bc.calculated_total_real) / 100.0 AS avg_cost_dollars
FROM budget_slots bs
LEFT JOIN budget_candidates bc ON bs.id = bc.slot_id
GROUP BY bs.id, bs.project_id, bs.category, bs.target_budget, bs.status
ORDER BY bs.project_id, bs.category;

-- =============================================
-- 10. RLS POLICY TEST HELPER QUERIES
-- =============================================

-- Get current user's role
SELECT 
    auth.uid() AS current_user_id,
    p.role AS current_role
FROM profiles p
WHERE p.id = auth.uid();

-- Get vendor ID for current user (if vendor)
SELECT 
    v.id AS vendor_id,
    v.business_name
FROM vendors v
WHERE v.user_id = auth.uid();

-- =============================================
-- VALIDATION CHECKLIST
-- =============================================

/*
Run these checks to verify successful migration:

□ All 5 tables created (Query #1)
□ All 5 enums created (Query #2)
□ RLS enabled on all tables (Query #3)
□ At least 3 policies per table (Query #4)
□ Foreign keys properly set up (Query #6)
□ Indexes created for performance (Query #7)
□ Updated_at triggers active (Query #8)

RLS Testing (requires test users):
□ Vendor can only modify their own availability
□ Vendor cannot modify another vendor's availability
□ Couple can view but not modify vendor availability
□ Planner can view all data
□ Users can only see their own swipes
□ Vendors can view swipes on their own assets

Data Integrity:
□ base_cost_high >= base_cost_low
□ All cost values >= 0
□ min_service_fee_pct between 0 and 1
□ Unique constraint on (vendor_id, blocked_date)
□ Unique constraint on (user_id, asset_id, project_id)
*/

-- =============================================
-- CLEANUP QUERIES (if needed for rollback)
-- =============================================

/*
-- DANGER: Only run these if you need to completely rollback the migration

DROP TABLE IF EXISTS budget_candidates CASCADE;
DROP TABLE IF EXISTS budget_slots CASCADE;
DROP TABLE IF EXISTS user_swipes CASCADE;
DROP TABLE IF EXISTS vendor_availability CASCADE;
DROP TABLE IF EXISTS inspiration_assets CASCADE;

DROP TYPE IF EXISTS budget_slot_status;
DROP TYPE IF EXISTS swipe_direction;
DROP TYPE IF EXISTS availability_reason;
DROP TYPE IF EXISTS cost_model_type;
DROP TYPE IF EXISTS asset_category_tag;

DROP FUNCTION IF EXISTS update_updated_at_column();
*/
