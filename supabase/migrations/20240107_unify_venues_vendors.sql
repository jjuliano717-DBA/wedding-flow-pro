-- =============================================
-- Migration: Unify Venues and Vendors Tables
-- Date: 2024-01-07
-- Purpose: Migrate all venues data into vendors table
--          and use category column to distinguish types
-- =============================================

-- =============================================
-- STEP 1: Verify vendors table has all needed columns
-- =============================================

-- Check if venue-specific columns exist (should be added by 20240101_add_venue_fields.sql)
DO $$
BEGIN
    -- These columns should already exist from previous migration
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vendors' AND column_name = 'guest_capacity') THEN
        RAISE NOTICE 'Adding guest_capacity column';
        ALTER TABLE vendors ADD COLUMN guest_capacity INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vendors' AND column_name = 'amenities') THEN
        RAISE NOTICE 'Adding amenities column';
        ALTER TABLE vendors ADD COLUMN amenities TEXT[];
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vendors' AND column_name = 'faqs') THEN
        RAISE NOTICE 'Adding faqs column';
        ALTER TABLE vendors ADD COLUMN faqs JSONB;
    END IF;
END $$;

-- =============================================
-- STEP 2: Add additional venue-specific columns
-- =============================================

-- Add columns that exist in venues but not in vendors
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS capacity TEXT;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS capacity_num INTEGER;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS price TEXT;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS indoor BOOLEAN DEFAULT true;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS outdoor BOOLEAN DEFAULT true;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS images TEXT[];
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS phone TEXT;

-- =============================================
-- STEP 3: Migrate venues data to vendors table
-- =============================================

INSERT INTO vendors (
    name,
    description,
    type,
    location,
    category,
    contact_email,
    contact_phone,
    website,
    image_url,
    google_business_url,
    google_rating,
    google_reviews,
    heart_rating,
    exclusive,
    featured,
    guest_capacity,
    capacity,
    capacity_num,
    price,
    indoor,
    outdoor,
    amenities,
    images,
    created_at,
    updated_at
)
SELECT 
    v.name,
    v.description,
    v.type,
    v.location,
    'venue' as category,
    v.contact_email,
    NULL as contact_phone,
    v.website,
    v.image_url,
    v.google_business_url,
    v.google_rating,
    v.google_reviews,
    COALESCE(NULLIF(v.heart_rating, 0), 4.5) as heart_rating, -- Convert 0 to NULL, then default to 4.5
    COALESCE(v.exclusive, false) as exclusive,
    false as featured, -- Default to false, can be set later
    v.capacity_num as guest_capacity,
    v.capacity,
    v.capacity_num,
    COALESCE(v.price, '$$') as price,
    COALESCE(v.indoor, true) as indoor,
    COALESCE(v.outdoor, true) as outdoor,
    COALESCE(v.amenities, ARRAY[]::TEXT[]) as amenities,
    COALESCE(v.images, ARRAY[]::TEXT[]) as images,
    COALESCE(v.created_at, NOW()) as created_at,
    NOW() as updated_at
FROM venues v
WHERE NOT EXISTS (
    SELECT 1 FROM vendors vnd 
    WHERE vnd.name = v.name 
    AND vnd.contact_email = v.contact_email
    AND vnd.category = 'venue'
);

-- =============================================
-- STEP 4: Link venues to users via contact_email
-- =============================================

UPDATE vendors v
SET owner_id = u.id
FROM auth.users u
WHERE v.category = 'venue'
  AND v.contact_email IS NOT NULL
  AND v.contact_email = u.email
  AND v.owner_id IS NULL;

-- =============================================
-- STEP 5: Verification Queries
-- =============================================

-- Count records by category
SELECT 
    category,
    COUNT(*) as count,
    COUNT(owner_id) as linked_count,
    COUNT(*) - COUNT(owner_id) as unlinked_count
FROM vendors
GROUP BY category
ORDER BY category;

-- Show migrated venues
SELECT 
    id,
    name,
    category,
    contact_email,
    owner_id,
    CASE 
        WHEN owner_id IS NOT NULL THEN '✅ LINKED'
        ELSE '⚠️ UNCLAIMED'
    END as status
FROM vendors
WHERE category = 'venue'
ORDER BY name
LIMIT 20;

-- Verify Flora Groves Farm
SELECT 
    id,
    name,
    category,
    contact_email,
    location,
    owner_id,
    guest_capacity,
    amenities
FROM vendors
WHERE name ILIKE '%flora%groves%'
   OR contact_email = 'venue@demo.com';

-- =============================================
-- STEP 6: Add indexes for performance
-- =============================================

CREATE INDEX IF NOT EXISTS idx_vendors_category ON vendors(category);
CREATE INDEX IF NOT EXISTS idx_vendors_category_location ON vendors(category, location);

-- =============================================
-- STEP 7: Update RLS policies (if needed)
-- =============================================

-- The existing RLS policies on vendors table should work fine
-- Just verify they exist
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd
FROM pg_policies
WHERE tablename = 'vendors'
ORDER BY policyname;

-- =============================================
-- NOTES FOR ROLLBACK
-- =============================================

/*
If you need to rollback this migration:

1. Delete migrated venues from vendors:
   DELETE FROM vendors WHERE category = 'venue';

2. The original venues table data is preserved (we didn't drop it)

3. To drop the new columns:
   ALTER TABLE vendors DROP COLUMN IF EXISTS capacity;
   ALTER TABLE vendors DROP COLUMN IF EXISTS capacity_num;
   ALTER TABLE vendors DROP COLUMN IF EXISTS price;
   ALTER TABLE vendors DROP COLUMN IF EXISTS indoor;
   ALTER TABLE vendors DROP COLUMN IF EXISTS outdoor;
   ALTER TABLE vendors DROP COLUMN IF EXISTS featured;
   ALTER TABLE vendors DROP COLUMN IF EXISTS images;
   ALTER TABLE vendors DROP COLUMN IF EXISTS phone;
*/

-- =============================================
-- SUCCESS MESSAGE
-- =============================================

DO $$
DECLARE
    venue_count INTEGER;
    linked_count INTEGER;
BEGIN
    SELECT COUNT(*), COUNT(owner_id) INTO venue_count, linked_count
    FROM vendors WHERE category = 'venue';
    
    RAISE NOTICE '✅ Migration Complete!';
    RAISE NOTICE 'Migrated % venues to vendors table', venue_count;
    RAISE NOTICE '% venues linked to user accounts', linked_count;
    RAISE NOTICE '% venues awaiting claim', venue_count - linked_count;
END $$;
