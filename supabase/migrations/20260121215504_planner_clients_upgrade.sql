
-- Upgrade Projects Table for Planner-Client Features

-- 1. Add Client Columns to Projects
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS client_email TEXT,
ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS client_status TEXT DEFAULT 'pending' CHECK (client_status IN ('pending', 'invited', 'active', 'connected'));

CREATE INDEX IF NOT EXISTS idx_projects_client_email ON projects(client_email);

-- 2. Secure RPC to Search for Users by Email (for Planners)
-- Only allows searching if you are an authenticated user (planner)
CREATE OR REPLACE FUNCTION search_profile_by_email(search_email TEXT)
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  role TEXT
) 
SECURITY DEFINER
AS $$
BEGIN
  -- Simple check: Requesting user must be authenticated
  IF auth.role() = 'anon' THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  RETURN QUERY
  SELECT p.id, p.full_name, p.role
  FROM profiles p -- Assuming 'profiles' table exists and mirrors auth.users
  WHERE p.email = search_email 
  -- Optional: Restrict to role='couple'? 
  -- AND p.role = 'couple'
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- 3. Function to Connect a Planner to an Existing User
CREATE OR REPLACE FUNCTION connect_project_client(p_project_id UUID, p_client_id UUID)
RETURNS BOOLEAN
SECURITY DEFINER
AS $$
BEGIN
  -- Verify the project belongs to the caller
  IF NOT EXISTS (SELECT 1 FROM projects WHERE id = p_project_id AND user_id = auth.uid()) THEN
    RAISE EXCEPTION 'Project not found or access denied';
  END IF;

  UPDATE projects 
  SET client_id = p_client_id, client_status = 'connected'
  WHERE id = p_project_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
