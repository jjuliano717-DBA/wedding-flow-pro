-- =============================================
-- Phase 1b: Data Gap Remediation (Idempotent)
-- Date: 2025-12-26
-- Purpose: Populate missing dummy data in empty tables
-- =============================================

-- Ensure RLS remains enabled (safe to re-run)
ALTER TABLE inspiration_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_candidates ENABLE ROW LEVEL SECURITY;

-- Populate missing dummy data
DO $$
DECLARE
    v_user_id UUID;
    v_project_id UUID;
    v_asset_id UUID;
    v_slot_id UUID;
    swipes_count INT;
    slots_count INT;
BEGIN
    -- Check current data status
    SELECT COUNT(*) INTO swipes_count FROM user_swipes;
    SELECT COUNT(*) INTO slots_count FROM budget_slots;
    
    RAISE NOTICE 'Current counts - Swipes: %, Slots: %', swipes_count, slots_count;
    
    -- Get sample IDs for foreign keys
    SELECT id INTO v_user_id FROM profiles WHERE role = 'couple' LIMIT 1;
    SELECT id INTO v_project_id FROM projects WHERE user_id = v_user_id LIMIT 1;
    SELECT id INTO v_asset_id FROM inspiration_assets ORDER BY created_at DESC LIMIT 1;
    
    -- Validate we have required IDs
    IF v_user_id IS NULL THEN
        RAISE WARNING 'No couple user found. Create a couple profile first.';
        RETURN;
    END IF;
    
    IF v_project_id IS NULL THEN
        RAISE WARNING 'No project found for couple. Create a project first.';
        RETURN;
    END IF;
    
    IF v_asset_id IS NULL THEN
        RAISE WARNING 'No inspiration assets found. Run Phase 1a migration first.';
        RETURN;
    END IF;
    
    -- ========================================
    -- POPULATE USER_SWIPES (if empty)
    -- ========================================
    IF swipes_count = 0 THEN
        -- Insert 3 diverse swipes (LEFT, RIGHT, SUPER_LIKE)
        INSERT INTO user_swipes (user_id, project_id, asset_id, swipe_direction)
        SELECT 
            v_user_id,
            v_project_id,
            ia.id,
            CASE 
                WHEN ROW_NUMBER() OVER (ORDER BY ia.created_at) = 1 THEN 'SUPER_LIKE'::swipe_direction
                WHEN ROW_NUMBER() OVER (ORDER BY ia.created_at) = 2 THEN 'RIGHT'::swipe_direction
                ELSE 'LEFT'::swipe_direction
            END
        FROM inspiration_assets ia
        LIMIT 3
        ON CONFLICT (user_id, asset_id, project_id) DO NOTHING;
        
        RAISE NOTICE '✅ Inserted user_swipes dummy data';
    ELSE
        RAISE NOTICE '⏭️  Skipped user_swipes (already has % rows)', swipes_count;
    END IF;
    
    -- ========================================
    -- POPULATE BUDGET_SLOTS + CANDIDATES (if empty)
    -- ========================================
    IF slots_count = 0 THEN
        -- Create a Floral budget slot
        INSERT INTO budget_slots (project_id, category, target_budget, status)
        VALUES (v_project_id, 'Floral'::asset_category_tag, 300000, 'DRAFTING'::budget_slot_status)
        RETURNING id INTO v_slot_id;
        
        -- Add a candidate for the slot (using the first floral asset)
        INSERT INTO budget_candidates (
            slot_id, 
            source_asset_id, 
            calculated_cost_pretax, 
            calculated_total_real, 
            is_selected,
            notes
        )
        SELECT
            v_slot_id,
            ia.id,
            200000, -- $2,000 pretax
            248000, -- $2,480 with 20% fee + 4% tax
            TRUE,
            'Selected option - matches wedding theme'
        FROM inspiration_assets ia
        WHERE ia.category_tag = 'Floral'
        LIMIT 1
        ON CONFLICT DO NOTHING;
        
        RAISE NOTICE '✅ Inserted budget_slots and budget_candidates dummy data';
    ELSE
        RAISE NOTICE '⏭️  Skipped budget_slots (already has % rows)', slots_count;
    END IF;
    
    -- Final verification
    SELECT COUNT(*) INTO swipes_count FROM user_swipes;
    SELECT COUNT(*) INTO slots_count FROM budget_slots;
    
    RAISE NOTICE '===========================================';
    RAISE NOTICE 'Phase 1b Remediation Complete';
    RAISE NOTICE '===========================================';
    RAISE NOTICE 'Final counts:';
    RAISE NOTICE '  - user_swipes: %', swipes_count;
    RAISE NOTICE '  - budget_slots: %', slots_count;
    RAISE NOTICE '  - budget_candidates: %', (SELECT COUNT(*) FROM budget_candidates);
END $$;

-- =============================================
-- VALIDATION: Verify all tables have data
-- =============================================
SELECT 
    'inspiration_assets' AS table_name,
    COUNT(*) AS row_count,
    CASE WHEN COUNT(*) > 0 THEN '✅' ELSE '❌' END AS status
FROM inspiration_assets

UNION ALL

SELECT 'vendor_availability', COUNT(*), CASE WHEN COUNT(*) > 0 THEN '✅' ELSE '❌' END
FROM vendor_availability

UNION ALL

SELECT 'user_swipes', COUNT(*), CASE WHEN COUNT(*) > 0 THEN '✅' ELSE '❌' END
FROM user_swipes

UNION ALL

SELECT 'budget_slots', COUNT(*), CASE WHEN COUNT(*) > 0 THEN '✅' ELSE '❌' END
FROM budget_slots

UNION ALL

SELECT 'budget_candidates', COUNT(*), CASE WHEN COUNT(*) > 0 THEN '✅' ELSE '❌' END
FROM budget_candidates;
