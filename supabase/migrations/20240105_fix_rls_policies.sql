-- Fix RLS Policies for Business Profile Linking
-- This ensures users can read vendor profiles by contact_email to enable claiming

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read vendors by contact email" ON vendors;
DROP POLICY IF EXISTS "Users can update their own vendor profile" ON vendors;
DROP POLICY IF EXISTS "Users can insert their own vendor profile" ON vendors;

-- Allow users to READ vendor profiles that match their email (for claiming)
CREATE POLICY "Users can read vendors by contact email"
ON vendors
FOR SELECT
TO authenticated
USING (
  contact_email = auth.jwt() ->> 'email'
  OR owner_id = auth.uid()
  OR owner_id IS NULL  -- Allow viewing unclaimed profiles
);

-- Allow users to UPDATE vendor profiles they own OR claim unclaimed ones with their email
CREATE POLICY "Users can update their own vendor profile"
ON vendors
FOR UPDATE
TO authenticated
USING (
  owner_id = auth.uid()
  OR (owner_id IS NULL AND contact_email = auth.jwt() ->> 'email')
)
WITH CHECK (
  owner_id = auth.uid()
);

-- Allow users to INSERT new vendor profiles for themselves
CREATE POLICY "Users can insert their own vendor profile"
ON vendors
FOR INSERT
TO authenticated
WITH CHECK (
  owner_id = auth.uid()
  AND contact_email = auth.jwt() ->> 'email'
);

-- Verify the policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'vendors'
ORDER BY policyname;
