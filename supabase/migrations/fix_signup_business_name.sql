-- =============================================
-- Fix Signup Business Name Logic
-- Date: 2024-12-24
-- Purpose: Change signup trigger so business name
--          defaults to 'None' instead of user's full_name
-- =============================================

-- Drop and recreate trigger function with fixed business name logic
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
  -- Log that trigger was called
  INSERT INTO public.trigger_debug_log (user_id, user_email, step, message)
  VALUES (NEW.id, NEW.email, 'START', 'Trigger called');
  
  -- Extract role from metadata
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'couple');
  
  INSERT INTO public.trigger_debug_log (user_id, user_email, user_role, step, message)
  VALUES (NEW.id, NEW.email, user_role, 'ROLE_EXTRACTED', 'Role: ' || user_role);
  
  -- Insert into profiles table
  BEGIN
    INSERT INTO public.profiles (id, email, role, full_name, created_at, updated_at)
    VALUES (
      NEW.id,
      NEW.email,
      user_role,
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      NOW(),
      NOW()
    );
    
    INSERT INTO public.trigger_debug_log (user_id, user_email, step, message)
    VALUES (NEW.id, NEW.email, 'PROFILE_CREATED', 'Profile created successfully');
  EXCEPTION WHEN OTHERS THEN
    INSERT INTO public.trigger_debug_log (user_id, user_email, step, message, error_message)
    VALUES (NEW.id, NEW.email, 'PROFILE_ERROR', 'Profile creation failed', SQLERRM);
    RAISE;
  END;
  
  -- If user has a business role, create or claim vendor profile
  IF user_role IN ('vendor', 'venue', 'planner') THEN
    INSERT INTO public.trigger_debug_log (user_id, user_email, step, message)
    VALUES (NEW.id, NEW.email, 'VENDOR_CHECK', 'User is business role, checking for existing vendor');
    
    BEGIN
      -- Check if a vendor profile with this email already exists
      SELECT id INTO existing_vendor_id
      FROM public.vendors
      WHERE contact_email = NEW.email
      LIMIT 1;
      
      IF existing_vendor_id IS NOT NULL THEN
        INSERT INTO public.trigger_debug_log (user_id, user_email, step, message)
        VALUES (NEW.id, NEW.email, 'VENDOR_EXISTS', 'Found existing vendor: ' || existing_vendor_id::text);
        
        -- Claim the existing vendor profile
        UPDATE public.vendors
        SET 
          owner_id = NEW.id,
          category = user_role,
          updated_at = NOW()
        WHERE id = existing_vendor_id
        AND owner_id IS NULL;
        
        INSERT INTO public.trigger_debug_log (user_id, user_email, step, message)
        VALUES (NEW.id, NEW.email, 'VENDOR_CLAIMED', 'Claimed vendor profile');
      ELSE
        INSERT INTO public.trigger_debug_log (user_id, user_email, step, message)
        VALUES (NEW.id, NEW.email, 'VENDOR_CREATE', 'Creating new vendor profile');
        
        -- Create new vendor profile
        -- FIXED: Set name to 'None' instead of user's full_name
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
          'None',  -- Changed from: COALESCE(NEW.raw_user_meta_data->>'full_name', 'Business for ' || NEW.email)
          user_role,
          NOW(),
          NOW()
        );
        
        INSERT INTO public.trigger_debug_log (user_id, user_email, step, message)
        VALUES (NEW.id, NEW.email, 'VENDOR_CREATED', 'Vendor profile created successfully');
      END IF;
    EXCEPTION WHEN OTHERS THEN
      INSERT INTO public.trigger_debug_log (user_id, user_email, step, message, error_message)
      VALUES (NEW.id, NEW.email, 'VENDOR_ERROR', 'Vendor creation/claim failed', SQLERRM);
      RAISE;
    END;
  END IF;
  
  INSERT INTO public.trigger_debug_log (user_id, user_email, step, message)
  VALUES (NEW.id, NEW.email, 'COMPLETE', 'Trigger completed successfully');
  
  RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

SELECT 'Signup trigger fixed: Business name now defaults to None' AS status;
