-- Migration: Fix foreign keys to reference auth.users instead of public.users
-- This allows us to eventually drop public.users and clean up test users

-- IMPORTANT: This migration will:
-- 1. Update all foreign keys to point to auth.users
-- 2. Sync data from public.users to auth.users if needed
-- 3. Allow safe deletion of public.users table

BEGIN;

-- Step 1: Check if data in public.users matches auth.users
SELECT 
    'Data sync check' as step,
    COUNT(DISTINCT pu.id) as public_users_count,
    COUNT(DISTINCT au.id) as auth_users_count,
    COUNT(DISTINCT CASE WHEN pu.id = au.id THEN pu.id END) as matching_count
FROM public.users pu
FULL OUTER JOIN auth.users au ON pu.id = au.id;

-- Step 2: Drop existing foreign keys that reference public.users
ALTER TABLE public.venues DROP CONSTRAINT IF EXISTS venues_owner_id_fkey;
ALTER TABLE public.tasks DROP CONSTRAINT IF EXISTS tasks_user_id_fkey;
ALTER TABLE public.threads DROP CONSTRAINT IF EXISTS threads_user_id_fkey;
ALTER TABLE public.replies DROP CONSTRAINT IF EXISTS replies_user_id_fkey;
ALTER TABLE public.budget_scenarios DROP CONSTRAINT IF EXISTS budget_scenarios_user_id_fkey;

-- Step 3: Add new foreign keys that reference auth.users
ALTER TABLE public.venues 
ADD CONSTRAINT venues_owner_id_fkey 
FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.tasks 
ADD CONSTRAINT tasks_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.threads 
ADD CONSTRAINT threads_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.replies 
ADD CONSTRAINT replies_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.budget_scenarios 
ADD CONSTRAINT budget_scenarios_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 4: Verify the new constraints
SELECT
    tc.table_name,
    tc.constraint_name,
    kcu.column_name,
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name IN ('venues', 'tasks', 'threads', 'replies', 'budget_scenarios')
    AND kcu.column_name IN ('owner_id', 'user_id')
ORDER BY tc.table_name;

COMMIT;

-- Step 5: After migration, you can safely drop public.users
-- Uncomment when ready:
/*
DROP TABLE IF EXISTS public.users CASCADE;
*/

-- Step 6: Now you can safely delete test users from auth.users
-- Uncomment when ready:
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
