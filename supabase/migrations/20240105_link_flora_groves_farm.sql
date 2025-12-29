-- Fix: Link Flora Groves Farm to venue@demo.com
-- This script updates the venue to have the correct contact_email
-- so it can be claimed by the venue@demo.com user account

-- First, let's find the user ID for venue@demo.com
DO $$
DECLARE
    v_user_id UUID;
    v_venue_id UUID;
BEGIN
    -- Get the user ID for venue@demo.com
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = 'venue@demo.com';
    
    IF v_user_id IS NULL THEN
        RAISE NOTICE 'User venue@demo.com not found. Please create this user account first.';
    ELSE
        RAISE NOTICE 'Found user: % with ID: %', 'venue@demo.com', v_user_id;
        
        -- Get the venue ID for Flora Groves Farm
        SELECT id INTO v_venue_id
        FROM vendors
        WHERE name = 'Flora Groves Farm';
        
        IF v_venue_id IS NULL THEN
            RAISE NOTICE 'Venue "Flora Groves Farm" not found.';
        ELSE
            RAISE NOTICE 'Found venue: % with ID: %', 'Flora Groves Farm', v_venue_id;
            
            -- Update the venue with contact_email and owner_id
            UPDATE vendors
            SET 
                contact_email = 'venue@demo.com',
                owner_id = v_user_id,
                updated_at = NOW()
            WHERE id = v_venue_id;
            
            RAISE NOTICE 'Successfully linked Flora Groves Farm to venue@demo.com';
        END IF;
    END IF;
END $$;

-- Verify the update
SELECT 
    v.id,
    v.name,
    v.contact_email,
    v.owner_id,
    u.email as owner_email,
    CASE 
        WHEN v.owner_id = u.id THEN '✅ LINKED'
        WHEN v.owner_id IS NULL THEN '⚠️ UNCLAIMED'
        ELSE '❌ MISMATCH'
    END as status
FROM vendors v
LEFT JOIN auth.users u ON v.owner_id = u.id
WHERE v.name = 'Flora Groves Farm';
