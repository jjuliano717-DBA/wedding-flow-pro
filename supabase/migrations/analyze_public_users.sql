-- Check what's in public.users and how it relates to auth.users

-- 1. Compare public.users with auth.users
SELECT 
    'In both tables' as status,
    COUNT(*) as count
FROM public.users pu
INNER JOIN auth.users au ON pu.id = au.id

UNION ALL

SELECT 
    'Only in public.users' as status,
    COUNT(*) as count
FROM public.users pu
LEFT JOIN auth.users au ON pu.id = au.id
WHERE au.id IS NULL

UNION ALL

SELECT 
    'Only in auth.users' as status,
    COUNT(*) as count
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;

-- 2. Sample data from public.users
SELECT * FROM public.users LIMIT 5;

-- 3. Check if public.users is referenced by any other tables
SELECT
    tc.table_schema, 
    tc.table_name,
    tc.constraint_name,
    kcu.column_name
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
