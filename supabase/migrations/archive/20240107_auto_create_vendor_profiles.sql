-- Enhanced auto-create profiles to also create vendor profiles for business users
-- This modifies the existing handle_new_user() function to create both profiles and vendors records
-- SKIPS BACKFILL to avoid orphaned profile issues

-- Drop existing trigger/function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create enhanced function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role TEXT;
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
  
  -- If user has a business role, also create vendor profile
  IF user_role IN ('vendor', 'venue', 'planner') THEN
    INSERT INTO public.vendors (
      owner_id,
      contact_email,
      business_name,
      category,
      created_at,
      updated_at
    )
    VALUES (
      NEW.id,
      NEW.email,
      'Business for ' || NEW.email,
      user_role,
      NOW(),
      NOW()
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Recreate trigger on auth.users table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Verify the trigger was created
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- =============================================
-- NOTE: Backfill skipped due to orphaned profiles
-- =============================================
-- Some profiles exist without corresponding auth.users records
-- These are likely from deleted users or test data
-- The trigger will handle all NEW signups going forward
-- 
-- To manually backfill for specific users, run:
-- INSERT INTO vendors (owner_id, contact_email, name, category, created_at, updated_at)
-- SELECT p.id, p.email, 'Business for ' || p.email, p.role, p.created_at, NOW()
-- FROM profiles p
-- INNER JOIN auth.users au ON au.id = p.id
-- LEFT JOIN vendors v ON v.owner_id = p.id
-- WHERE p.role IN ('vendor', 'venue', 'planner') AND v.id IS NULL;

-- Show current state
SELECT 
  'Profiles with business roles' as description,
  COUNT(*) as count
FROM public.profiles
WHERE role IN ('vendor', 'venue', 'planner')
UNION ALL
SELECT 
  'Vendor profiles' as description,
  COUNT(*) as count
FROM public.vendors;
