-- =============================================
-- B2B Growth Engine - Database Schema
-- Date: 2026-01-21
-- Purpose: Enable vendor partnerships, referrals, and geographic networking
-- =============================================

-- =============================================
-- STEP 1: Add Service Area & Matching Columns to vendors
-- =============================================

ALTER TABLE vendors 
  ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
  ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),
  ADD COLUMN IF NOT EXISTS radius_miles INTEGER DEFAULT 25,
  ADD COLUMN IF NOT EXISTS style_tags JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS category_tags JSONB DEFAULT '[]'::jsonb;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_vendors_lat_long ON vendors(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_vendors_style_tags ON vendors USING GIN(style_tags);
CREATE INDEX IF NOT EXISTS idx_vendors_category_tags ON vendors USING GIN(category_tags);

-- =============================================
-- STEP 2: Create vendor_partnerships Table
-- =============================================

CREATE TABLE IF NOT EXISTS vendor_partnerships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('requested', 'active', 'declined', 'ended')),
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent self-partnerships and duplicates
  CONSTRAINT no_self_partnership CHECK (requester_id != receiver_id),
  CONSTRAINT unique_partnership UNIQUE (requester_id, receiver_id)
);

CREATE INDEX IF NOT EXISTS idx_partnerships_requester ON vendor_partnerships(requester_id);
CREATE INDEX IF NOT EXISTS idx_partnerships_receiver ON vendor_partnerships(receiver_id);
CREATE INDEX IF NOT EXISTS idx_partnerships_status ON vendor_partnerships(status);

-- =============================================
-- STEP 3: Create referrals Table
-- =============================================

CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  target_vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  event_date DATE,
  potential_value_cents INTEGER, -- Estimated contract value in cents
  commission_rate_pct DECIMAL(5,2) DEFAULT 10.00, -- e.g., 10.00 for 10%
  referral_fee_fixed_cents INTEGER DEFAULT 0,
  commission_earned_cents INTEGER,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'completed', 'pending_payout', 'paid')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_referrals_source ON referrals(source_vendor_id);
CREATE INDEX IF NOT EXISTS idx_referrals_target ON referrals(target_vendor_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);

-- =============================================
-- STEP 4: Haversine Distance Function
-- =============================================

CREATE OR REPLACE FUNCTION haversine_distance(
  lat1 DECIMAL, lon1 DECIMAL,
  lat2 DECIMAL, lon2 DECIMAL
) RETURNS DECIMAL AS $$
DECLARE
  radius CONSTANT DECIMAL := 3959.0; -- Earth radius in miles
  dlat DECIMAL;
  dlon DECIMAL;
  a DECIMAL;
  c DECIMAL;
BEGIN
  dlat := radians(lat2 - lat1);
  dlon := radians(lon2 - lon1);
  a := sin(dlat/2) * sin(dlat/2) + 
       cos(radians(lat1)) * cos(radians(lat2)) * 
       sin(dlon/2) * sin(dlon/2);
  c := 2 * atan2(sqrt(a), sqrt(1-a));
  RETURN radius * c;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =============================================
-- STEP 5: Find Compatible Partners Function
-- =============================================

