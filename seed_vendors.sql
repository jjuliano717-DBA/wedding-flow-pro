
-- 1. Add constraints to lock ratings between 1 and 5
ALTER TABLE vendors ADD CONSTRAINT check_google_rating CHECK (google_rating >= 1 AND google_rating <= 5);
ALTER TABLE vendors ADD CONSTRAINT check_heart_rating CHECK (heart_rating >= 1 AND heart_rating <= 5);

-- 2. Insert 20 Vendors
INSERT INTO vendors (name, category, type, google_rating, google_reviews, heart_rating, location, description, exclusive)
VALUES
('Original Weddings', 'Photographer', 'Photographer', 4.9, 677, 5, 'Tampa, FL', 'High-capacity team providing synchronized photo and video for large events.', false),
('Munoz Photography', 'Photographer', 'Photographer', 4.9, 194, 5, 'Fort Lauderdale, FL', 'Award-winning studio specializing in high-fashion, editorial wedding imagery.', false),
('Iyrus Weddings', 'Photographer', 'Photographer', 5, 140, 5, 'Tampa, FL', 'Highly reviewed for storytelling and emotional candid photography.', false),
('Flowers by Fudgie', 'Florist', 'Florist', 4.9, 264, 4, 'Sarasota, FL', 'Luxury event florist specializing in custom designs for high-end coastal venues.', false),
('Eve’s Florist', 'Florist', 'Florist', 4.8, 135, 4, 'Tampa, FL', 'Dedicated to personalized bridal bouquets and floral venue transformations.', false),
('Beneva Flowers', 'Florist', 'Florist', 4.8, 310, 4, 'Sarasota, FL', 'High-volume luxury florist with specialized event planning consultants.', false),
('Eddie B & Company', 'DJ/Band', 'DJ/Band', 4.9, 1583, 5, 'Fort Lauderdale, FL', 'Full-service entertainment including live bands, DJs, and lighting effects.', false),
('Joe Farren Music', 'DJ/Band', 'DJ/Band', 5, 143, 5, 'Tampa, FL', 'Multi-instrumentalist providing live acoustic sets and high-energy DJ services.', false),
('Soundwave Ent.', 'DJ/Band', 'DJ/Band', 5, 571, 5, 'Orlando, FL', 'Specialized in LED lighting design and professional MC services.', false),
('Good Food Events', 'Caterer', 'Caterer', 4.9, 118, 5, 'Tampa, FL', 'Innovative custom menus with full-service event decor and rentals.', false),
('Arthur’s Catering', 'Caterer', 'Caterer', 4.8, 240, 4, 'Altamonte Springs, FL', 'Established caterer known for creative food stations and plated excellence.', false),
('Just Think Cake', 'Cake Designer', 'Cake Designer', 4.9, 408, 5, 'Ft. Walton Beach, FL', 'Expert in architectural wedding cakes and high-detail sugar artistry.', false),
('The Artistic Whisk', 'Cake Designer', 'Cake Designer', 4.9, 138, 5, 'St. Petersburg, FL', 'Luxury bakery focusing on European-style scratch-made wedding cakes.', false),
('Elegant Pairings', 'Planner', 'Planner', 5, 112, 5, 'Pensacola, FL', 'Full-service destination wedding planners with high-touch coordination.', false),
('Florida Sun Weddings', 'Planner', 'Planner', 5, 225, 5, 'Sarasota, FL', 'Specialized in Gulf Coast beach wedding elopements and ceremonies.', false),
('Renata Hair & Makeup', 'Hair & Makeup', 'Hair & Makeup', 4.9, 253, 5, 'Miami, FL', 'Premier bridal glam team focusing on long-wear, camera-ready styles.', false),
('Looking Like a Star', 'Hair & Makeup', 'Hair & Makeup', 5, 95, 5, 'Miami, FL', 'Mobile hair and makeup team specializing in luxury bridal transformations.', false),
('Cinemedia', 'Videographer', 'Videographer', 5, 129, 5, 'Orlando, FL', 'Cinematic film production focusing on documentary-style wedding stories.', false),
('Bells & Whistles', 'Videographer', 'Videographer', 5, 150, 5, 'Pembroke Pines, FL', 'Husband-and-wife team providing emotional, high-definition wedding films.', false),
('Mosquito Shield', 'Pest Control', 'Pest Control', 4.9, 320, 5, 'Tampa, FL', 'Essential barrier protection for outdoor and waterfront wedding venues.', false);
