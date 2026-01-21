-- =====================================================
-- FIX: Improve Signup Trigger to Use Business Name
-- =====================================================
-- This updates the handle_new_user() function to properly
-- use the business_name from signup metadata
-- =====================================================

-- Drop and recreate the function with proper business_name handling
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
    COALESCE(
      couple_names_value,  -- For couples, use couple_names
      NEW.raw_user_meta_data->>'full_name',  -- Otherwise use full_name 
      ''
    ),
    NOW(),
    NOW()
  );
  
  -- If user has a business role, create vendor profile
  IF user_role IN ('vendor', 'venue', 'planner') THEN
    INSERT INTO public.vendors (
      owner_id,
      name,
      business_name,
      contact_email,
      category,
      created_at,
      updated_at
    )
    VALUES (
      NEW.id,
      COALESCE(business_name_value, 'Business for ' || NEW.email),  -- Use actual business name
      COALESCE(business_name_value, 'Business for ' || NEW.email),  -- Use actual business name
      NEW.email,
      user_role,
      NOW(),
      NOW()
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Verify the function was updated
SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines
WHERE routine_name = 'handle_new_user'
AND routine_schema = 'public';
