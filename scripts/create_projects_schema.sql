-- Update Projects Schema (Table already exists)
-- Aligning with: id, user_id, name, wedding_date, budget_total, etc.

-- 1. Ensure RLS is enabled
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 2. Ensure RLS Policy exists for owner access (using existing user_id)
DROP POLICY IF EXISTS "Manage own projects" ON projects;
CREATE POLICY "Manage own projects" ON projects
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 3. Update Referrals to link to Projects
ALTER TABLE referrals 
ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES projects(id) ON DELETE SET NULL;

-- 4. Index for referral lookups by project
CREATE INDEX IF NOT EXISTS idx_referrals_project ON referrals(project_id);
