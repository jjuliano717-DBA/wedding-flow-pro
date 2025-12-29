-- Diagnostic: Check the current state of info@mosquitofl.com account
-- This will show us what went wrong during signup

-- 1. Check the profile
SELECT 'PROFILE' as table_name, p.*
FROM profiles p
WHERE p.email = 'info@mosquitofl.com';

-- 2. Check for any vendor records with this email
SELECT 'VENDORS (by owner_id)' as table_name, v.*
FROM vendors v
INNER JOIN profiles p ON p.id = v.owner_id
WHERE p.email = 'info@mosquitofl.com';

-- 3. Check for vendor records by contact_email
SELECT 'VENDORS (by contact_email)' as table_name, v.*
FROM vendors v
WHERE v.contact_email = 'info@mosquitofl.com';

-- 4. Check for orphaned vendor record with name "Jason Juliano"
SELECT 'ORPHANED VENDOR' as table_name, v.*, p.email as owner_email
FROM vendors v
LEFT JOIN profiles p ON p.id = v.owner_id
WHERE v.name = 'Jason Juliano' OR v.business_name = 'Jason Juliano';

-- 5. Check auth metadata for this user
SELECT 
    'AUTH METADATA' as table_name,
    id,
    email,
    raw_user_meta_data
FROM auth.users
WHERE email = 'info@mosquitofl.com';
