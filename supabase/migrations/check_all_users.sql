-- Check all users in the profiles table
SELECT 
    p.id,
    au.email,
    p.role,
    p.full_name,
    p.created_at,
    CASE 
        WHEN v.id IS NOT NULL THEN 'Has Vendor Profile'
        WHEN p.role = 'admin' THEN 'Admin'
        ELSE 'Regular User'
    END as status
FROM public.profiles p
JOIN auth.users au ON p.id = au.id
LEFT JOIN public.vendors v ON p.id = v.owner_id
ORDER BY p.created_at DESC;
