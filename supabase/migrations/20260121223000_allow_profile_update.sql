
-- Enable Profile Updates for Users
-- Issue: Users cannot save style matcher results (stored in 'profiles') because RLS likely blocks UPDATE.

-- 1. Create Policy for Profile Updates
-- Users should be able to update their OWN profile.

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (
    id = auth.uid()
  )
  WITH CHECK (
    id = auth.uid()
  );

-- 2. Ensure Insert is also allowed (if not already covered)
-- Usually profiles are created via trigger on signup, but explicit INSERT might be needed if triggers fail or manual creation.
-- Ideally we rely on triggers for creation, so only UPDATE is critical here.
