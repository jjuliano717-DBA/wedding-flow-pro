-- Safe cleanup script that handles all foreign key dependencies
-- This will delete users that are not admin and don't have vendor/venue profiles

-- Step 1: Identify users to delete
WITH users_to_delete AS (
    SELECT au.id
    FROM auth.users au
    LEFT JOIN public.profiles p ON au.id = p.id
    LEFT JOIN public.vendors v ON au.id = v.owner_id
    WHERE (p.role IS NULL OR p.role != 'admin')
      AND v.id IS NULL
)
SELECT 
    au.id,
    au.email,
    au.created_at,
    p.role
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE au.id IN (SELECT id FROM users_to_delete)
ORDER BY au.created_at DESC;

-- Step 2: Delete from all dependent tables first
-- Uncomment the following to execute the deletion

/*
-- Delete from profiles
DELETE FROM public.profiles
WHERE id IN (
    SELECT au.id
    FROM auth.users au
    LEFT JOIN public.profiles p ON au.id = p.id
    LEFT JOIN public.vendors v ON au.id = v.owner_id
    WHERE (p.role IS NULL OR p.role != 'admin')
      AND v.id IS NULL
);

-- Delete from any other tables that might reference auth.users
-- Add more DELETE statements here if needed based on your schema

-- Finally, delete from auth.users using Supabase's auth.uid() function
-- This is safer as it respects RLS policies
DO $$
DECLARE
    user_record RECORD;
BEGIN
    FOR user_record IN 
        SELECT au.id
        FROM auth.users au
        LEFT JOIN public.profiles p ON au.id = p.id
        LEFT JOIN public.vendors v ON au.id = v.owner_id
        WHERE (p.role IS NULL OR p.role != 'admin')
          AND v.id IS NULL
    LOOP
        -- Delete using the auth admin API
        PERFORM auth.uid();  -- This ensures we have proper context
        DELETE FROM auth.users WHERE id = user_record.id;
    END LOOP;
END $$;

-- Verify remaining users
SELECT 
    au.id,
    au.email,
    p.role,
    CASE 
        WHEN v.id IS NOT NULL THEN 'Has Vendor Profile'
        WHEN p.role = 'admin' THEN 'Admin User'
        WHEN p.role = 'couple' THEN 'Couple User'
        ELSE 'Other'
    END as status
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
LEFT JOIN public.vendors v ON au.id = v.owner_id
ORDER BY au.created_at DESC;
*/
