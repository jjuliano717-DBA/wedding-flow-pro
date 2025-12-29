-- Comprehensive user cleanup script
-- Handles both public.users and auth.users tables safely

-- STEP 1: Preview what will be deleted from auth.users
SELECT 
    'auth.users' as table_name,
    au.id,
    au.email,
    au.created_at,
    p.role,
    CASE 
        WHEN v.id IS NOT NULL THEN 'Has Vendor Profile'
        WHEN p.role = 'admin' THEN 'Admin User'
        ELSE 'No Profile'
    END as status
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
LEFT JOIN public.vendors v ON au.id = v.owner_id
WHERE (p.role IS NULL OR p.role != 'admin')
  AND v.id IS NULL
ORDER BY au.created_at DESC;

-- STEP 2: Check if there's any data in public.users that needs cleanup
SELECT 
    'public.users' as table_name,
    COUNT(*) as total_count
FROM public.users;

-- STEP 3: Uncomment below to execute the deletion
/*
-- First, delete from public.profiles (if it exists and references auth.users)
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
-- Note: This will cascade to any tables with ON DELETE CASCADE
DELETE FROM auth.users
WHERE id IN (
    SELECT au.id
    FROM auth.users au
    LEFT JOIN public.profiles p ON au.id = p.id
    LEFT JOIN public.vendors v ON au.id = v.owner_id
    WHERE (p.role IS NULL OR p.role != 'admin')
      AND v.id IS NULL
);

-- Verify remaining users
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
