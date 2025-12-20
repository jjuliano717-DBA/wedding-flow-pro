
-- 1. Add Columns
ALTER TABLE real_weddings ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE real_weddings ADD COLUMN IF NOT EXISTS vendors text[]; -- Array of strings for vendor names
ALTER TABLE real_weddings ADD COLUMN IF NOT EXISTS exclusive boolean DEFAULT false;

-- ensure couple_name is used (aligning with AdminDashboard interface) or alias it? 
-- The component uses 'couple', AdminDashboard uses 'couple_name'. 
-- Let's check if 'couple_name' exists or if we need to add it. 
-- Assuming standard naming, let's add 'couple' as an alias or just use 'couple_name' and map it in the frontend.
ALTER TABLE real_weddings ADD COLUMN IF NOT EXISTS couple_name text;

-- 2. Security (RLS)
ALTER TABLE real_weddings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow Public Access" ON real_weddings;
CREATE POLICY "Allow Public Access" ON real_weddings FOR ALL USING (true) WITH CHECK (true);

-- 3. Seed Data
-- Using ON CONFLICT to update if exists. Assuming 'couple_name' is unique enough or we add a constraint.
-- Let's add a unique constraint on couple_name for safety.
ALTER TABLE real_weddings ADD CONSTRAINT unique_couple_name UNIQUE (couple_name);

INSERT INTO real_weddings (couple_name, location, style, season, vendors, image_url, exclusive)
VALUES
('Sarah & Michael', 'Napa Valley, California', 'Garden Romance', 'Spring', ARRAY['Simply Sunshine Events', 'The Grovers Photography'], NULL, true),
('Emily & James', 'The Plaza, New York', 'Classic Elegance', 'Fall', ARRAY['Valley & Company Events', 'Heather Durham Photography'], NULL, true),
('Jessica & David', 'Rustic Ridge Barn, Tennessee', 'Rustic Chic', 'Summer', ARRAY['Creative Touch Party Design', 'Early Bird Vintage'], NULL, true),
('Amanda & Ryan', 'Turks & Caicos', 'Destination Beach', 'Winter', ARRAY['Brooke Keegan Special Events', 'The de Jaureguis'], NULL, true),
('Olivia & Thomas', 'Charleston, South Carolina', 'Southern Charm', 'Spring', ARRAY['Southern Elegance Events', 'Anne Rhett Photography'], NULL, true),
('Madison & William', 'Lake Como, Italy', 'Destination Beach', 'Summer', ARRAY['Italian Dreams Weddings', 'Luca Vieri Photography'], NULL, true),
('Sophia & Benjamin', 'Aspen, Colorado', 'Rustic Chic', 'Winter', ARRAY['Mountain Top Events', 'Carrie Patterson Photography'], NULL, true),
('Isabella & Alexander', 'Beverly Hills, California', 'Classic Elegance', 'Fall', ARRAY['Mindy Weiss Party Consultants', 'Jose Villa Photography'], NULL, true)
ON CONFLICT (couple_name)
DO UPDATE SET
    exclusive = true,
    location = EXCLUDED.location,
    style = EXCLUDED.style,
    season = EXCLUDED.season,
    vendors = EXCLUDED.vendors;
