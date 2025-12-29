-- =====================================================
-- CORRECTED FIX: Vendor Linkage for info@mosquitofl.com
-- =====================================================
-- Uses 'name' column (not 'business_name') as per actual schema
-- =====================================================

-- Step 1: Fix the current account linkage
DO $$
DECLARE
    profile_uuid UUID;
    vendor_uuid UUID;
BEGIN
    -- Get the profile ID
    SELECT id INTO profile_uuid FROM profiles WHERE email = 'info@mosquitofl.com';
    
    IF profile_uuid IS NULL THEN
        RAISE EXCEPTION 'Profile not found for info@mosquitofl.com';
    END IF;
    
    -- Check if there's already a vendor record for this owner_id
    SELECT id INTO vendor_uuid FROM vendors WHERE owner_id = profile_uuid;
    
    IF vendor_uuid IS NOT NULL THEN
        -- Update existing vendor record
        UPDATE vendors
        SET 
            name = 'Jason Juliano',
            contact_name = 'Jason Juliano',
            contact_email = 'info@mosquitofl.com',
            category = 'vendor',
            updated_at = NOW()
        WHERE id = vendor_uuid;
        RAISE NOTICE 'Updated existing vendor record: %', vendor_uuid;
    ELSE
        -- Check if there's an orphaned vendor with this name
        SELECT id INTO vendor_uuid FROM vendors WHERE name = 'Jason Juliano';
        
        IF vendor_uuid IS NOT NULL THEN
            -- Link the orphaned vendor to the profile
            UPDATE vendors
            SET 
                owner_id = profile_uuid,
                contact_email = 'info@mosquitofl.com',
                contact_name = 'Jason Juliano',
                category = 'vendor',
                updated_at = NOW()
            WHERE id = vendor_uuid;
            RAISE NOTICE 'Linked orphaned vendor to profile: %', vendor_uuid;
        ELSE
            -- Create new vendor record
            INSERT INTO vendors (
                owner_id,
                name,
                contact_name,
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
            );
            RAISE NOTICE 'Created new vendor record';
        END IF;
    END IF;
    
    -- Fix the role if needed
    UPDATE profiles SET role = 'vendor' WHERE id = profile_uuid AND role != 'vendor';
    RAISE NOTICE 'Role set to vendor';
END $$;

-- Step 2: Update the signup trigger to use correct column names
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role TEXT;
  business_name_value TEXT;
  couple_names_value TEXT;
BEGIN
  -- Extract values from metadata
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'couple');
  business_name_value := NEW.raw_user_meta_data->>'business_name';
  couple_names_value := NEW.raw_user_meta_data->>'couple_names';
  
  -- Insert into profiles table
  INSERT INTO public.profiles (id, email, role, full_name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    user_role,
    COALESCE(couple_names_value, NEW.raw_user_meta_data->>'full_name', ''),
    NOW(),
    NOW()
  );
  
  -- If user has a business role, create vendor profile
  IF user_role IN ('vendor', 'venue', 'planner') THEN
    INSERT INTO public.vendors (
      owner_id,
      name,
      contact_name,
      contact_email,
      category,
      created_at,
      updated_at
    )
    VALUES (
      NEW.id,
      COALESCE(business_name_value, 'Business for ' || NEW.email),  -- name = business name
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),  -- contact_name = person's name
      NEW.email,
      user_role,
      NOW(),
      NOW()
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Step 3: Verify everything worked
SELECT 
    p.id as profile_id,
    p.email,
    p.role,
    p.full_name as profile_name,
    v.id as vendor_id,
    v.name as business_name,
    v.contact_name,
    v.contact_email,
    v.owner_id
FROM profiles p
LEFT JOIN vendors v ON v.owner_id = p.id
WHERE p.email = 'info@mosquitofl.com';
