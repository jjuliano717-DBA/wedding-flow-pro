-- FIX: Update trigger to use correct column name 'name' instead of 'business_name'
-- The vendors table has 'name' (NOT NULL), not 'business_name'

-- Drop and recreate the trigger function with correct column name
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role TEXT;
  existing_vendor_id UUID;
BEGIN
  -- Extract role from metadata
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'couple');
  
  -- Insert into profiles table
  INSERT INTO public.profiles (id, email, role, full_name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    user_role,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NOW(),
    NOW()
  );
  
  -- If user has a business role, create or claim vendor profile
  IF user_role IN ('vendor', 'venue', 'planner') THEN
    BEGIN
      -- Check if a vendor profile with this email already exists
      SELECT id INTO existing_vendor_id
      FROM public.vendors
      WHERE contact_email = NEW.email
      LIMIT 1;
      
      IF existing_vendor_id IS NOT NULL THEN
        -- Claim the existing vendor profile
        UPDATE public.vendors
        SET 
          owner_id = NEW.id,
          category = user_role,
          updated_at = NOW()
        WHERE id = existing_vendor_id
        AND owner_id IS NULL;  -- Only claim if unclaimed
        
        RAISE NOTICE 'Claimed existing vendor profile % for user %', existing_vendor_id, NEW.id;
      ELSE
        -- Create new vendor profile using 'name' column (NOT 'business_name')
        INSERT INTO public.vendors (
          owner_id,
          contact_email,
          name,
          category,
          created_at,
          updated_at
        )
        VALUES (
          NEW.id,
          NEW.email,
          COALESCE(NEW.raw_user_meta_data->>'full_name', 'Business for ' || NEW.email),
          user_role,
          NOW(),
          NOW()
        );
        
        RAISE NOTICE 'Created new vendor profile for user %', NEW.id;
      END IF;
    EXCEPTION WHEN OTHERS THEN
      -- Log detailed error information
      RAISE WARNING 'Vendor profile creation failed for user % (email: %): % (SQLSTATE: %)', 
        NEW.id, NEW.email, SQLERRM, SQLSTATE;
      -- Re-raise to fail the signup
      RAISE;
    END;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Verification
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
