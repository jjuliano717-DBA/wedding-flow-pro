-- FINAL FIX: Grant service_role bypass for RLS during trigger execution
-- The issue: Even with SECURITY DEFINER, RLS policies can block the trigger
-- Solution: Make the function owner a superuser or grant bypass privileges

-- First, let's check who owns the function
SELECT 
    p.proname AS function_name,
    pg_catalog.pg_get_userbyid(p.proowner) AS owner,
    p.prosecdef AS security_definer
FROM pg_catalog.pg_proc p
WHERE p.proname = 'handle_new_user';

-- The trigger function needs to bypass RLS
-- Option 1: Alter the function to run as postgres (superuser)
ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

-- Option 2: Grant the function permission to bypass RLS
GRANT ALL ON TABLE public.vendors TO postgres;
GRANT ALL ON TABLE public.profiles TO postgres;

-- Verify the change
SELECT 
    p.proname AS function_name,
    pg_catalog.pg_get_userbyid(p.proowner) AS owner,
    p.prosecdef AS security_definer
FROM pg_catalog.pg_proc p
WHERE p.proname = 'handle_new_user';