CREATE OR REPLACE FUNCTION find_compatible_partners(
  p_vendor_id UUID,
  p_radius_miles INTEGER DEFAULT 50
) RETURNS TABLE (
  vendor_id UUID,
  vendor_name TEXT,
  vendor_type TEXT,
  distance_miles DECIMAL,
  style_match_pct DECIMAL,
  partnership_status TEXT
) AS $$
BEGIN
  RETURN QUERY
  WITH source_vendor AS (
    SELECT latitude, longitude, style_tags, category, type
    FROM vendors
    WHERE id = p_vendor_id
  ),
  candidates AS (
    SELECT 
      v.id as v_id,
      v.name as v_name,
      v.type as v_type,
      haversine_distance(sv.latitude, sv.longitude, v.latitude, v.longitude) as dist,
      -- Calculate style tag overlap percentage
      CASE 
        WHEN jsonb_array_length(sv.style_tags) = 0 THEN 0
        ELSE (
          SELECT COUNT(*)::DECIMAL / GREATEST(jsonb_array_length(sv.style_tags), 1) * 100
          FROM jsonb_array_elements_text(sv.style_tags) st
          WHERE v.style_tags ? st
        )
      END as sm,
      COALESCE(vp.status, 'none') as p_status
    FROM vendors v
    CROSS JOIN source_vendor sv
    LEFT JOIN vendor_partnerships vp ON (
      (vp.requester_id = p_vendor_id AND vp.receiver_id = v.id) OR
      (vp.receiver_id = p_vendor_id AND vp.requester_id = v.id)
    )
    WHERE v.id != p_vendor_id
      AND v.latitude IS NOT NULL
      AND v.longitude IS NOT NULL
      AND sv.latitude IS NOT NULL
      AND sv.longitude IS NOT NULL
      -- Different category/type (complementary)
      AND COALESCE(v.type, '') != COALESCE(sv.type, '')
      -- Within radius
      AND haversine_distance(sv.latitude, sv.longitude, v.latitude, v.longitude) <= p_radius_miles
  )
  SELECT
    c.v_id,
    c.v_name,
    c.v_type,
    c.dist,
    c.sm,
    c.p_status
  FROM candidates c
  WHERE c.sm >= 50.0
  ORDER BY c.dist ASC
  LIMIT 20;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- STEP 6: Row-Level Security (RLS) Policies
-- =============================================

-- Enable RLS on new tables
ALTER TABLE vendor_partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Partnerships: Can view if you're involved
DROP POLICY IF EXISTS "View own partnerships" ON vendor_partnerships;
CREATE POLICY "View own partnerships" ON vendor_partnerships
  FOR SELECT USING (
    requester_id IN (SELECT id FROM vendors WHERE owner_id = auth.uid()) OR
    receiver_id IN (SELECT id FROM vendors WHERE owner_id = auth.uid())
  );

-- Partnerships: Can create as requester
DROP POLICY IF EXISTS "Create partnerships" ON vendor_partnerships;
CREATE POLICY "Create partnerships" ON vendor_partnerships
  FOR INSERT WITH CHECK (
    requester_id IN (SELECT id FROM vendors WHERE owner_id = auth.uid())
  );

-- Partnerships: Can update own partnerships
DROP POLICY IF EXISTS "Update partnerships" ON vendor_partnerships;
CREATE POLICY "Update partnerships" ON vendor_partnerships
  FOR UPDATE USING (
    requester_id IN (SELECT id FROM vendors WHERE owner_id = auth.uid()) OR
    receiver_id IN (SELECT id FROM vendors WHERE owner_id = auth.uid())
  );

-- Referrals: Can view if you're involved
DROP POLICY IF EXISTS "View own referrals" ON referrals;
CREATE POLICY "View own referrals" ON referrals
  FOR SELECT USING (
    source_vendor_id IN (SELECT id FROM vendors WHERE owner_id = auth.uid()) OR
    target_vendor_id IN (SELECT id FROM vendors WHERE owner_id = auth.uid())
  );

-- Referrals: Can create as source
DROP POLICY IF EXISTS "Create referrals" ON referrals;
CREATE POLICY "Create referrals" ON referrals
  FOR INSERT WITH CHECK (
    source_vendor_id IN (SELECT id FROM vendors WHERE owner_id = auth.uid())
  );

-- Referrals: Can update if you're the target (to accept/decline) or source (to mark as paid)
DROP POLICY IF EXISTS "Update referrals" ON referrals;
CREATE POLICY "Update referrals" ON referrals
  FOR UPDATE USING (
    source_vendor_id IN (SELECT id FROM vendors WHERE owner_id = auth.uid()) OR
    target_vendor_id IN (SELECT id FROM vendors WHERE owner_id = auth.uid())
  );

-- =============================================
-- STEP 7: Success Message
-- =============================================

DO $$
BEGIN
  RAISE NOTICE '✅ B2B Growth Engine schema installed successfully!';
  RAISE NOTICE '   - Added lat/long and matching columns to vendors';
  RAISE NOTICE '   - Created vendor_partnerships table';
  RAISE NOTICE '   - Created referrals table';
  RAISE NOTICE '   - Installed Haversine distance function';
  RAISE NOTICE '   - Installed find_compatible_partners() function';
  RAISE NOTICE '   - Configured RLS policies';
END $$;
