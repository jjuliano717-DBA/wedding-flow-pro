
-- Enable RLS on vendors (good practice) or ensure it's on
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

-- Create policy to allow ALL operations (Select, Insert, Update, Delete) for everyone (Anon + Authenticated)
-- WARNING: This makes the vendors table publicly editable. For a real production app, restrict this to admin users.

-- 1. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public Access" ON vendors;
DROP POLICY IF EXISTS "Allow All" ON vendors;
DROP POLICY IF EXISTS "Enable read access for all users" ON vendors;

-- 2. Create wide-open policy for development
CREATE POLICY "Allow Public Access" 
ON vendors
FOR ALL 
USING (true) 
WITH CHECK (true);
