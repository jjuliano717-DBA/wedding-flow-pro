-- =============================================
-- Dummy Data for Testing & Validation
-- =============================================

-- IMPORTANT: Run this AFTER the main migration has been executed
-- This script assumes the following exist:
--   - profiles table with couples, vendors, and planners
--   - vendors table linked to vendor profiles
--   - projects table for couples

-- =============================================
-- 1. INSERT DUMMY INSPIRATION ASSETS
-- =============================================

-- Assuming we have vendor IDs from vendors table
-- Replace these UUIDs with actual vendor IDs from your database

INSERT INTO inspiration_assets (vendor_id, image_url, category_tag, cost_model, base_cost_low, base_cost_high, min_service_fee_pct)
VALUES
    -- Floral vendor assets
    ('VENDOR_UUID_1', 'https://example.com/floral/bouquet1.jpg', 'Floral', 'per_guest', 5000, 8000, 0.20),
    ('VENDOR_UUID_1', 'https://example.com/floral/centerpiece1.jpg', 'Floral', 'flat_fee', 50000, 100000, 0.15),
    
    -- Venue assets
    ('VENDOR_UUID_2', 'https://example.com/venue/garden.jpg', 'Venue', 'flat_fee', 500000, 1000000, 0.25),
    ('VENDOR_UUID_2', 'https://example.com/venue/ballroom.jpg', 'Venue', 'per_guest', 15000, 25000, 0.20),
    
    -- Catering assets
    ('VENDOR_UUID_3', 'https://example.com/catering/menu1.jpg', 'Catering', 'per_guest', 8000, 15000, 0.18),
    ('VENDOR_UUID_3', 'https://example.com/catering/buffet.jpg', 'Catering', 'per_guest', 6000, 12000, 0.20),
    
    -- Rentals assets
    ('VENDOR_UUID_4', 'https://example.com/rentals/chairs.jpg', 'Rentals', 'flat_fee', 20000, 40000, 0.10),
    ('VENDOR_UUID_4', 'https://example.com/rentals/tables.jpg', 'Rentals', 'per_hour', 5000, 10000, 0.15);

-- =============================================
-- 2. INSERT VENDOR AVAILABILITY (DATE BLOCKING)
-- =============================================

-- Block dates for vendor 1 (Florist)
INSERT INTO vendor_availability (vendor_id, blocked_date, reason, notes)
VALUES
    ('VENDOR_UUID_1', '2024-06-15', 'BOOKED', 'Wedding at Central Park'),
    ('VENDOR_UUID_1', '2024-07-20', 'BOOKED', 'Wedding at Plaza Hotel'),
    ('VENDOR_UUID_1', '2024-08-10', 'UNAVAILABLE', 'Vacation'),
    ('VENDOR_UUID_1', '2024-09-14', 'BOOKED', 'Corporate event');

-- Block dates for vendor 2 (Venue)
INSERT INTO vendor_availability (vendor_id, blocked_date, reason, notes)
VALUES
    ('VENDOR_UUID_2', '2024-06-15', 'BOOKED', 'Smith-Johnson Wedding'),
    ('VENDOR_UUID_2', '2024-06-16', 'BOOKED', 'Brown-Davis Wedding'),
    ('VENDOR_UUID_2', '2024-07-04', 'UNAVAILABLE', 'Independence Day - Closed'),
    ('VENDOR_UUID_2', '2024-08-12', 'BOOKED', 'Miller-Wilson Wedding');

-- Block dates for vendor 3 (Caterer)
INSERT INTO vendor_availability (vendor_id, blocked_date, reason, notes)
VALUES
    ('VENDOR_UUID_3', '2024-06-22', 'BOOKED', 'Wedding catering'),
    ('VENDOR_UUID_3', '2024-07-15', 'BOOKED', 'Corporate gala'),
    ('VENDOR_UUID_3', '2024-12-25', 'UNAVAILABLE', 'Christmas - Closed');

