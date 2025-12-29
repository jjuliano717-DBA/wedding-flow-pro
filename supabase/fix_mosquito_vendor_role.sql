-- Fix info@mosquitofl.com role back to vendor

-- 1. Update the role to vendor
UPDATE profiles 
SET role = 'vendor' 
WHERE email = 'info@mosquitofl.com';

-- 2. Verify the change
SELECT 
    p.id as profile_id,
    p.email,
    p.role,
    p.full_name,
    v.id as vendor_id,
    v.name as vendor_name,
    v.category
FROM profiles p
LEFT JOIN vendors v ON v.owner_id = p.id
WHERE p.email = 'info@mosquitofl.com';
