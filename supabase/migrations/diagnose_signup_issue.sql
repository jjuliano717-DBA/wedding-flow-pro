-- DIAGNOSTIC SCRIPT: Find out why venue signup is failing
-- Run this in Supabase SQL Editor to diagnose the issue

-- =============================================
-- 1. Check if trigger exists and is enabled
-- =============================================
SELECT 
  trigger_name,
  event_manipulation,
  action_timing,
  action_statement,
  action_orientation
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- =============================================
-- 2. Check RLS policies on vendors table
-- =============================================
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'vendors'
ORDER BY cmd, policyname;

-- =============================================
-- 3. Check all constraints on vendors table
-- =============================================
SELECT
    con.conname AS constraint_name,
    con.contype AS constraint_type,
    CASE con.contype
        WHEN 'c' THEN 'CHECK'
        WHEN 'f' THEN 'FOREIGN KEY'
        WHEN 'p' THEN 'PRIMARY KEY'
        WHEN 'u' THEN 'UNIQUE'
        WHEN 't' THEN 'TRIGGER'
        WHEN 'x' THEN 'EXCLUSION'
    END AS constraint_type_desc,
    pg_get_constraintdef(con.oid) AS constraint_definition
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
WHERE rel.relname = 'vendors'
ORDER BY con.contype;

-- =============================================
-- 4. Check vendors table structure
-- =============================================
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'vendors'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- =============================================
-- 5. Test the trigger manually (SAFE TEST)
-- =============================================
-- This simulates what happens during signup
DO $$
DECLARE
    test_user_id UUID := gen_random_uuid();
    test_email TEXT := 'diagnostic_test_' || floor(random() * 100000)::text || '@test.com';
    profile_exists BOOLEAN;
    vendor_exists BOOLEAN;
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Starting diagnostic test for user: %', test_email;
    RAISE NOTICE '========================================';
    
    -- Simulate creating a user (without actually inserting into auth.users)
    -- Instead, we'll manually call what the trigger would do
    
    BEGIN
        -- Step 1: Create profile
        INSERT INTO public.profiles (id, email, role, full_name, created_at, updated_at)
        VALUES (
            test_user_id,
            test_email,
            'venue',
            'Test Venue',
            NOW(),
            NOW()
        );
        RAISE NOTICE '✓ Profile created successfully';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '✗ Profile creation failed: % (SQLSTATE: %)', SQLERRM, SQLSTATE;
        RETURN;
    END;
    
    -- Step 2: Create vendor profile
    BEGIN
        INSERT INTO public.vendors (
            owner_id,
            contact_email,
            name,
            category,
            created_at,
            updated_at
        )
        VALUES (
            test_user_id,
            test_email,
            'Test Venue Business',
            'venue',
            NOW(),
            NOW()
        );
        RAISE NOTICE '✓ Vendor profile created successfully';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '✗ Vendor profile creation failed: % (SQLSTATE: %)', SQLERRM, SQLSTATE;
        RAISE NOTICE 'Error detail: %', SQLERRM;
        -- Clean up profile
        DELETE FROM public.profiles WHERE id = test_user_id;
        RETURN;
    END;
    
    -- Verify both were created
    SELECT EXISTS(SELECT 1 FROM profiles WHERE id = test_user_id) INTO profile_exists;
    SELECT EXISTS(SELECT 1 FROM vendors WHERE owner_id = test_user_id) INTO vendor_exists;
    
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Test Results:';
    RAISE NOTICE 'Profile exists: %', profile_exists;
    RAISE NOTICE 'Vendor exists: %', vendor_exists;
    RAISE NOTICE '========================================';
    
    -- Clean up
    DELETE FROM public.vendors WHERE owner_id = test_user_id;
    DELETE FROM public.profiles WHERE id = test_user_id;
    RAISE NOTICE 'Test data cleaned up';
    
END $$;
