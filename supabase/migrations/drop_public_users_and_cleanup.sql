-- SAFE: Drop the public.users table entirely
-- This table appears to be a duplicate/legacy table that's causing foreign key issues

-- IMPORTANT: Run the analyze_public_users.sql script first to verify this is safe!

-- Step 1: Check what would be affected
SELECT 
    tc.table_schema, 
    tc.table_name,
    tc.constraint_name,
    kcu.column_name,
    'References public.users' as note
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND ccu.table_name = 'users'
    AND ccu.table_schema = 'public';

-- Step 2: Uncomment to drop the table
/*
-- Drop the public.users table (this will cascade and remove all foreign keys)
DROP TABLE IF EXISTS public.users CASCADE;

-- Verify it's gone
SELECT table_schema, table_name 
FROM information_schema.tables 
WHERE table_name = 'users';
*/

-- Step 3: After dropping public.users, you can safely delete from auth.users
/*
-- Delete from profiles first
DELETE FROM public.profiles
WHERE id IN (
    SELECT au.id
    FROM auth.users au
    LEFT JOIN public.profiles p ON au.id = p.id
    LEFT JOIN public.vendors v ON au.id = v.owner_id
    WHERE (p.role IS NULL OR p.role != 'admin')
      AND v.id IS NULL
);

-- Then delete from auth.users
DELETE FROM auth.users
WHERE id IN (
    SELECT au.id
    FROM auth.users au
    LEFT JOIN public.profiles p ON au.id = p.id
    LEFT JOIN public.vendors v ON au.id = v.owner_id
    WHERE (p.role IS NULL OR p.role != 'admin')
      AND v.id IS NULL
);

-- Show remaining users
SELECT 
    au.email,
    p.role,
    CASE 
        WHEN v.id IS NOT NULL THEN 'Has Vendor Profile'
        WHEN p.role = 'admin' THEN 'Admin'
        ELSE 'Other'
    END as status
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
LEFT JOIN public.vendors v ON au.id = v.owner_id
ORDER BY au.created_at DESC;
*/
