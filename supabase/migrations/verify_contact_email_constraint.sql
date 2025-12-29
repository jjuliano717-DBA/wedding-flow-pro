-- =====================================================
-- Verification: Check if contact_email unique constraint exists
-- =====================================================

-- Check if the constraint exists
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'public.vendors'::regclass 
  AND conname = 'vendors_contact_email_key';

-- If the above returns a row, the constraint already exists!

-- Additional verification: Check all constraints on vendors table
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid = 'public.vendors'::regclass
ORDER BY conname;

-- Verify the column exists and check for any NULL values
SELECT 
    COUNT(*) as total_vendors,
    COUNT(contact_email) as vendors_with_email,
    COUNT(*) - COUNT(contact_email) as vendors_without_email
FROM vendors;

-- Check if there are any duplicate emails (should be 0 if constraint is working)
SELECT contact_email, COUNT(*) as count
FROM vendors 
WHERE contact_email IS NOT NULL
GROUP BY contact_email 
HAVING COUNT(*) > 1;
