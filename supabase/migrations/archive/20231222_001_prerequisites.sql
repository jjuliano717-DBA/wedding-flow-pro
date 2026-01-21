-- =============================================
-- Prerequisite Tables for Smart Assets Migration
-- Run this BEFORE 20231222_smart_assets_availability.sql
-- =============================================

-- =============================================
-- 1. CREATE PROFILES TABLE (extends auth.users)
-- =============================================

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    role TEXT NOT NULL CHECK (role IN ('couple', 'vendor', 'planner', 'venue', 'admin')),
    full_name TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies: Users can view and update their own profile
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Create updated_at trigger
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 2. CREATE VENDORS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    type TEXT,
    category TEXT,
    location TEXT,
    description TEXT,
    website TEXT,
    image_url TEXT,
    google_rating DECIMAL(2,1),
    google_reviews INTEGER,
    heart_rating DECIMAL(2,1),
    exclusive BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

-- Policies: Everyone can view vendors, only vendor owners can update
CREATE POLICY "Anyone can view vendors"
    ON vendors FOR SELECT
    USING (true);

CREATE POLICY "Vendors can update own listing"
    ON vendors FOR UPDATE
    USING (owner_id = auth.uid());

CREATE POLICY "Vendors can insert own listing"
    ON vendors FOR INSERT
    WITH CHECK (owner_id = auth.uid());

-- Create updated_at trigger
CREATE TRIGGER update_vendors_updated_at
    BEFORE UPDATE ON vendors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create index
CREATE INDEX IF NOT EXISTS idx_vendors_owner ON vendors(owner_id);

-- =============================================
-- 3. CREATE PROJECTS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    wedding_date DATE,
    guest_count INTEGER,
    budget_total INTEGER, -- in cents
    location TEXT,
    style TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only manage their own projects
CREATE POLICY "Users can view own projects"
    ON projects FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert own projects"
    ON projects FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own projects"
    ON projects FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete own projects"
    ON projects FOR DELETE
    USING (user_id = auth.uid());

-- Planners can view client projects (optional - enable if needed)
-- CREATE POLICY "Planners can view client projects"
--     ON projects FOR SELECT
--     USING (EXISTS (
--         SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'planner'
--     ));

-- Create updated_at trigger
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create index
CREATE INDEX idx_projects_user ON projects(user_id);

-- =============================================
-- 4. MIGRATE EXISTING DATA (if applicable)
-- =============================================

-- If you have a 'users' table with role column, sync to profiles
INSERT INTO profiles (id, email, role, created_at, updated_at)
SELECT 
    id,
    email,
    role,
    created_at,
    COALESCE(updated_at, created_at) as updated_at
FROM users
WHERE id NOT IN (SELECT id FROM profiles)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- VERIFICATION
-- =============================================

-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'vendors', 'projects')
ORDER BY table_name;

-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('profiles', 'vendors', 'projects');

COMMENT ON TABLE profiles IS 'User profiles extending auth.users with role-based permissions';
COMMENT ON TABLE vendors IS 'Vendor/business listings for wedding services';
COMMENT ON TABLE projects IS 'Wedding planning projects (one per couple/event)';
