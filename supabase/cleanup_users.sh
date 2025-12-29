#!/bin/bash

# Script to safely delete test users from Supabase
# This preserves admin users and users with vendor/venue profiles

echo "🔍 Fetching users to delete..."

# First, get the list of users to delete (dry run)
supabase db execute "
SELECT 
    au.id,
    au.email,
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
"

echo ""
echo "⚠️  The users listed above will be deleted."
echo "Press Ctrl+C to cancel, or Enter to continue..."
read

echo "🗑️  Deleting users..."

# Use Supabase's built-in user deletion which handles all cascades properly
supabase db execute "
DO \$\$
DECLARE
    user_id_to_delete UUID;
BEGIN
    FOR user_id_to_delete IN 
        SELECT au.id
        FROM auth.users au
        LEFT JOIN public.profiles p ON au.id = p.id
        LEFT JOIN public.vendors v ON au.id = v.owner_id
        WHERE (p.role IS NULL OR p.role != 'admin')
          AND v.id IS NULL
    LOOP
        -- Delete from profiles first
        DELETE FROM public.profiles WHERE id = user_id_to_delete;
        
        -- Then delete from auth.users
        DELETE FROM auth.users WHERE id = user_id_to_delete;
        
        RAISE NOTICE 'Deleted user: %', user_id_to_delete;
    END LOOP;
END \$\$;
"

echo "✅ Cleanup complete!"
echo ""
echo "Remaining users:"
supabase db execute "
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
"
