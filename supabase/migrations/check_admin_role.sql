-- Check the admin user's role in the profiles table
SELECT 
    p.id,
    au.email,
    p.role,
    p.full_name
FROM public.profiles p
JOIN auth.users au ON p.id = au.id
WHERE au.email = 'admin@2planawedding.com';

-- Also check if there's any data in the old users table
SELECT 
    id,
    email,
    role
FROM public.users
WHERE email = 'admin@2planawedding.com';
