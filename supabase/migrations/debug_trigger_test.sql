-- DEBUG: Test manual vendor profile creation
-- This script helps diagnose why the trigger is failing

-- First, let's check if the trigger exists and is enabled
SELECT 
  trigger_name,
  event_manipulation,
  action_statement,
  action_timing,
  event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Check the RLS policies on vendors table
SELECT 
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'vendors';

-- Check if there are any other constraints on vendors table
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
WHERE rel.relname = 'vendors';

-- Test: Try to manually create a test user and vendor profile
-- This will help us see the exact error
DO $$
DECLARE
    test_user_id UUID;
    test_email TEXT := 'debug_test_' || floor(random() * 10000)::text || '@test.com';
BEGIN
    -- Create a test auth user
    INSERT INTO auth.users (
        id,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_user_meta_data,
        created_at,
        updated_at,
        instance_id,
        aud,
        role
    )
    VALUES (
        gen_random_uuid(),
        test_email,
        crypt('test_password', gen_salt('bf')),
        NOW(),
        jsonb_build_object('role', 'venue', 'full_name', 'Debug Test Venue'),
        NOW(),
        NOW(),
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated'
    )
    RETURNING id INTO test_user_id;
    
    RAISE NOTICE 'Test user created with ID: %', test_user_id;
    RAISE NOTICE 'Check if profile was created automatically...';
    
    -- Check if profile was created
    IF EXISTS (SELECT 1 FROM profiles WHERE id = test_user_id) THEN
        RAISE NOTICE 'Profile created successfully!';
    ELSE
        RAISE WARNING 'Profile was NOT created!';
    END IF;
    
    -- Check if vendor was created
    IF EXISTS (SELECT 1 FROM vendors WHERE owner_id = test_user_id) THEN
        RAISE NOTICE 'Vendor profile created successfully!';
    ELSE
        RAISE WARNING 'Vendor profile was NOT created!';
    END IF;
    
    -- Clean up
    DELETE FROM auth.users WHERE id = test_user_id;
    RAISE NOTICE 'Test user cleaned up';
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error occurred: %', SQLERRM;
    RAISE NOTICE 'Error detail: %', SQLSTATE;
END $$;
