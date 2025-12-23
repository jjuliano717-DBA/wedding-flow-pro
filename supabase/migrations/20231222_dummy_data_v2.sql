-- =============================================
-- Updated Dummy Data for Testing & Validation
-- =============================================

-- This script automatically finds existing vendors and projects to create sample assets.

DO $$ 
DECLARE
    v_id UUID;
    p_id UUID;
    u_id UUID;
BEGIN
    -- 1. Get a sample vendor
    SELECT id INTO v_id FROM vendors LIMIT 1;
    
    -- 2. Get a sample project and user
    SELECT id, user_id INTO p_id, u_id FROM projects LIMIT 1;

    IF v_id IS NULL THEN
        RAISE NOTICE 'No vendors found. Please ensure you have at least one vendor before seeding assets.';
    ELSE
        -- 3. Insert Inspiration Assets (DOES NOT REQUIRE PROJECT)
        INSERT INTO inspiration_assets (vendor_id, image_url, category_tag, cost_model, base_cost_low, base_cost_high, min_service_fee_pct)
        VALUES
            (v_id, 'https://images.unsplash.com/photo-1544592732-83bb76a8043d?auto=format&fit=crop&q=80&w=800', 'Floral', 'per_guest', 5000, 8000, 0.20),
            (v_id, 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800', 'Venue', 'flat_fee', 500000, 1000000, 0.25),
            (v_id, 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=800', 'Catering', 'per_guest', 8000, 15000, 0.18)
        ON CONFLICT DO NOTHING;
        
        RAISE NOTICE 'Successfully seeded 3 assets for vendor %', v_id;

        -- 4. Insert Budget Slots (ONLY IF PROJECT EXISTS)
        IF p_id IS NOT NULL THEN
            INSERT INTO budget_slots (project_id, category, target_budget, status)
            VALUES
                (p_id, 'Floral', 500000, 'OPEN'),
                (p_id, 'Venue', 2000000, 'OPEN'),
                (p_id, 'Catering', 1500000, 'OPEN')
            ON CONFLICT DO NOTHING;
            RAISE NOTICE 'Successfully seeded 3 budget slots for project %', p_id;
        ELSE
            RAISE NOTICE 'No project found. Skipping budget slot creation, but assets are available.';
        END IF;

    END IF;
END $$;
