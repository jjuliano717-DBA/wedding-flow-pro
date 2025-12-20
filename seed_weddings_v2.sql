
-- 1. Clean up potential duplicate column
ALTER TABLE real_weddings DROP COLUMN IF EXISTS couple_name;

-- 2. Add Columns (if not exist)
ALTER TABLE real_weddings ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE real_weddings ADD COLUMN IF NOT EXISTS vendors text[]; 
ALTER TABLE real_weddings ADD COLUMN IF NOT EXISTS exclusive boolean DEFAULT false;

-- 3. Security (RLS)
ALTER TABLE real_weddings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow Public Access" ON real_weddings;
CREATE POLICY "Allow Public Access" ON real_weddings FOR ALL USING (true) WITH CHECK (true);

-- 4. Constraint
ALTER TABLE real_weddings DROP CONSTRAINT IF EXISTS unique_couple_names;
-- Only add unique constraint if it doesn't exist (can't easily check IF NOT EXISTS for constraint in simple SQL, so we drop first)
ALTER TABLE real_weddings ADD CONSTRAINT unique_couple_names UNIQUE (couple_names);

-- 5. Seed Data using 'couple_names'
INSERT INTO real_weddings (couple_names, location, style, season, vendors, image_url, exclusive)
VALUES
('Sarah & Michael', 'Napa Valley, California', 'Garden Romance', 'Spring', ARRAY['Simply Sunshine Events', 'The Grovers Photography'], NULL, true),
('Emily & James', 'The Plaza, New York', 'Classic Elegance', 'Fall', ARRAY['Valley & Company Events', 'Heather Durham Photography'], NULL, true),
('Jessica & David', 'Rustic Ridge Barn, Tennessee', 'Rustic Chic', 'Summer', ARRAY['Creative Touch Party Design', 'Early Bird Vintage'], NULL, true),
('Amanda & Ryan', 'Turks & Caicos', 'Destination Beach', 'Winter', ARRAY['Brooke Keegan Special Events', 'The de Jaureguis'], NULL, true),
('Olivia & Thomas', 'Charleston, South Carolina', 'Southern Charm', 'Spring', ARRAY['Southern Elegance Events', 'Anne Rhett Photography'], NULL, true),
('Madison & William', 'Lake Como, Italy', 'Destination Beach', 'Summer', ARRAY['Italian Dreams Weddings', 'Luca Vieri Photography'], NULL, true),
('Sophia & Benjamin', 'Aspen, Colorado', 'Rustic Chic', 'Winter', ARRAY['Mountain Top Events', 'Carrie Patterson Photography'], NULL, true),
('Isabella & Alexander', 'Beverly Hills, California', 'Classic Elegance', 'Fall', ARRAY['Mindy Weiss Party Consultants', 'Jose Villa Photography'], NULL, true)
ON CONFLICT (couple_names)
DO UPDATE SET
    exclusive = true,
    location = EXCLUDED.location,
    style = EXCLUDED.style,
    season = EXCLUDED.season,
    vendors = EXCLUDED.vendors;
