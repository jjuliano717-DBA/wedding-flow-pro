-- =============================================
-- Migration: Smart Assets, Vendor Analytics, and Availability
-- Date: 2023-12-22
-- Purpose: Add inspiration_assets, vendor_availability, user_swipes, 
--          budget_slots, and budget_candidates tables with RLS policies
-- =============================================

-- =============================================
-- 1. CREATE ENUMS
-- =============================================

-- Category tags for assets
CREATE TYPE asset_category_tag AS ENUM (
    'Floral',
    'Rentals',
    'Venue',
    'Catering'
);

-- Cost models for pricing
CREATE TYPE cost_model_type AS ENUM (
    'per_guest',
    'flat_fee',
    'per_hour'
);

-- Vendor availability reasons
CREATE TYPE availability_reason AS ENUM (
    'BOOKED',
    'UNAVAILABLE'
);

-- User swipe directions
CREATE TYPE swipe_direction AS ENUM (
    'LEFT',
    'RIGHT',
    'SUPER_LIKE'
);

-- Budget slot status
CREATE TYPE budget_slot_status AS ENUM (
    'OPEN',
    'DRAFTING',
    'BOOKED'
);

-- =============================================
-- 2. CREATE TABLES
-- =============================================

-- 2.1 Inspiration Assets (The Bridge)
CREATE TABLE IF NOT EXISTS inspiration_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    category_tag asset_category_tag NOT NULL,
    cost_model cost_model_type NOT NULL,
    base_cost_low INTEGER NOT NULL CHECK (base_cost_low >= 0), -- in cents
    base_cost_high INTEGER NOT NULL CHECK (base_cost_high >= base_cost_low), -- in cents
    min_service_fee_pct DECIMAL(4,3) NOT NULL DEFAULT 0.000 CHECK (min_service_fee_pct >= 0 AND min_service_fee_pct <= 1), -- 0.20 = 20%
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.2 Vendor Availability (Critical for World Class UX)
CREATE TABLE IF NOT EXISTS vendor_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    blocked_date DATE NOT NULL,
    reason availability_reason NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(vendor_id, blocked_date) -- Prevent duplicate blocks for same date
);

-- 2.3 User Swipes (Top of Funnel)
CREATE TABLE IF NOT EXISTS user_swipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    asset_id UUID NOT NULL REFERENCES inspiration_assets(id) ON DELETE CASCADE,
    swipe_direction swipe_direction NOT NULL,
    swiped_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, asset_id, project_id) -- One swipe per user per asset per project
);

-- 2.4 Budget Slots (The Container)
CREATE TABLE IF NOT EXISTS budget_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    category asset_category_tag NOT NULL,
    target_budget INTEGER NOT NULL CHECK (target_budget >= 0), -- in cents
    status budget_slot_status NOT NULL DEFAULT 'OPEN',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.5 Budget Candidates (The Options)
CREATE TABLE IF NOT EXISTS budget_candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slot_id UUID NOT NULL REFERENCES budget_slots(id) ON DELETE CASCADE,
    source_asset_id UUID NOT NULL REFERENCES inspiration_assets(id) ON DELETE CASCADE,
    calculated_cost_pretax INTEGER NOT NULL CHECK (calculated_cost_pretax >= 0), -- in cents
    calculated_total_real INTEGER NOT NULL CHECK (calculated_total_real >= calculated_cost_pretax), -- in cents, includes tax/tip
    is_selected BOOLEAN NOT NULL DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- 3. CREATE INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX idx_inspiration_assets_vendor ON inspiration_assets(vendor_id);
CREATE INDEX idx_inspiration_assets_category ON inspiration_assets(category_tag);
CREATE INDEX idx_vendor_availability_vendor ON vendor_availability(vendor_id);
CREATE INDEX idx_vendor_availability_date ON vendor_availability(blocked_date);
CREATE INDEX idx_user_swipes_user ON user_swipes(user_id);
CREATE INDEX idx_user_swipes_project ON user_swipes(project_id);
CREATE INDEX idx_user_swipes_asset ON user_swipes(asset_id);
CREATE INDEX idx_budget_slots_project ON budget_slots(project_id);
CREATE INDEX idx_budget_candidates_slot ON budget_candidates(slot_id);
CREATE INDEX idx_budget_candidates_selected ON budget_candidates(is_selected) WHERE is_selected = TRUE;

-- =============================================
-- 4. CREATE UPDATED_AT TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_inspiration_assets_updated_at
    BEFORE UPDATE ON inspiration_assets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendor_availability_updated_at
    BEFORE UPDATE ON vendor_availability
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budget_slots_updated_at
    BEFORE UPDATE ON budget_slots
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budget_candidates_updated_at
    BEFORE UPDATE ON budget_candidates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 5. ENABLE ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE inspiration_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_candidates ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 6. CREATE RLS POLICIES
