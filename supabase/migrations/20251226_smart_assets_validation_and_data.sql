-- =============================================
-- Migration: Smart Assets Validation & Enhanced Data
-- Date: 2025-12-26
-- Purpose: Validate existing schema, add dummy data, and verify RLS
-- =============================================

-- =============================================
-- 1. VERIFY SCHEMA EXISTS
-- =============================================

DO $$
BEGIN
    -- Check if all required tables exist
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'inspiration_assets') THEN
        RAISE EXCEPTION 'Table inspiration_assets does not exist. Run base migration first.';
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'vendor_availability') THEN
        RAISE EXCEPTION 'Table vendor_availability does not exist. Run base migration first.';
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'user_swipes') THEN
        RAISE EXCEPTION 'Table user_swipes does not exist. Run base migration first.';
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'budget_slots') THEN
        RAISE EXCEPTION 'Table budget_slots does not exist. Run base migration first.';
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'budget_candidates') THEN
        RAISE EXCEPTION 'Table budget_candidates does not exist. Run base migration first.';
    END IF;
    
    RAISE NOTICE 'All required tables exist. Proceeding with data insertion.';
END $$;

-- =============================================
-- 2. INSERT DUMMY DATA
-- =============================================

-- First, let's find or create a test vendor
DO $$
DECLARE
    test_vendor_id UUID;
    test_user_id UUID;
    test_project_id UUID;
    asset1_id UUID;
    asset2_id UUID;
    asset3_id UUID;
    slot1_id UUID;
BEGIN
    -- Get or create a test vendor user
    SELECT id INTO test_user_id FROM profiles WHERE email = 'vendor_user@example.com' LIMIT 1;
    
    IF test_user_id IS NULL THEN
        RAISE NOTICE 'Test vendor user not found. Please create vendor_user@example.com first.';
        RETURN;
    END IF;
    
    -- Get or create vendor profile for this user
    SELECT id INTO test_vendor_id FROM vendors WHERE owner_id = test_user_id LIMIT 1;
    
    IF test_vendor_id IS NULL THEN
        -- Create a vendor profile
        INSERT INTO vendors (owner_id, name, category, active, verified)
        VALUES (test_user_id, 'Dream Florals Co.', 'Florist', true, true)
        RETURNING id INTO test_vendor_id;
        
        RAISE NOTICE 'Created vendor profile: %', test_vendor_id;
    END IF;
    
    -- Get or create a test project (for couple testing)
    SELECT id INTO test_user_id FROM profiles WHERE role = 'couple' LIMIT 1;
    
    IF test_user_id IS NOT NULL THEN
        SELECT id INTO test_project_id FROM projects WHERE user_id = test_user_id LIMIT 1;
        
        IF test_project_id IS NULL THEN
            INSERT INTO projects (user_id, wedding_date, guest_count, total_budget)
            VALUES (test_user_id, '2025-08-15', 150, 3500000) -- $35,000 budget
            RETURNING id INTO test_project_id;
            
            RAISE NOTICE 'Created test project: %', test_project_id;
        END IF;
    END IF;
    
    -- =============================================
    -- 2.1 INSERT INSPIRATION ASSETS
    -- =============================================
    
    -- Asset 1: Luxury Floral Centerpiece
    INSERT INTO inspiration_assets (
        vendor_id, image_url, category_tag, cost_model, 
        base_cost_low, base_cost_high, min_service_fee_pct
    ) VALUES (
        test_vendor_id,
        'https://images.unsplash.com/photo-1519225421980-715cb0215aed',
        'Floral',
        'per_guest',
        1200, -- $12.00 per guest
        2500, -- $25.00 per guest
        0.200 -- 20% service fee
    ) RETURNING id INTO asset1_id;
    
    -- Asset 2: Venue Setup Package
    INSERT INTO inspiration_assets (
        vendor_id, image_url, category_tag, cost_model, 
        base_cost_low, base_cost_high, min_service_fee_pct
    ) VALUES (
        test_vendor_id,
        'https://images.unsplash.com/photo-1519167758481-83f550bb49b3',
        'Venue',
        'flat_fee',
        500000, -- $5,000 flat
        1000000, -- $10,000 flat
        0.150 -- 15% service fee
    ) RETURNING id INTO asset2_id;
    
    -- Asset 3: Catering Service
    INSERT INTO inspiration_assets (
        vendor_id, image_url, category_tag, cost_model, 
        base_cost_low, base_cost_high, min_service_fee_pct
    ) VALUES (
        test_vendor_id,
        'https://images.unsplash.com/photo-1555244162-803834f70033',
        'Catering',
        'per_guest',
        5000, -- $50 per guest
        15000, -- $150 per guest
        0.180 -- 18% service fee (gratuity)
    ) RETURNING id INTO asset3_id;
    
    RAISE NOTICE 'Inserted 3 inspiration assets';
    
    -- =============================================
    -- 2.2 INSERT VENDOR AVAILABILITY
    -- =============================================
    
    -- Block some critical dates in 2025
    INSERT INTO vendor_availability (vendor_id, blocked_date, reason, notes)
    VALUES 
        (test_vendor_id, '2025-06-15', 'BOOKED', 'Johnson Wedding'),
        (test_vendor_id, '2025-07-04', 'UNAVAILABLE', 'Holiday - Independence Day'),
        (test_vendor_id, '2025-08-20', 'BOOKED', 'Smith Wedding'),
        (test_vendor_id, '2025-09-01', 'BOOKED', 'Davis Wedding'),
        (test_vendor_id, '2025-12-25', 'UNAVAILABLE', 'Holiday - Christmas')
    ON CONFLICT (vendor_id, blocked_date) DO NOTHING;
    
    RAISE NOTICE 'Inserted vendor availability blocks';
    
    -- =============================================
    -- 2.3 INSERT USER SWIPES (if test project exists)
    -- =============================================
    
    IF test_project_id IS NOT NULL AND test_user_id IS NOT NULL THEN
        -- Couple loves the floral centerpiece
        INSERT INTO user_swipes (user_id, project_id, asset_id, swipe_direction)
        VALUES (test_user_id, test_project_id, asset1_id, 'SUPER_LIKE')
        ON CONFLICT (user_id, asset_id, project_id) DO NOTHING;
        
        -- Couple likes the venue
        INSERT INTO user_swipes (user_id, project_id, asset_id, swipe_direction)
        VALUES (test_user_id, test_project_id, asset2_id, 'RIGHT')
        ON CONFLICT (user_id, asset_id, project_id) DO NOTHING;
        
        -- Couple is unsure about catering
        INSERT INTO user_swipes (user_id, project_id, asset_id, swipe_direction)
        VALUES (test_user_id, test_project_id, asset3_id, 'LEFT')
        ON CONFLICT (user_id, asset_id, project_id) DO NOTHING;
        
        RAISE NOTICE 'Inserted user swipes for test project';
    END IF;
    
    -- =============================================
    -- 2.4 INSERT BUDGET SLOTS & CANDIDATES
    -- =============================================
    
    IF test_project_id IS NOT NULL THEN
        -- Create a floral budget slot
        INSERT INTO budget_slots (project_id, category, target_budget, status)
        VALUES (test_project_id, 'Floral', 300000, 'DRAFTING') -- $3,000 target
        RETURNING id INTO slot1_id;
        
        -- Add the floral asset as a candidate
        -- Calculate: 150 guests * $18.50 avg = $2,775 pretax
        -- Add 20% service fee + 8% tax = $3,553.20 total
        INSERT INTO budget_candidates (
            slot_id, source_asset_id, 
            calculated_cost_pretax, calculated_total_real, 
            is_selected, notes
        ) VALUES (
            slot1_id, asset1_id,
            277500, -- $2,775 pretax (150 guests * avg cost)
            415125, -- $4,151.25 with service fee and tax
            true, -- Selected option
            'Stunning centerpieces, matches theme perfectly'
        );
        
        RAISE NOTICE 'Inserted budget slot and candidate for Floral category';
    END IF;
    
    RAISE NOTICE '=== DUMMY DATA INSERTION COMPLETE ===';
