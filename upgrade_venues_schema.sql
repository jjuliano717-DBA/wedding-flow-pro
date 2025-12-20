-- Upgrade venues table for rich detail page

-- 1. Add new columns
ALTER TABLE venues ADD COLUMN IF NOT EXISTS images text[]; -- Array of gallery URLs
ALTER TABLE venues ADD COLUMN IF NOT EXISTS amenities text[]; -- List of features
ALTER TABLE venues ADD COLUMN IF NOT EXISTS website text;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS contact_email text;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS address text; -- Full address for map
ALTER TABLE venues ADD COLUMN IF NOT EXISTS coordinates point; -- Lat/Long for map (optional, using address is easier for google maps link)
ALTER TABLE venues ADD COLUMN IF NOT EXISTS faq jsonb; -- Array of {question, answer} objects

-- 2. Seed some rich data for existing venues (updating a few as examples)

-- "The Grand Estate"
UPDATE venues 
SET 
    images = ARRAY[
        'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1519225468759-428dbe8aa33f?auto=format&fit=crop&w=800&q=80', 
        'https://images.unsplash.com/photo-1464366400600-7168b8af9bc6?auto=format&fit=crop&w=800&q=80'
    ],
    amenities = ARRAY['Bridal Suite', 'On-site Catering', 'Valet Parking', 'Wheelchair Access', 'WiFi'],
    website = 'https://www.grandestate.com',
    contact_email = 'events@grandestate.com',
    faq = '[
        {"question": "What is the rental fee?", "answer": "Rental fees vary by season, ranging from $5,000 to $12,000."},
        {"question": "Is alcohol allowed?", "answer": "Yes, we have a fully licensed bar service."},
        {"question": "Can we bring our own vendors?", "answer": "We have a preferred vendor list, but outside vendors are allowed with approval."}
    ]'::jsonb,
    address = '123 Estate Drive, Beverly Hills, CA 90210'
WHERE name = 'The Grand Estate';

-- "Rustic Barn"
UPDATE venues 
SET 
    images = ARRAY[
        'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1510076857177-7470076d4098?auto=format&fit=crop&w=800&q=80'
    ],
    amenities = ARRAY['Outdoor Ceremony Area', 'Pet Friendly', 'Fire Pit', 'Parking'],
    website = 'https://www.rusticbarn.com',
    contact_email = 'hello@rusticbarn.com',
    faq = '[
        {"question": "Is there heating/AC?", "answer": "The main barn is climate controlled for year-round comfort."},
        {"question": "What is the capacity?", "answer": "We can accommodate up to 200 guests seated."}
    ]'::jsonb,
    address = '456 Country Road, Nashville, TN 37203'
WHERE name = 'Rustic Barn';

-- Generic update for others to avoid nulls
UPDATE venues 
SET 
    images = ARRAY[image_url] 
WHERE images IS NULL;

UPDATE venues
SET amenities = ARRAY['Parking', 'Restrooms', 'Tables & Chairs']
WHERE amenities IS NULL;