-- =============================================

-- 6.1 Inspiration Assets Policies
-- Couples: Read all assets
CREATE POLICY "Couples can view all inspiration assets"
    ON inspiration_assets FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'couple'
    ));

-- Vendors: Full control over their own assets
CREATE POLICY "Vendors can manage their own inspiration assets"
    ON inspiration_assets FOR ALL
    USING (vendor_id IN (
        SELECT id FROM vendors WHERE owner_id = auth.uid()
    ));

-- Planners: Read all assets
CREATE POLICY "Planners can view all inspiration assets"
    ON inspiration_assets FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'planner'
    ));

-- 6.2 Vendor Availability Policies
-- Vendors: Full control over their own availability
CREATE POLICY "Vendors can manage their own availability"
    ON vendor_availability FOR ALL
    USING (vendor_id IN (
        SELECT id FROM vendors WHERE owner_id = auth.uid()
    ));

-- Couples: Read all availability (to check dates)
CREATE POLICY "Couples can view vendor availability"
    ON vendor_availability FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'couple'
    ));

-- Planners: Read all availability
CREATE POLICY "Planners can view vendor availability"
    ON vendor_availability FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'planner'
    ));

-- 6.3 User Swipes Policies
-- Users: Full control over their own swipes
CREATE POLICY "Users can manage their own swipes"
    ON user_swipes FOR ALL
    USING (user_id = auth.uid());

-- Vendors: Can view swipes on their assets (for analytics)
CREATE POLICY "Vendors can view swipes on their assets"
    ON user_swipes FOR SELECT
    USING (asset_id IN (
        SELECT id FROM inspiration_assets 
        WHERE vendor_id IN (
            SELECT id FROM vendors WHERE owner_id = auth.uid()
        )
    ));

-- Planners: Can view swipes for their clients' projects
CREATE POLICY "Planners can view swipes for client projects"
    ON user_swipes FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'planner'
    ));

-- 6.4 Budget Slots Policies
-- Couples: Full control over slots in their projects
CREATE POLICY "Couples can manage budget slots in their projects"
    ON budget_slots FOR ALL
    USING (project_id IN (
        SELECT id FROM projects WHERE user_id = auth.uid()
    ));

-- Planners: Full control over slots in client projects
CREATE POLICY "Planners can manage budget slots for clients"
    ON budget_slots FOR ALL
    USING (EXISTS (
        SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'planner'
    ));

-- Vendors: Read slots that contain their assets
CREATE POLICY "Vendors can view budget slots with their assets"
    ON budget_slots FOR SELECT
    USING (id IN (
        SELECT slot_id FROM budget_candidates
        WHERE source_asset_id IN (
            SELECT id FROM inspiration_assets
            WHERE vendor_id IN (
                SELECT id FROM vendors WHERE owner_id = auth.uid()
            )
        )
    ));

-- 6.5 Budget Candidates Policies
-- Couples: Full control over candidates in their project slots
CREATE POLICY "Couples can manage budget candidates in their projects"
    ON budget_candidates FOR ALL
    USING (slot_id IN (
        SELECT id FROM budget_slots
        WHERE project_id IN (
            SELECT id FROM projects WHERE user_id = auth.uid()
        )
    ));

-- Planners: Full control over candidates in client slots
CREATE POLICY "Planners can manage budget candidates for clients"
    ON budget_candidates FOR ALL
    USING (EXISTS (
        SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'planner'
    ));

-- Vendors: Read candidates for their assets
CREATE POLICY "Vendors can view budget candidates for their assets"
    ON budget_candidates FOR SELECT
    USING (source_asset_id IN (
        SELECT id FROM inspiration_assets
        WHERE vendor_id IN (
            SELECT id FROM vendors WHERE owner_id = auth.uid()
        )
    ));

-- =============================================
-- 7. DUMMY DATA FOR VALIDATION
-- =============================================

-- Note: Insert dummy data after migration
-- Example vendor availability entries will be inserted via separate script

COMMENT ON TABLE inspiration_assets IS 'Bridge table connecting vendors to their service/product assets with cost models';
COMMENT ON TABLE vendor_availability IS 'Tracks vendor availability and blocked dates for bookings';
COMMENT ON TABLE user_swipes IS 'Top-of-funnel tracking for user engagement with inspiration assets';
COMMENT ON TABLE budget_slots IS 'Budget allocation containers for wedding projects by category';
COMMENT ON TABLE budget_candidates IS 'Specific vendor options being considered for each budget slot';

-- =============================================
-- Migration Complete
-- =============================================
