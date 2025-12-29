-- Complete Fix: Create Flora Groves Farm and link to venue@demo.com
-- Run this entire script in Supabase SQL Editor

-- =============================================
-- STEP 1: Delete the auto-created profile
-- =============================================
DELETE FROM vendors 
WHERE contact_email = 'venue@demo.com' 
  AND name = 'Business for venue@demo.com';

-- =============================================
-- STEP 2: Create Flora Groves Farm venue
-- =============================================
INSERT INTO vendors (
    name,
    contact_email,
    category,
    type,
    location,
    description,
    website,
    image_url,
    google_rating,
    google_reviews,
    created_at,
    updated_at
) VALUES (
    'Flora Groves Farm',
    'venue@demo.com',
    'venue',
    'Outdoor Venue',
    'Napa Valley, CA',
    'Beautiful outdoor wedding venue nestled in the heart of Napa Valley. Our picturesque farm offers stunning vineyard views, rustic charm, and modern amenities for your perfect day.',
    'https://floragroves.com',
    'https://images.unsplash.com/photo-1519167758481-83f29da8c6b6',
    4.9,
    127,
    NOW(),
    NOW()
)
ON CONFLICT (contact_email) 
DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    type = EXCLUDED.type,
    location = EXCLUDED.location,
    description = EXCLUDED.description,
    website = EXCLUDED.website,
    image_url = EXCLUDED.image_url,
    google_rating = EXCLUDED.google_rating,
    google_reviews = EXCLUDED.google_reviews,
    updated_at = NOW();

-- =============================================
-- STEP 3: Link to user (if user exists)
-- =============================================
UPDATE vendors v
SET owner_id = u.id
FROM auth.users u
WHERE v.contact_email = 'venue@demo.com'
  AND u.email = 'venue@demo.com'
  AND v.owner_id IS NULL;

-- =============================================
-- STEP 4: Verify the setup
-- =============================================
SELECT 
    v.id,
    v.name,
    v.contact_email,
    v.category,
    v.location,
    v.owner_id,
    u.email as owner_email,
    CASE 
        WHEN v.owner_id IS NOT NULL THEN '✅ LINKED'
        ELSE '⚠️ UNCLAIMED'
    END as status
FROM vendors v
LEFT JOIN auth.users u ON v.owner_id = u.id
WHERE v.contact_email = 'venue@demo.com';

-- Expected result: 
-- Flora Groves Farm | venue@demo.com | venue | Napa Valley, CA | [user-id] | venue@demo.com | ✅ LINKED
