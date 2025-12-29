-- =====================================================
-- FIX: Vendor Linkage Issue for info@mosquitofl.com
-- =====================================================
-- Problem: The signup trigger creates generic vendor records
-- instead of using the actual business_name from signup metadata
-- =====================================================

-- Step 1: Fix the current broken linkage
-- Find the profile ID for info@mosquitofl.com
DO $$
DECLARE
    profile_uuid UUID;
    vendor_uuid UUID;
BEGIN
    -- Get the profile ID
    SELECT id INTO profile_uuid 
    FROM profiles 
    WHERE email = 'info@mosquitofl.com';
    
    IF profile_uuid IS NULL THEN
        RAISE EXCEPTION 'Profile not found for info@mosquitofl.com';
    END IF;
    
    -- Check if there's already a vendor record for this owner_id
    SELECT id INTO vendor_uuid
    FROM vendors
    WHERE owner_id = profile_uuid;
    
    IF vendor_uuid IS NOT NULL THEN
        -- Update existing vendor record
        UPDATE vendors
        SET 
            name = 'Jason Juliano',
            business_name = 'Jason Juliano',
            contact_email = 'info@mosquitofl.com',
            category = 'vendor',
            updated_at = NOW()
        WHERE id = vendor_uuid;
        
        RAISE NOTICE 'Updated existing vendor record: %', vendor_uuid;
    ELSE
        -- Check if there's an orphaned vendor with this name
        SELECT id INTO vendor_uuid
        FROM vendors
        WHERE name = 'Jason Juliano' OR business_name = 'Jason Juliano';
        
        IF vendor_uuid IS NOT NULL THEN
            -- Link the orphaned vendor to the profile
            UPDATE vendors
            SET 
                owner_id = profile_uuid,
                contact_email = 'info@mosquitofl.com',
                category = 'vendor',
                updated_at = NOW()
            WHERE id = vendor_uuid;
            
            RAISE NOTICE 'Linked orphaned vendor to profile: %', vendor_uuid;
        ELSE
            -- Create new vendor record
            INSERT INTO vendors (
                owner_id,
                name,
                business_name,
                contact_email,
                category,
                created_at,
                updated_at
            ) VALUES (
                profile_uuid,
                'Jason Juliano',
                'Jason Juliano',
                'info@mosquitofl.com',
                'vendor',
                NOW(),
                NOW()
            ) RETURNING id INTO vendor_uuid;
            
            RAISE NOTICE 'Created new vendor record: %', vendor_uuid;
        END IF;
    END IF;
    
    -- Also fix the role if needed
    UPDATE profiles
    SET role = 'vendor'
    WHERE id = profile_uuid AND role != 'vendor';
END $$;

-- Step 2: Verify the fix
SELECT 
    p.id as profile_id,
    p.email,
    p.role,
    p.full_name as profile_name,
    v.id as vendor_id,
    v.name as vendor_name,
    v.business_name,
    v.contact_email,
    v.owner_id
FROM profiles p
LEFT JOIN vendors v ON v.owner_id = p.id
WHERE p.email = 'info@mosquitofl.com';
