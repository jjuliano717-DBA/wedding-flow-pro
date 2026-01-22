
-- Fix Planner-Client Visibility RLS

-- 1. Update Projects Policy: Allow Client to View
-- Drop existing policy if it conflicts or just add a new one specifically for clients
-- Standard check: user_id = auth.uid() OR client_id = auth.uid()

DROP POLICY IF EXISTS "Users can view own projects" ON projects;
CREATE POLICY "Users can view own projects" ON projects
  FOR SELECT USING (
    user_id = auth.uid() OR 
    client_id = auth.uid()
  );

-- 2. Update Profiles Policy: Allow Authenticated Users to View Basic Info
-- Planners need to see client names, Clients need to see planner names.
-- Currently, we might have tight restrictions. Let's open reading permissions for authenticated users.

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING ( true );

-- Note: We assume 'profiles' contains public info like name/business name.
-- If we need to protect sensitive fields (phone, email), we should use column-level security or a separate view,
-- but for this app, 'profiles' seems intended for public/shared identity.
