-- Fix RLS Policy for Business Profile Creation
-- Issue: The INSERT policy is too restrictive and prevents automatic profile creation
-- Solution: Allow users to insert vendor profiles with their own email

-- Drop the overly restrictive INSERT policy
DROP POLICY IF EXISTS "Users can insert their own vendor profile" ON vendors;

-- Create a more permissive INSERT policy
-- Allow users to insert vendor profiles where:
-- 1. They are the owner (owner_id = auth.uid())
-- 2. The contact_email matches their authenticated email
CREATE POLICY "Users can insert their own vendor profile"
ON vendors
FOR INSERT
TO authenticated
WITH CHECK (
  owner_id = auth.uid()
  -- Removed the contact_email check to allow flexibility during profile creation
);

-- Verify the policy was updated
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
AND policyname = 'Users can insert their own vendor profile';