-- =============================================
-- 3. INSERT SAMPLE USER SWIPES
-- =============================================

-- Assuming couple user and project IDs exist
INSERT INTO user_swipes (user_id, project_id, asset_id, swipe_direction)
VALUES
    -- Couple likes various assets
    ('COUPLE_USER_UUID_1', 'PROJECT_UUID_1', 'ASSET_UUID_1', 'RIGHT'),
    ('COUPLE_USER_UUID_1', 'PROJECT_UUID_1', 'ASSET_UUID_2', 'SUPER_LIKE'),
    ('COUPLE_USER_UUID_1', 'PROJECT_UUID_1', 'ASSET_UUID_3', 'RIGHT'),
    ('COUPLE_USER_UUID_1', 'PROJECT_UUID_1', 'ASSET_UUID_4', 'LEFT'),
    ('COUPLE_USER_UUID_1', 'PROJECT_UUID_1', 'ASSET_UUID_5', 'RIGHT');

-- =============================================
-- 4. INSERT BUDGET SLOTS
-- =============================================

INSERT INTO budget_slots (project_id, category, target_budget, status)
VALUES
    ('PROJECT_UUID_1', 'Floral', 500000, 'DRAFTING'),      -- $5,000 budget for flowers
    ('PROJECT_UUID_1', 'Venue', 2000000, 'OPEN'),          -- $20,000 budget for venue
    ('PROJECT_UUID_1', 'Catering', 1500000, 'OPEN'),       -- $15,000 budget for catering
    ('PROJECT_UUID_1', 'Rentals', 300000, 'BOOKED');       -- $3,000 budget for rentals

-- =============================================
-- 5. INSERT BUDGET CANDIDATES
-- =============================================

-- Get slot IDs (replace these with actual IDs after insertion)
INSERT INTO budget_candidates (slot_id, source_asset_id, calculated_cost_pretax, calculated_total_real, is_selected, notes)
VALUES
    -- Floral slot candidates
    ('SLOT_UUID_FLORAL', 'ASSET_UUID_1', 450000, 558000, true, 'Selected - beautiful roses'),
    ('SLOT_UUID_FLORAL', 'ASSET_UUID_2', 700000, 868000, false, 'Over budget'),
    
    -- Venue slot candidates
    ('SLOT_UUID_VENUE', 'ASSET_UUID_3', 1800000, 2250000, false, 'Under consideration'),
    ('SLOT_UUID_VENUE', 'ASSET_UUID_4', 2200000, 2750000, false, 'Slightly over budget'),
    
    -- Catering slot candidates
    ('SLOT_UUID_CATERING', 'ASSET_UUID_5', 1400000, 1722000, true, 'Selected - excellent menu'),
    ('SLOT_UUID_CATERING', 'ASSET_UUID_6', 1100000, 1353000, false, 'Backup option');

-- =============================================
-- NOTES FOR EXECUTION
-- =============================================

/*
Before running this script:
1. Execute the main migration (20231222_smart_assets_availability.sql)
2. Replace all placeholder UUIDs with actual IDs from your database:
   - VENDOR_UUID_1, VENDOR_UUID_2, etc.
   - COUPLE_USER_UUID_1
   - PROJECT_UUID_1
   - ASSET_UUID_1, ASSET_UUID_2, etc.
   - SLOT_UUID_FLORAL, SLOT_UUID_VENUE, etc.

You can query for these IDs:
```sql
-- Get vendor IDs
SELECT id, business_name FROM vendors;

-- Get couple user IDs
SELECT id, email FROM profiles WHERE role = 'couple';

-- Get project IDs
SELECT id, name, user_id FROM projects;

-- Get asset IDs (after inserting)
SELECT id, category_tag, vendor_id FROM inspiration_assets;

-- Get slot IDs (after inserting)
SELECT id, category, project_id FROM budget_slots;
```
*/
