-- Create trigger to automatically create profile on user signup
-- This ensures every new user gets a profile row with their role

-- Drop existing trigger/function if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, full_name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'couple'),  -- Extract role from metadata
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),   -- Extract full_name from metadata
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users table
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
-- BACKFILL: Create profiles for existing users
-- =============================================

-- Insert profiles for users who don't have one yet
INSERT INTO public.profiles (id, email, role, full_name, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'role', 'couple') as role,
  COALESCE(au.raw_user_meta_data->>'full_name', '') as full_name,
  au.created_at,
  au.updated_at
FROM auth.users au
LEFT JOIN public.profiles p ON p.id = au.id
WHERE p.id IS NULL;

-- Verify backfill results
SELECT 
  COUNT(*) as total_users,
  COUNT(p.id) as users_with_profiles,
  COUNT(*) - COUNT(p.id) as users_without_profiles
FROM auth.users au
LEFT JOIN public.profiles p ON p.id = au.id;

