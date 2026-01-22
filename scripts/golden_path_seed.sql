-- Golden Path Seed Script
-- This script creates coherent test data matching the user stories for Phase 8 feedback.
-- It assumes a PostgreSQL‑compatible Supabase database.

-- ------------------------------------------------------------
-- 1. Vendors
-- ------------------------------------------------------------
INSERT INTO vendors (id, owner_id, name, created_at)
VALUES
    (gen_random_uuid(), gen_random_uuid(), 'Elite Photography', now()),
    (gen_random_uuid(), gen_random_uuid(), 'Luxe Events', now()),
    (gen_random_uuid(), gen_random_uuid(), 'Dream Florals', now())
RETURNING id, name;

-- Capture the generated IDs for later use (replace the placeholders with the actual UUIDs
-- returned by the above statement when you run the script).
-- For illustration we assign them to variables.
\set elite_id   (SELECT id FROM vendors WHERE name = 'Elite Photography')
\set luxe_id    (SELECT id FROM vendors WHERE name = 'Luxe Events')
\set florals_id (SELECT id FROM vendors WHERE name = 'Dream Florals')

-- ------------------------------------------------------------
-- 2. Scenario A – Calendar Test (Elite Photography)
-- ------------------------------------------------------------
-- Block the 15th of next month as BOOKED with a note.
INSERT INTO vendor_availability (
    id,
    vendor_id,
    blocked_date,
    reason,
    notes,
    is_all_day,
    start_time,
    end_time,
    created_at
) VALUES (
    gen_random_uuid(),
    :elite_id,
    (date_trunc('month', current_date) + interval '1 month' + interval '14 days')::date, -- 15th of next month
    'BOOKED',
    'Smith Wedding',
    true,
    NULL,
    NULL,
    now()
);

-- ------------------------------------------------------------
-- 3. Scenario B – Referral Test (Luxe Events)
-- ------------------------------------------------------------
-- 3.1 Partnerships (partner network)
INSERT INTO vendor_partnerships (
    id,
    vendor_id,
    partner_vendor_id,
    commission_rate_pct,
    status,
    created_at
) VALUES
    (gen_random_uuid(), :luxe_id, gen_random_uuid(), 10, 'ACTIVE', now()),
    (gen_random_uuid(), :luxe_id, gen_random_uuid(), 15, 'ACTIVE', now()),
    (gen_random_uuid(), :luxe_id, gen_random_uuid(), 20, 'ACTIVE', now());

-- 3.2 Referrals (pipeline)
INSERT INTO referrals (
    id,
    vendor_id,
    partner_vendor_id,
    status,
    value_cents,
    commission_cents,
    created_at
) VALUES
    (gen_random_uuid(), :luxe_id, gen_random_uuid(), 'PENDING', 500000, NULL, now()), -- $5,000 pending
    (gen_random_uuid(), :luxe_id, gen_random_uuid(), 'PAID',    300000, 30000, now()); -- $3,000 paid, $300 commission (10%)

-- ------------------------------------------------------------
-- 4. Scenario C – Inquiry Test (Dream Florals)
-- ------------------------------------------------------------
INSERT INTO leads (
    id,
    vendor_id,
    client_name,
    status,
    created_at
) VALUES (
    gen_random_uuid(),
    :florals_id,
    'Sarah & Mike',
    'NEW',
    now()
);

-- ------------------------------------------------------------
-- 5. Payments (Finance Chart) – optional helper data for Luxe Events
-- ------------------------------------------------------------
-- A paid payment for the $3,000 referral above and a pending payment for the $5,000 referral.
INSERT INTO payments (
    id,
    vendor_id,
    amount_cents,
    status,
    payment_type,
    created_at,
    user_id
) VALUES
    (gen_random_uuid(), :luxe_id, 300000, 'PAID',   'REFERRAL', now(), gen_random_uuid()),
    (gen_random_uuid(), :luxe_id, 500000, 'PENDING','REFERRAL', now(), gen_random_uuid());

-- ------------------------------------------------------------
-- End of Golden Path Seed Script
-- Run this script with the Supabase SQL editor or via psql.
