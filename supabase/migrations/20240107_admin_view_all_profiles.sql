-- Fix infinite recursion in profiles RLS policy
-- The issue: the policy was querying profiles table to check if user is admin,
-- which triggered the same policy again, causing infinite recursion

-- Step 1: Drop the problematic policy
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Step 2: Create a helper function that bypasses RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Create a new policy using the helper function
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
    -- Allow if the user is an admin (using security definer function)
    public.is_admin()
    -- OR allow users to see their own profile
    OR id = auth.uid()
);

-- Verify the policy was created
SELECT 
    policyname,
    cmd,
    qual
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;
