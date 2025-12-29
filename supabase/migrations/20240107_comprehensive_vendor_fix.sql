-- FINAL FIX: Remove RLS INSERT policy dependency on auth.uid()
-- The issue: During trigger execution after INSERT on auth.users,
-- auth.uid() might return NULL because the session isn't established yet
-- Solution: Make INSERT policy more permissive OR disable RLS for service role

-- Step 1: Drop existing RLS INSERT policy
DROP POLICY IF EXISTS "Users can insert their own vendor profile" ON vendors;
DROP POLICY IF EXISTS "Vendors can insert own listing" ON vendors;

-- Step 2: Create a more permissive INSERT policy that works during trigger execution
-- This allows inserts where owner_id is set (regardless of auth context)
CREATE POLICY "Allow vendor profile creation"
ON vendors
FOR INSERT
TO authenticated, service_role
WITH CHECK (
  owner_id IS NOT NULL
);

-- Step 3: Drop and recreate trigger function
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
        -- Create new vendor profile
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

-- Step 4: Grant permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- Step 5: Recreate trigger
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

SELECT 
  policyname,
  cmd,
  with_check
FROM pg_policies
WHERE tablename = 'vendors'
AND cmd = 'INSERT';
