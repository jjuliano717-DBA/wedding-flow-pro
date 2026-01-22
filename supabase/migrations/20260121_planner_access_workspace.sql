
-- Enable Planner Access to Client Workspace Data
-- Purpose: Allow authenticated users (Planners) to view/edit data belonging to users (Clients) 
-- IF there is a valid project connection between them.

-- Helper function to check if requesting user is a planner for the target user
-- (Optimization: Materialized view or simple check. For RLS, simple check is best.)
-- BUT, RLS functions can be expensive. 
-- Simple approach: 
-- "Allow SELECT/INSERT/UPDATE on budget_scenarios IF 
--   1. user_id = auth.uid() (Own data)
--   2. OR EXISTS (SELECT 1 FROM projects WHERE projects.client_id = budget_scenarios.user_id AND projects.user_id = auth.uid())"

-- 1. Budget Scenarios Policies
DROP POLICY IF EXISTS "Users can manage own budget scenarios" ON budget_scenarios;
DROP POLICY IF EXISTS "Users can manage own and client budget scenarios" ON budget_scenarios;

CREATE POLICY "Users can manage own and client budget scenarios" ON budget_scenarios
  USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.client_id = budget_scenarios.user_id 
      AND projects.user_id = auth.uid()
    )
  )
  WITH CHECK (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.client_id = budget_scenarios.user_id 
      AND projects.user_id = auth.uid()
    )
  );


-- 2. Tasks Policies (Project Room)
DROP POLICY IF EXISTS "Users can manage own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can manage own and client tasks" ON tasks;

CREATE POLICY "Users can manage own and client tasks" ON tasks
  USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.client_id = tasks.user_id 
      AND projects.user_id = auth.uid()
    )
  )
  WITH CHECK (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.client_id = tasks.user_id 
      AND projects.user_id = auth.uid()
    )
  );

-- 3. Verify Projects Access (Already done, just adding comment)
-- Projects allow client_id = auth.uid() to see.

-- 4. Verify Profiles Access (Already done, public)
