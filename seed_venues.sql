
-- 1. Add Columns to venues table
ALTER TABLE venues ADD COLUMN IF NOT EXISTS type text;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS location text;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS capacity text;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS capacity_num integer;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS price text;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS google_rating numeric;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS google_reviews integer;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS indoor boolean DEFAULT false;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS outdoor boolean DEFAULT false;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS exclusive boolean DEFAULT false;

-- 2. Add Constraints
ALTER TABLE venues ADD CONSTRAINT check_venue_google_rating CHECK (google_rating >= 1 AND google_rating <= 5);
ALTER TABLE venues ADD CONSTRAINT unique_venue_name UNIQUE (name);

-- 3. Fix Permissions (RLS)
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow Public Access" ON venues;
CREATE POLICY "Allow Public Access" ON venues FOR ALL USING (true) WITH CHECK (true);

-- 4. Seed Data
INSERT INTO venues (name, type, location, capacity, capacity_num, price, google_rating, google_reviews, indoor, outdoor, image_url, exclusive)
VALUES
('The Grand Estate', 'Garden & Estate', 'Napa Valley, CA', '50-300', 300, '$$$$', 4.9, 127, true, true, NULL, true),
('Rosewood Ballroom', 'Ballroom', 'New York, NY', '100-500', 500, '$$$$', 4.8, 89, true, false, NULL, true),
('Harvest Moon Barn', 'Rustic Barn', 'Nashville, TN', '75-250', 250, '$$$', 4.9, 156, true, true, NULL, true),
('Sunset Beach Resort', 'Waterfront', 'Malibu, CA', '50-200', 200, '$$$$', 5.0, 78, true, true, NULL, true),
('The Historic Manor', 'Historic', 'Charleston, SC', '100-350', 350, '$$$', 4.7, 201, true, true, NULL, true),
('Mountain View Lodge', 'Mountain', 'Aspen, CO', '50-150', 150, '$$$$', 4.9, 94, true, true, NULL, true),
('Urban Loft Gallery', 'Loft/Industrial', 'Chicago, IL', '75-200', 200, '$$', 4.8, 167, true, false, NULL, true),
('Vineyard Vista', 'Winery', 'Sonoma, CA', '100-300', 300, '$$$', 4.9, 54, true, true, NULL, true),
('Garden Terrace', 'Garden & Estate', 'Austin, TX', '50-175', 175, '$$', 4.6, 112, false, true, NULL, true),
('The Crystal Palace', 'Ballroom', 'Miami, FL', '150-600', 600, '$$$$', 4.8, 198, true, false, NULL, true),
('Lakeside Retreat', 'Waterfront', 'Lake Tahoe, CA', '75-250', 250, '$$$', 4.9, 76, true, true, NULL, true),
('The Old Mill', 'Rustic Barn', 'Portland, OR', '50-180', 180, '$$', 4.7, 145, true, true, NULL, true)
ON CONFLICT (name) 
DO UPDATE SET 
    exclusive = true,
    location = EXCLUDED.location, 
    google_rating = EXCLUDED.google_rating, 
    google_reviews = EXCLUDED.google_reviews;
