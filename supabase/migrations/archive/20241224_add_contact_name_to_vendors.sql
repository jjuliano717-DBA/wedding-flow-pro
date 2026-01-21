-- =============================================
-- Add contact_name Column to Vendors Table
-- Date: 2024-12-24
-- Purpose: Add contact_name field to store the
--          vendor contact person's name
-- =============================================

-- Add contact_name column
ALTER TABLE vendors
ADD COLUMN IF NOT EXISTS contact_name TEXT;

-- Add contact_phone if it doesn't exist (should already exist from unify migration)
ALTER TABLE vendors
ADD COLUMN IF NOT EXISTS contact_phone TEXT;

-- Optionally populate contact_name from profiles for existing vendors with owner_id
UPDATE vendors v
SET contact_name = p.full_name
FROM profiles p
WHERE v.owner_id = p.id
  AND v.contact_name IS NULL;

-- Verification
SELECT 
    COUNT(*) as total_vendors,
    COUNT(contact_name) as vendors_with_contact_name,
    COUNT(*) - COUNT(contact_name) as vendors_without_contact_name
FROM vendors;

-- Show sample data
SELECT 
    id,
    name as business_name,
    contact_name,
    contact_email,
    contact_phone,
    owner_id,
    CASE 
        WHEN owner_id IS NOT NULL AND contact_name IS NOT NULL THEN '✅ LINKED & NAMED'
        WHEN owner_id IS NOT NULL THEN '⚠️ LINKED BUT NO NAME'
        ELSE '❌ UNCLAIMED'
    END as status
FROM vendors
ORDER BY name
LIMIT 10;

SELECT 'Contact name column added and populated from profiles' AS status;
