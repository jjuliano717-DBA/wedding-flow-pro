-- Simple test to see if we can insert a vendor record
-- This will show us the exact error

DO $$
DECLARE
    test_user_id UUID := gen_random_uuid();
    test_email TEXT := 'test_' || floor(random() * 100000)::text || '@test.com';
BEGIN
    RAISE NOTICE 'Testing vendor insert with user_id: %', test_user_id;
    RAISE NOTICE 'Testing with email: %', test_email;
    
    -- Try to insert a vendor record
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
        
        RAISE NOTICE '✓ SUCCESS: Vendor record created!';
        
        -- Clean up
        DELETE FROM public.vendors WHERE owner_id = test_user_id;
        RAISE NOTICE 'Test data cleaned up';
        
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '✗ FAILED: %', SQLERRM;
        RAISE NOTICE 'Error code: %', SQLSTATE;
        RAISE NOTICE 'Error detail: %', SQLERRM;
    END;
END $$;