END $$;

-- =============================================
-- 3. VALIDATION QUERIES
-- =============================================

-- 3.1 Count records in each table
DO $$
DECLARE
    asset_count INT;
    avail_count INT;
    swipe_count INT;
    slot_count INT;
    candidate_count INT;
BEGIN
    SELECT COUNT(*) INTO asset_count FROM inspiration_assets;
    SELECT COUNT(*) INTO avail_count FROM vendor_availability;
    SELECT COUNT(*) INTO swipe_count FROM user_swipes;
    SELECT COUNT(*) INTO slot_count FROM budget_slots;
    SELECT COUNT(*) INTO candidate_count FROM budget_candidates;
    
    RAISE NOTICE 'Record counts:';
    RAISE NOTICE '  - Inspiration Assets: %', asset_count;
    RAISE NOTICE '  - Vendor Availability: %', avail_count;
    RAISE NOTICE '  - User Swipes: %', swipe_count;
    RAISE NOTICE '  - Budget Slots: %', slot_count;
    RAISE NOTICE '  - Budget Candidates: %', candidate_count;
END $$;

-- =============================================
-- 4. RLS POLICY VALIDATION
-- =============================================

-- Verify RLS is enabled on all tables
DO $$
DECLARE
    rls_check RECORD;
BEGIN
    FOR rls_check IN 
        SELECT tablename, rowsecurity 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename IN (
            'inspiration_assets', 
            'vendor_availability', 
            'user_swipes', 
            'budget_slots', 
            'budget_candidates'
        )
    LOOP
        IF rls_check.rowsecurity THEN
            RAISE NOTICE 'RLS ENABLED: %', rls_check.tablename;
        ELSE
            RAISE WARNING 'RLS DISABLED: %', rls_check.tablename;
        END IF;
    END LOOP;
END $$;

-- List all RLS policies for our tables
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
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
-- 5. HELPFUL VIEWS FOR VENDOR ANALYTICS
-- =============================================

-- View: Vendor Asset Performance
CREATE OR REPLACE VIEW vendor_asset_analytics AS
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

-- View: Vendor Availability Calendar
CREATE OR REPLACE VIEW vendor_availability_calendar AS
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

-- =============================================
-- 6. GRANT PERMISSIONS ON VIEWS
-- =============================================

GRANT SELECT ON vendor_asset_analytics TO authenticated;
GRANT SELECT ON vendor_availability_calendar TO authenticated;

-- =============================================
-- Migration Complete
-- =============================================

-- Final summary
DO $$
BEGIN
    RAISE NOTICE '=================================================';
    RAISE NOTICE 'Smart Assets Validation & Data Migration Complete';
    RAISE NOTICE '=================================================';
    RAISE NOTICE 'Next Steps:';
    RAISE NOTICE '1. Verify test data in Supabase dashboard';
    RAISE NOTICE '2. Test RLS by logging in as different roles';
    RAISE NOTICE '3. Check vendor_asset_analytics view for metrics';
    RAISE NOTICE '4. Verify vendors cannot modify other vendors data';
END $$;
