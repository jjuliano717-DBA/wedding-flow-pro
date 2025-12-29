-- =============================================
-- Fix Vendor Category Data - CORRECTED ORDER
-- Date: 2024-12-24
-- Purpose: Fix redundant category/type data
-- IMPORTANT: Run steps in order!
-- =============================================

-- =============================================
-- STEP 1: Backup (CRITICAL - Run this first!)
-- =============================================

CREATE TABLE IF NOT EXISTS vendors_backup_20241224 AS 
SELECT * FROM vendors;

-- =============================================
-- STEP 2: Identify Bad Data (BEFORE fixing)
-- =============================================

-- Check current category distribution
SELECT category, COUNT(*) as count
FROM vendors
GROUP BY category
ORDER BY count DESC;

-- =============================================
-- STEP 3: FIX THE DATA (Before adding constraint!)
-- =============================================

-- Fix vendors where category = business type
UPDATE vendors
SET category = 'vendor'
WHERE category IN (
  'Photographer', 'Florist', 'DJ/Band', 'Caterer', 'Cake Designer',
  'Hair & Makeup', 'Videographer', 'Officiant', 'Transportation',
  'Planner', 'Rentals', 'Lighting', 'Photo Booth', 'Invitations',
  'Jewelry', 'Bridal Shop', 'Tuxedo Rental', 'Limousine'
);

-- Fix any venues that might be miscategorized
UPDATE vendors
SET category = 'venue'
WHERE type IN (
  'Banquet Halls', 'Gardens', 'Barns', 'Hotels', 'Restaurants',
  'All-Inclusive Venues', 'Conference Centers', 'Country Clubs',
  'House of Worship', 'Universities and Colleges', 'Cabins and Cottages',
  'Campgrounds', 'Farms', 'Ranches', 'Wineries and Vineyards',
  'Breweries and Distilleries', 'City Halls', 'Lofts and Rooftops',
  'Nightclubs', 'Bed and Breakfasts', 'Castles', 'Greenhouses',
  'Historic Places', 'Lake Houses', 'Private Gardens', 'Aquariums and Zoos',
  'Beaches', 'Boats and Yachts', 'Resorts', 'Amusement Parks',
  'Food Truck Park', 'Libraries', 'Museums and Galleries',
  'Sports Stadiums', 'Theaters', 'Private Homes', 'Public Spaces and Parks'
) AND category != 'venue';

-- Fix planners
UPDATE vendors
SET category = 'planner'
WHERE type IN (
  'Wedding Planner', 'Event Coordinator', 'Day-of Coordinator'
) AND category != 'planner';

-- =============================================
-- STEP 4: Verify Data is Clean
-- =============================================

-- Should only show vendor, venue, planner
SELECT category, COUNT(*) as count
FROM vendors
GROUP BY category
ORDER BY category;

-- Should return 0 rows (if any rows, fix them manually before proceeding)
SELECT id, name, category, type
FROM vendors
WHERE category NOT IN ('vendor', 'venue', 'planner');

-- =============================================
-- STEP 5: Add Constraint (ONLY after data is clean!)
-- =============================================

-- Add constraint to ensure category is valid
ALTER TABLE vendors
ADD CONSTRAINT vendors_category_check
CHECK (category IN ('vendor', 'venue', 'planner'));

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_vendors_category_type 
ON vendors(category, type);

-- =============================================
-- STEP 6: Final Verification
-- =============================================

SELECT 
    category,
    COUNT(*) as total_count,
    COUNT(DISTINCT type) as unique_types
FROM vendors
GROUP BY category
ORDER BY category;

-- =============================================
-- SUCCESS MESSAGE
-- =============================================

DO $$
DECLARE
    vendor_count INTEGER;
    venue_count INTEGER;
    planner_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO vendor_count FROM vendors WHERE category = 'vendor';
    SELECT COUNT(*) INTO venue_count FROM vendors WHERE category = 'venue';
    SELECT COUNT(*) INTO planner_count FROM vendors WHERE category = 'planner';
    
    RAISE NOTICE '✅ Vendor Data Fix Complete!';
    RAISE NOTICE 'Vendors: %', vendor_count;
    RAISE NOTICE 'Venues: %', venue_count;
    RAISE NOTICE 'Planners: %', planner_count;
    RAISE NOTICE 'Total: %', vendor_count + venue_count + planner_count;
END $$;
