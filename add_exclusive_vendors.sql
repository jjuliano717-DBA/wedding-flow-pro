
-- Insert Exclusive Vendors from the Directory Page
-- Using upsert (ON CONFLICT) to update existing ones or insert new ones

INSERT INTO vendors (name, type, category, location, google_rating, google_reviews, heart_rating, exclusive, description)
VALUES
('Simply Sunshine Events',    'Planner',       'Planner',       'Los Angeles, CA',   4.9, 127, 5, true, 'Premier wedding planning service known for radiant and organized events.'),
('The Grovers Photography',   'Photographer',  'Photographer',  'San Francisco, CA', 5.0, 89,  5, true, 'Husband and wife photography team capturing timeless, romantic moments.'),
('Bloomington Florals',       'Florist',       'Florist',       'New York, NY',      4.8, 156, 5, true, 'Artistic floral designs bringing classic gardens to urban weddings.'),
('DJ Smooth Beats',           'DJ/Band',       'DJ/Band',       'Miami, FL',         4.7, 78,  5, true, 'High-energy DJ service specializing in modern mixes and packed dance floors.'),
('Gourmet Catering Co',       'Caterer',       'Caterer',       'Chicago, IL',       4.9, 201, 5, true, 'Award-winning catering with farm-to-table menus and exquisite presentation.'),
('Sweet Dreams Bakery',       'Cake Designer', 'Cake Designer', 'Nashville, TN',     4.8, 94,  5, true, 'Custom wedding cakes that taste as amazing as they look.'),
('Glamour Squad',             'Hair & Makeup', 'Hair & Makeup', 'Austin, TX',        4.9, 167, 5, true, 'On-location beauty team for flawless, long-lasting bridal looks.'),
('Cinema Love Films',         'Videographer',  'Videographer',  'Seattle, WA',       5.0, 54,  5, true, 'Story-driven wedding cinematography capturing the emotion of your day.'),
('Valley & Company Events',   'Planner',       'Planner',       'Denver, CO',        4.8, 112, 5, true, 'Full-service planning and design for mountain and destination weddings.'),
('Heather Durham Photography','Photographer',  'Photographer',  'Atlanta, GA',       4.9, 198, 5, true, 'Southern elegance meeting fine art photography.'),
('Garden of Eden Florals',    'Florist',       'Florist',       'Portland, OR',      4.7, 76,  5, true, 'Sustainable and lush floral arrangements for eco-conscious couples.'),
('The Harmony Band',          'DJ/Band',       'DJ/Band',       'Boston, MA',        4.9, 145, 5, true, 'Versatile live band covering everything from jazz classics to top 40 hits.')
ON CONFLICT (name) 
DO UPDATE SET 
    exclusive = true,
    location = EXCLUDED.location,
    google_rating = EXCLUDED.google_rating,
    google_reviews = EXCLUDED.google_reviews;
