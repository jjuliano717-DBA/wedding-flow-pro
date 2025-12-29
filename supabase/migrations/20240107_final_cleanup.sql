-- Final cleanup: Drop public.users and delete test users from auth.users
-- Run this AFTER the FK migration has completed successfully

BEGIN;

-- Step 1: Drop the public.users table (no longer needed)
DROP TABLE IF EXISTS public.users CASCADE;

-- Verify it's gone
SELECT 'public.users dropped' as status,
       NOT EXISTS (
           SELECT 1 FROM information_schema.tables 
           WHERE table_schema = 'public' AND table_name = 'users'
       ) as success;

-- Step 2: Delete test users from auth.users
-- (Users without admin role and without vendor profiles)

-- First, delete from profiles
DELETE FROM public.profiles
WHERE id IN (
    SELECT au.id
    FROM auth.users au
    LEFT JOIN public.profiles p ON au.id = p.id
    LEFT JOIN public.vendors v ON au.id = v.owner_id
    WHERE (p.role IS NULL OR p.role != 'admin')
      AND v.id IS NULL
);

-- Then delete from auth.users (will cascade to all related tables)
DELETE FROM auth.users
WHERE id IN (
    SELECT au.id
    FROM auth.users au
    LEFT JOIN public.profiles p ON au.id = p.id
    LEFT JOIN public.vendors v ON au.id = v.owner_id
    WHERE (p.role IS NULL OR p.role != 'admin')
      AND v.id IS NULL
);

COMMIT;

-- Step 3: Show remaining users
SELECT 
    au.email,
    p.role,
    CASE 
        WHEN v.id IS NOT NULL THEN 'Has Vendor Profile'
        WHEN p.role = 'admin' THEN 'Admin'
        ELSE 'Other'
    END as status,
    au.created_at
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
LEFT JOIN public.vendors v ON au.id = v.owner_id
ORDER BY au.created_at DESC;
