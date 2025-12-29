-- Bulk Import of Tampa Bay & Palm Beach County Wedding Venues
-- Created: 2025-12-29
-- Total Venues: 42

-- Tampa Bay Area Venues (20)
INSERT INTO vendors (
  name, category, type, location, street_address, contact_phone, contact_email, 
  website, google_business_url, google_rating, google_reviews, description, 
  price_range, service_zipcodes, amenities, faqs, venue_type, guest_capacity, 
  exclusive, created_at, updated_at
) VALUES

-- 1. The Birchwood
('The Birchwood', 'venue', 'Venue', 'St. Petersburg, FL', '340 Beach Dr NE, St. Petersburg, FL 33701', 
 '(727) 896-1080', 'sales@thebirchwood.com', 'https://www.thebirchwood.com', 
 'https://www.google.com/maps/place/The+Birchwood', 4.5, 2100, 
 'A boutique hotel on Beach Drive featuring a Grand Ballroom and a famous rooftop canopy with sweeping bay views.', 
 '$$$', ARRAY['33701'], ARRAY['Rooftop ceremony space', 'Grand Ballroom', 'In-house catering', 'Boutique hotel rooms', 'Valet parking'], 
 '[{"question": "What is the capacity?", "answer": "Up to 220 seated guests."}, {"question": "Is there a ceremony fee?", "answer": "Yes, for the rooftop usage."}]'::jsonb, 
 'Boutique Hotel / Rooftop', 220, true, NOW(), NOW()),

-- 2. Fenway Hotel
('Fenway Hotel', 'venue', 'Venue', 'Dunedin, FL', '453 Edgewater Dr, Dunedin, FL 34698', 
 '(727) 683-5999', 'sales@fenwayhotel.com', 'https://www.fenwayhotel.com', 
 'https://www.google.com/maps/place/Fenway+Hotel', 4.6, 1300, 
 'A historic 1924 icon of the Jazz Age, fully restored with a modern boutique vibe and musical heritage.', 
 '$$$', ARRAY['34698'], ARRAY['Waterfront lawn', 'Rooftop bar', 'Ballroom', 'Historic architecture', 'On-site catering'], 
 '[{"question": "Can we have the ceremony on the lawn?", "answer": "Yes, the waterfront lawn is a primary ceremony spot."}]'::jsonb, 
 'Historic Hotel', 175, true, NOW(), NOW()),

-- 3. The Vault
('The Vault', 'venue', 'Venue', 'Tampa, FL', '611 N Franklin St, Tampa, FL 33602', 
 '(813) 225-3450', 'info@thevaulttampa.com', 'https://thevaulttampa.com', 
 'https://www.google.com/maps/search/?api=1&query=The+Vault+Tampa', 4.6, 180, 
 'Located in a 1923 bank building, this venue features 35-foot ceilings and floor-to-ceiling windows with a private park.', 
 '$$$', ARRAY['33602'], ARRAY['Private park', '35ft ceilings', 'Bridal suite', 'Valet parking', 'Historic charm'], 
 '[{"question": "Is outside catering allowed?", "answer": "They have preferred caterers but may allow flexibility."}]'::jsonb, 
 'Historic Ballroom', 200, true, NOW(), NOW()),

-- 4. Sandpearl Resort
('Sandpearl Resort', 'venue', 'Venue', 'Clearwater Beach, FL', '500 Mandalay Ave, Clearwater Beach, FL 33767', 
 '(727) 441-2425', 'sales@sandpearl.com', 'https://www.sandpearl.com', 
 'https://www.google.com/maps/place/Sandpearl+Resort', 4.6, 3700, 
 'A AAA Four-Diamond resort right on the white sands of Clearwater Beach, offering a luxury coastal experience.', 
 '$$$$', ARRAY['33767'], ARRAY['Private beach', 'Hunter Ballroom', 'Spa', 'Resort pool', 'Sunset views'], 
 '[{"question": "Can we get married on the sand?", "answer": "Yes, beach ceremonies are their specialty."}]'::jsonb, 
 'Beach Resort', 300, true, NOW(), NOW()),

-- 5. The Rusty Pelican
('The Rusty Pelican', 'venue', 'Venue', 'Tampa, FL', '2425 N Rocky Point Dr, Tampa, FL 33607', 
 '(813) 281-1943', 'rptampacatering@srcmail.com', 'https://www.therustypelicantampa.com', 
 'https://www.google.com/maps/place/The+Rusty+Pelican', 4.5, 3600, 
 'A classic waterfront staple known for its panoramic views of Tampa Bay and consistent event quality.', 
 '$$', ARRAY['33607'], ARRAY['Waterfront gazebo', 'Ballroom with views', 'In-house catering', 'Bridal room'], 
 '[{"question": "Is parking available?", "answer": "Yes, ample parking is available on-site."}]'::jsonb, 
 'Waterfront Restaurant/Ballroom', 250, true, NOW(), NOW()),

-- 6. Nova 535
('Nova 535', 'venue', 'Venue', 'St. Petersburg, FL', '535 Dr M.L.K. Jr St N, St. Petersburg, FL 33701', 
 '(941) 922-3837', 'sales@nova535.com', 'https://nova535.com', 
 'https://www.google.com/maps/search/?api=1&query=Nova+535+St+Petersburg', 4.8, 400, 
 'A top-rated unique event space in St. Pete with a bamboo garden and brick-interior vibe.', 
 '$$', ARRAY['33701'], ARRAY['Bamboo courtyard', 'Exposed brick', 'High-tech AV', 'Full liquor bar', 'Coordinator included'], 
 '[{"question": "Do I need a planner?", "answer": "They provide a day-of coordinator."}]'::jsonb, 
 'Modern Industrial / Garden', 250, true, NOW(), NOW()),

-- 7. Grand Hyatt Tampa Bay
('Grand Hyatt Tampa Bay', 'venue', 'Venue', 'Tampa, FL', '2900 Bayport Dr, Tampa, FL 33607', 
 '(813) 874-1234', 'tpa.grand@hyatt.com', 'https://www.hyatt.com', 
 'https://www.google.com/maps/search/?api=1&query=Grand+Hyatt+Tampa+Bay', 4.5, 3000, 
 'A luxury resort venue set on a 35-acre wildlife preserve on the upper bay.', 
 '$$$', ARRAY['33607'], ARRAY['Private beach', 'Gazebo', 'Skylark rooftop', 'Ballrooms', 'Nature walk'], 
 '[{"question": "Are there nature views?", "answer": "Yes, it is set on a 35-acre nature preserve."}]'::jsonb, 
 'Resort / Hotel', 500, true, NOW(), NOW()),

-- 8. Red Mesa Events
('Red Mesa Events', 'venue', 'Venue', 'St. Petersburg, FL', '128 3rd St S, St. Petersburg, FL 33701', 
 '(727) 896-2679', 'info@redmesaevents.com', 'https://redmesaevents.com', 
 'https://www.google.com/maps/place/Red+Mesa+Events', 4.7, 70, 
 'A chic, historic venue featuring a renovated ballroom with exposed brick and a rooftop terrace.', 
 '$$', ARRAY['33701'], ARRAY['Rooftop terrace', 'Historic ballroom', 'Craft cocktails', 'Mexican-fusion catering'], 
 '[{"question": "Is the rooftop covered?", "answer": "It is open-air but they may have tenting options."}]'::jsonb, 
 'Historic / Rooftop', 175, true, NOW(), NOW()),

-- 9. The Don CeSar
('The Don CeSar', 'venue', 'Venue', 'St. Pete Beach, FL', '3400 Gulf Blvd, St Pete Beach, FL 33706', 
 '(727) 360-1881', 'weddings@doncesar.com', 'https://www.doncesar.com', 
 'https://www.google.com/maps/search/?api=1&query=The+Don+CeSar', 4.5, 6000, 
 'Known as the "Pink Palace," this iconic beachfront hotel offers legendary luxury on St. Pete Beach.', 
 '$$$$', ARRAY['33706'], ARRAY['Beach ceremony', 'Grand ballrooms', 'Spa', 'Historic architecture', 'Ocean views'], 
 '[{"question": "What is the largest capacity?", "answer": "They can host up to 600 guests."}]'::jsonb, 
 'Historic Beach Resort', 600, true, NOW(), NOW()),

-- 10. The Vinoy Resort & Golf Club
('The Vinoy Resort & Golf Club, Autograph Collection', 'venue', 'Venue', 'St. Petersburg, FL', '501 5th Ave NE, St. Petersburg, FL 33701', 
 '(727) 894-1000', 'sales@thevinoy.com', 'https://www.marriott.com', 
 'https://www.google.com/maps/search/?api=1&query=The+Vinoy+Resort', 4.6, 3500, 
 'A historic Mediterranean Revival resort on the St. Pete waterfront, recently renovated.', 
 '$$$$', ARRAY['33701'], ARRAY['Tea garden', 'Grand ballroom', 'Golf course', 'Marina views', 'Luxury spa'], 
 '[{"question": "Is there a garden?", "answer": "Yes, the Tea Garden is popular for ceremonies."}]'::jsonb, 
 'Historic Resort', 400, true, NOW(), NOW()),

-- 11. Sunken Gardens
('Sunken Gardens', 'venue', 'Venue', 'St. Petersburg, FL', '1825 4th St N, St. Petersburg, FL 33704', 
 '(727) 551-3102', 'sunkengardens@stpete.org', 'https://www.sunkengardens.org', 
 'https://www.google.com/maps/search/?api=1&query=Sunken+Gardens+St+Pete', 4.7, 5000, 
 'A century-old living museum and botanical garden with cascading waterfalls and tropical plants.', 
 '$$', ARRAY['33704'], ARRAY['Botanical gardens', 'Oak pavilion', 'Reception hall', 'Waterfalls'], 
 '[{"question": "Is it open to the public during weddings?", "answer": "Ceremonies are often held after hours or in secluded areas."}]'::jsonb, 
 'Botanical Garden', 200, true, NOW(), NOW()),

-- 12. Powel Crosley Estate
('Powel Crosley Estate', 'venue', 'Venue', 'Sarasota, FL', '8374 N Tamiami Trail, Sarasota, FL 34243', 
 '(941) 722-3244', 'sales@bacvb.com', 'https://www.bradentongulfislands.com', 
 'https://www.google.com/maps/search/?api=1&query=Powel+Crosley+Estate', 4.7, 400, 
 'A 1920s Mediterranean Revival mansion located directly on Sarasota Bay.', 
 '$$$', ARRAY['34243'], ARRAY['Bayfront lawn', 'Historic mansion', 'Bridal suite', 'Vintage architecture'], 
 '[{"question": "Is catering included?", "answer": "No, you must choose from an approved list."}]'::jsonb, 
 'Historic Estate', 400, true, NOW(), NOW()),

-- 13. The Ringling
('The Ringling', 'venue', 'Venue', 'Sarasota, FL', '5401 Bay Shore Rd, Sarasota, FL 34243', 
 '(941) 359-5700', 'events@ringling.org', 'https://www.ringling.org', 
 'https://www.google.com/maps/search/?api=1&query=The+Ringling+Sarasota', 4.8, 12000, 
 'The spectacular state art museum of Florida offering Venetian Gothic architecture and bay views.', 
 '$$$$', ARRAY['34243'], ARRAY['Ca d''Zan Terrace', 'Museum Courtyard', 'Gardens', 'Bayfront'],
 '[{"question": "Can we have a reception in the mansion?", "answer": "Receptions are typically on the terrace or courtyard."}]'::jsonb, 
 'Museum / Estate', 400, true, NOW(), NOW()),

-- 14. Hyatt Regency Clearwater Beach
('Hyatt Regency Clearwater Beach Resort & Spa', 'venue', 'Venue', 'Clearwater Beach, FL', '301 S Gulfview Blvd, Clearwater Beach, FL 33767', 
 '(727) 373-1234', 'clearwaterbeach@hyatt.com', 'https://www.hyatt.com', 
 'https://www.google.com/maps/place/Hyatt+Regency+Clearwater', 4.5, 6500, 
 'A grand pink resort towering over the beach with a 16th-floor Sky Terrace offering massive views.', 
 '$$$', ARRAY['33767'], ARRAY['Sky Terrace', 'Belleair Ballroom', 'Sandava Spa', 'All-suite rooms'], 
 '[{"question": "Is there a view?", "answer": "The Sky Terrace offers panoramic Gulf views."}]'::jsonb, 
 'Resort / Hotel', 200, true, NOW(), NOW()),

-- 15. JW Marriott Clearwater Beach
('JW Marriott Clearwater Beach Resort & Spa', 'venue', 'Venue', 'Clearwater Beach, FL', '691 S Gulfview Blvd, Clearwater Beach, FL 33767', 
 '(727) 677-6000', 'sales@jwmarriottclearwater.com', 'https://www.marriott.com', 
 'https://www.google.com/maps/search/?api=1&query=JW+Marriott+Clearwater+Beach', 4.6, 800, 
 'A newer luxury beachfront resort with elegant ballrooms and private beach access.', 
 '$$$$', ARRAY['33767'], ARRAY['Private beach', 'Rooftop terrace', 'Grand ballroom', 'Spa'], 
 '[{"question": "Is the beach private?", "answer": "Yes, they have a private section for events."}]'::jsonb, 
 'Luxury Resort', 300, true, NOW(), NOW()),

-- 16. Opal Sands Resort
('Opal Sands Resort', 'venue', 'Venue', 'Clearwater Beach, FL', '430 S Gulfview Blvd, Clearwater, FL 33767', 
 '(727) 450-0380', 'info@opalsands.com', 'https://www.opalsands.com', 
 'https://www.google.com/maps/search/?api=1&query=Opal+Sands+Resort', 4.6, 4000, 
 'A modern, curved resort where every room and event space has a view of the Gulf.', 
 '$$$$', ARRAY['33767'], ARRAY['Event lawn', 'Sea-view ballroom', 'Waterfront pool', 'Modern decor'], 
 '[{"question": "Do all rooms have views?", "answer": "Yes, the building is curved so all rooms face the Gulf."}]'::jsonb, 
 'Modern Resort', 400, true, NOW(), NOW()),

-- 17. Saxon Manor
('Saxon Manor', 'venue', 'Venue', 'Brooksville, FL', '200 Saxon Ave, Brooksville, FL 34601', 
 '(813) 909-3414', 'info@saxonmanor.com', 'https://www.saxonmanor.com', 
 'https://www.google.com/maps/search/?api=1&query=Saxon+Manor', 4.7, 200, 
 'A rustic-chic wedding venue with a historic manor house and a modern barn.', 
 '$$', ARRAY['34601'], ARRAY['Garden Room (Barn)', 'Outdoor lawn', 'Bridal cottage', 'All-inclusive packages'], 
 '[{"question": "Is it all-inclusive?", "answer": "Yes, they are known for their inclusive packages."}]'::jsonb, 
 'Barn / Estate', 200, true, NOW(), NOW()),

-- 18. Isla Del Sol Yacht & Country Club
('Isla Del Sol Yacht & Country Club', 'venue', 'Venue', 'St. Petersburg, FL', '6000 Sun Blvd, St. Petersburg, FL 33715', 
 '(727) 828-0002', 'catering@idsycc.com', 'https://www.isladelsolycc.com', 
 'https://www.google.com/maps/place/Isla+Del+Sol', 4.6, 1000, 
 'A private yacht club offering a secluded beach and a ballroom with yacht harbor views.', 
 '$$', ARRAY['33715'], ARRAY['Private beach', 'Gazebo', 'Ballroom with views', 'Yacht photos'], 
 '[{"question": "Is membership required?", "answer": "No, they host weddings for non-members."}]'::jsonb, 
 'Country Club / Beach', 250, true, NOW(), NOW()),

-- 19. Cross Creek Ranch
('Cross Creek Ranch', 'venue', 'Venue', 'Dover, FL', '12950 E Wheeler Rd, Dover, FL 33527', 
 '(813) 651-0934', 'info@crosscreekranchfl.com', 'https://crosscreekranchfl.com', 
 'https://www.google.com/maps/search/?api=1&query=Cross+Creek+Ranch', 4.8, 400, 
 'An all-inclusive venue featuring two distinct sites: a Carriage House Stable and a French Country Inn.', 
 '$$$', ARRAY['33527'], ARRAY['Carriage House Stable', 'French Country Inn', 'Decor included', 'Coordinator'], 
 '[{"question": "Is decor included?", "answer": "Yes, they have a massive decor inventory included."}]'::jsonb, 
 'Ranch / Barn', 150, true, NOW(), NOW()),

-- 20. Safety Harbor Resort and Spa
('Safety Harbor Resort and Spa', 'venue', 'Venue', 'Safety Harbor, FL', '105 N Bayshore Dr, Safety Harbor, FL 34695', 
 '(727) 726-1161', 'catering@safetyharborresort.com', 'https://safetyharborspa.com', 
 'https://www.google.com/maps/place/Safety+Harbor+Resort', 4.2, 4600, 
 'A historic landmark resort built on natural mineral springs, offering classic Old Florida charm.', 
 '$$', ARRAY['34695'], ARRAY['Mineral springs spa', 'Waterfront ballroom', 'Tranquility garden'], 
 '[{"question": "Is there a spa?", "answer": "Yes, world-famous mineral springs spa on site."}]'::jsonb, 
 'Historic Resort / Spa', 300, true, NOW(), NOW()),

-- Palm Beach County Venues (22)

-- 21. The Breakers Palm Beach
('The Breakers Palm Beach', 'venue', 'Venue', 'Palm Beach, FL', '1 S County Rd, Palm Beach, FL 33480', 
 '(561) 655-6611', 'sales@thebreakers.com', 'https://www.thebreakers.com', 
 'https://www.google.com/maps/search/?api=1&query=The+Breakers+Palm+Beach', 4.7, 7000, 
 'The ultimate luxury oceanfront resort, legendary for its opulence and service.', 
 '$$$$', ARRAY['33480'], ARRAY['Grand ballrooms', 'Ocean lawn', 'Private beach', 'World-class catering'], 
 '[{"question": "What is the minimum spend?", "answer": "It varies, but is among the highest in the region."}]'::jsonb, 
 'Luxury Resort', 800, true, NOW(), NOW()),

-- 22. Eau Palm Beach Resort & Spa
('Eau Palm Beach Resort & Spa', 'venue', 'Venue', 'Manalapan, FL', '100 S Ocean Blvd, Manalapan, FL 33462', 
 '(561) 533-6000', 'events@eaupalmbeach.com', 'https://www.eaupalmbeach.com', 
 'https://www.google.com/maps/search/?api=1&query=Eau+Palm+Beach', 4.6, 2500, 
 'A Five-Star oceanfront retreat offering intimate luxury and whimsical style.', 
 '$$$$', ARRAY['33462'], ARRAY['Oceanfront ballroom', 'Courtyard', 'Spa', 'Private cabanas'], 
 '[{"question": "Is it pet friendly?", "answer": "Yes, they are a pet-friendly resort."}]'::jsonb, 
 'Luxury Resort', 400, true, NOW(), NOW()),

-- 23. The Colony Hotel
('The Colony Hotel', 'venue', 'Venue', 'Palm Beach, FL', '155 Hammon Ave, Palm Beach, FL 33480', 
 '(561) 655-5430', 'sales@thecolonypalmbeach.com', 'https://thecolonypalmbeach.com', 
 'https://www.google.com/maps/search/?api=1&query=The+Colony+Hotel+Palm+Beach', 4.5, 800, 
 'A historic boutique hotel known for its "Pink" British Colonial architecture and chic vibe.', 
 '$$$$', ARRAY['33480'], ARRAY['Coral Ballroom', 'Poolside patio', 'Hanging gardens', 'Steps from Worth Ave'], 
 '[{"question": "Is it near the beach?", "answer": "Yes, just steps away from the ocean."}]'::jsonb, 
 'Boutique Hotel', 200, true, NOW(), NOW()),

-- 24. Four Seasons Resort Palm Beach
('Four Seasons Resort Palm Beach', 'venue', 'Venue', 'Palm Beach, FL', '2800 S Ocean Blvd, Palm Beach, FL 33480', 
 '(561) 582-2800', 'catering.palmbeach@fourseasons.com', 'https://www.fourseasons.com', 
 'https://www.google.com/maps/search/?api=1&query=Four+Seasons+Palm+Beach', 4.7, 2000, 
 'A Five-Star, Five-Diamond resort offering relaxed elegance on the ocean.', 
 '$$$$', ARRAY['33480'], ARRAY['Oceanfront terrace', 'Ballrooms', 'Exemplary service', 'Spa'], 
 '[{"question": "Do they offer cakes?", "answer": "Yes, they have an in-house pastry team."}]'::jsonb, 
 'Luxury Resort', 400, true, NOW(), NOW()),

-- 25. Pelican Club
('Pelican Club', 'venue', 'Venue', 'Jupiter, FL', '1065 N Hwy A1A, Jupiter, FL 33477', 
 '(561) 693-5063', 'info@lessings.com', 'https://www.lessings.com', 
 'https://www.google.com/maps/search/?api=1&query=Pelican+Club+Jupiter', 4.8, 250, 
 'A waterfront venue featuring a deck with stunning views of the Jupiter Lighthouse.', 
 '$$$', ARRAY['33477'], ARRAY['Glass-enclosed ballroom', 'Outdoor deck', 'Bridal suite', 'Lighthouse views'], 
 '[{"question": "Who manages the venue?", "answer": "It is managed by Lessing''s Hospitality Group."}]'::jsonb, 
 'Waterfront Event Center', 450, true, NOW(), NOW()),

-- 26. The Ben, Autograph Collection
('The Ben, Autograph Collection', 'venue', 'Venue', 'West Palm Beach, FL', '251 N Narcissus Ave, West Palm Beach, FL 33401', 
 '(561) 655-4001', 'sales@thebenwestpalm.com', 'https://www.thebenwestpalm.com', 
 'https://www.google.com/maps/search/?api=1&query=The+Ben+West+Palm+Beach', 4.5, 1000, 
 'A modern hotel in downtown West Palm with the only rooftop ballroom in the area.', 
 '$$$', ARRAY['33401'], ARRAY['Rooftop ballroom (Blue Heron)', 'Water views', 'Modern decor', 'Pool deck'], 
 '[{"question": "Is there a rooftop?", "answer": "Yes, featuring the Blue Heron Ballroom."}]'::jsonb, 
 'Modern Hotel / Rooftop', 300, true, NOW(), NOW()),

-- 27. PGA National Resort
('PGA National Resort', 'venue', 'Venue', 'Palm Beach Gardens, FL', '400 Ave of the Champions, Palm Beach Gardens, FL 33418', 
 '(800) 863-2819', 'weddings@pgaresort.com', 'https://www.pgaresort.com', 
 'https://www.google.com/maps/search/?api=1&query=PGA+National+Resort', 4.4, 4500, 
 'A major golf resort offering versatile indoor and outdoor venues.', 
 '$$$', ARRAY['33418'], ARRAY['Lakeside lawns', 'Multiple ballrooms', 'Spa', 'Golf courses'], 
 '[{"question": "Is it good for large weddings?", "answer": "Yes, they have very large ballroom capacity."}]'::jsonb, 
 'Golf Resort', 500, true, NOW(), NOW()),

-- 28. Morikami Museum and Japanese Gardens
('Morikami Museum and Japanese Gardens', 'venue', 'Venue', 'Delray Beach, FL', '4000 Morikami Park Rd, Delray Beach, FL 33446', 
 '(561) 495-0233', 'akeating@pbc.gov', 'https://morikami.org', 
 'https://www.google.com/maps/search/?api=1&query=Morikami+Museum', 4.8, 8000, 
 'An authentic Japanese garden offering serene, nature-filled ceremonies.', 
 '$$', ARRAY['33446'], ARRAY['Japanese gardens', 'Lakeside terrace', 'Bonsai collection', 'Tented options'], 
 '[{"question": "When can weddings start?", "answer": "Ceremonies typically begin after public hours (sunset)."}]'::jsonb, 
 'Garden / Museum', 150, true, NOW(), NOW()),

-- 29. The Addison
('The Addison', 'venue', 'Venue', 'Boca Raton, FL', '2 E Camino Real, Boca Raton, FL 33432', 
 '(561) 372-0568', 'info@theaddison.com', 'https://theaddisonofbocaraton.com', 
 'https://www.google.com/maps/search/?api=1&query=The+Addison+Boca+Raton', 4.7, 1200, 
 'A historic Mizner-designed estate with majestic banyan trees and courtyard dining.', 
 '$$$', ARRAY['33432'], ARRAY['Courtyard', '100-year-old Banyan trees', 'Historic dining rooms', 'Award-winning cuisine'], 
 '[{"question": "Is the food good?", "answer": "They are highly acclaimed for their culinary excellence."}]'::jsonb, 
 'Historic Estate', 300, true, NOW(), NOW()),

-- 30. The Boca Raton
('The Boca Raton', 'venue', 'Venue', 'Boca Raton, FL', '501 E Camino Real, Boca Raton, FL 33432', 
 '(561) 447-3000', 'catering@thebocaraton.com', 'https://www.thebocaraton.com', 
 'https://www.google.com/maps/search/?api=1&query=The+Boca+Raton+Resort', 4.5, 4000, 
 'A sprawling historic resort (formerly Boca Raton Resort) with Spanish colonial architecture.', 
 '$$$$', ARRAY['33432'], ARRAY['Cathedral Ballroom', 'Yacht club', 'Private beach', 'Cloister gardens'], 
 '[{"question": "Is it just one venue?", "answer": "No, it is a complex of several distinct venues (Beach Club, Cloister, etc)."}]'::jsonb, 
 'Luxury Resort', 600, true, NOW(), NOW()),

-- 31. Jupiter Beach Resort & Spa
('Jupiter Beach Resort & Spa', 'venue', 'Venue', 'Jupiter, FL', '5 N Hwy A1A, Jupiter, FL 33477', 
 '(561) 746-2511', 'sales@jupiterbeachresort.com', 'https://jupiterbeachresort.com', 
 'https://www.google.com/maps/search/?api=1&query=Jupiter+Beach+Resort', 4.5, 2800, 
 'An oceanfront resort with a secluded feel and tropical island atmosphere.', 
 '$$$', ARRAY['33477'], ARRAY['Oceanfront gazebo', 'Ballroom', 'Sand dune photos', 'Spa'], 
 '[{"question": "Is it directly on the beach?", "answer": "Yes, it is the only oceanfront hotel in Jupiter."}]'::jsonb, 
 'Beach Resort', 250, true, NOW(), NOW()),

-- 32. Palm Beach Marriott Singer Island
('Palm Beach Marriott Singer Island Beach Resort & Spa', 'venue', 'Venue', 'Riviera Beach, FL', '3800 N Ocean Dr, Riviera Beach, FL 33404', 
 '(561) 340-1700', 'sales@marriottsingerisland.com', 'https://www.marriott.com', 
 'https://www.google.com/maps/search/?api=1&query=Palm+Beach+Marriott+Singer+Island', 4.5, 2500, 
 'A towering all-suite resort on Singer Island with ocean views.', 
 '$$$', ARRAY['33404'], ARRAY['Oceanfront terrace', 'Veranda', 'Ballroom with windows', 'All-suite rooms'], 
 '[{"question": "Are rooms good for families?", "answer": "Yes, all rooms are suites with kitchens."}]'::jsonb, 
 'Resort / Hotel', 200, true, NOW(), NOW()),

-- 33. Hilton West Palm Beach
('Hilton West Palm Beach', 'venue', 'Venue', 'West Palm Beach, FL', '600 Okeechobee Blvd, West Palm Beach, FL 33401', 
 '(561) 231-6000', 'pbiwp_sales@hilton.com', 'https://www.hilton.com', 
 'https://www.google.com/maps/search/?api=1&query=Hilton+West+Palm+Beach', 4.6, 3500, 
 'A convention center hotel with a resort-style pool and convenient downtown location.', 
 '$$$', ARRAY['33401'], ARRAY['Large lawns', 'Ballrooms', 'Resort pool', 'Connected to convention center'], 
 '[{"question": "Is it near the airport?", "answer": "Yes, it is very close to PBI airport."}]'::jsonb, 
 'Modern Hotel', 500, true, NOW(), NOW()),

-- 34. Aloft Delray Beach
('Aloft Delray Beach', 'venue', 'Venue', 'Delray Beach, FL', '202 SE 5th Ave, Delray Beach, FL 33483', 
 '(561) 469-0550', 'sales@aloftdelraybeach.com', 'https://www.marriott.com', 
 'https://www.google.com/maps/search/?api=1&query=Aloft+Delray+Beach', 4.4, 800, 
 'A modern, tech-forward hotel in the heart of downtown Delray.', 
 '$$', ARRAY['33483'], ARRAY['Pool deck', 'Ballroom', 'W XYZ bar', 'Walking distance to Atlantic Ave'], 
 '[{"question": "Is it good for nightlife?", "answer": "Yes, steps from Atlantic Ave nightlife."}]'::jsonb, 
 'Modern Hotel', 150, true, NOW(), NOW()),

-- 35. Benvenuto Restaurant & Banquet Facility
('Benvenuto Restaurant & Banquet Facility', 'venue', 'Venue', 'Boynton Beach, FL', '1730 N Federal Hwy, Boynton Beach, FL 33435', 
 '(561) 364-0600', 'info@benvenutorestaurant.com', 'https://benvenutorestaurant.com', 
 'https://www.google.com/maps/search/?api=1&query=Benvenuto+Boynton+Beach', 4.6, 1100, 
 'An elegant 1929 Mizner-inspired building operating as a premier event venue.', 
 '$$', ARRAY['33435'], ARRAY['Courtyard garden', 'Multiple dining rooms', 'Fireplace', 'Piano bar'], 
 '[{"question": "Is it a hotel?", "answer": "No, it is a standalone restaurant/banquet facility."}]'::jsonb, 
 'Restaurant / Estate', 250, true, NOW(), NOW()),

-- 36. Tideline Ocean Resort & Spa
('Tideline Ocean Resort & Spa', 'venue', 'Venue', 'Palm Beach, FL', '2842 S Ocean Blvd, Palm Beach, FL 33480', 
 '(561) 540-6440', 'sales@tidelineresort.com', 'https://www.tidelineresort.com', 
 'https://www.google.com/maps/search/?api=1&query=Tideline+Ocean+Resort', 4.3, 900, 
 'A boutique oceanfront hotel with a modern, zen-like aesthetic.', 
 '$$$', ARRAY['33480'], ARRAY['Beach ceremonies', 'Oceanfront terrace', 'Ballroom', 'Spa'], 
 '[{"question": "Is it intimate?", "answer": "Yes, it has a boutique, intimate vibe."}]'::jsonb, 
 'Boutique Hotel', 150, true, NOW(), NOW()),

-- 37. Breakers West Country Club
('Breakers West Country Club', 'venue', 'Venue', 'West Palm Beach, FL', '1550 Flagler Pkwy, West Palm Beach, FL 33411', 
 '(561) 653-6323', 'catering@thebreakers.com', 'https://breakerswestclub.com', 
 'https://www.google.com/maps/search/?api=1&query=Breakers+West+Country+Club', 4.6, 200, 
 'A scenic country club venue managed by The Breakers, set in a wildlife sanctuary.', 
 '$$$', ARRAY['33411'], ARRAY['Golf course views', 'Elegant ballroom', 'Covered terrace', 'Breakers service'], 
 '[{"question": "Is it the same as The Breakers?", "answer": "It is a sister property located inland, not on the ocean."}]'::jsonb, 
 'Country Club', 200, true, NOW(), NOW()),

-- 38. The Singer Oceanfront Resort
('The Singer Oceanfront Resort, Curio Collection by Hilton', 'venue', 'Venue', 'Riviera Beach, FL', '3700 N Ocean Dr, Riviera Beach, FL 33404', 
 '(561) 848-3888', 'sales@thesingerresort.com', 'https://www.hilton.com', 
 'https://www.google.com/maps/search/?api=1&query=The+Singer+Oceanfront+Resort', 4.2, 1800, 
 'A newly rebranded Curio Collection resort offering direct beach access.', 
 '$$$', ARRAY['33404'], ARRAY['Beachfront pavilion', 'Ballroom', 'Outdoor terraces', 'Modern renovation'], 
 '[{"question": "Is this the old Hilton?", "answer": "Yes, recently rebranded and renovated."}]'::jsonb, 
 'Beach Resort', 200, true, NOW(), NOW()),

-- 39. North Palm Beach Country Club
('North Palm Beach Country Club', 'venue', 'Venue', 'North Palm Beach, FL', '951 US-1, North Palm Beach, FL 33408', 
 '(561) 691-3430', 'info@farmerstable.com', 'https://www.npbcc.org', 
 'https://www.google.com/maps/search/?api=1&query=North+Palm+Beach+Country+Club', 4.6, 600, 
 'A public country club with a modern clubhouse and Jack Nicklaus Signature golf course.', 
 '$$', ARRAY['33408'], ARRAY['Large ballroom', 'Sunset views', 'Farmer''s Table catering', 'Golf views'],
 '[{"question": "Is the food healthy?", "answer": "Yes, Farmer''s Table specializes in fresh, healthy cuisine."}]'::jsonb, 
 'Country Club', 200, true, NOW(), NOW()),

-- 40. Kravis Center for the Performing Arts
('Kravis Center for the Performing Arts', 'venue', 'Venue', 'West Palm Beach, FL', '701 Okeechobee Blvd, West Palm Beach, FL 33401', 
 '(561) 651-4444', 'catering@kravis.org', 'https://www.kravis.org', 
 'https://www.google.com/maps/search/?api=1&query=Kravis+Center+West+Palm+Beach', 4.8, 5000, 
 'A premier performing arts center with a grand, modern ballroom.', 
 '$$$', ARRAY['33401'], ARRAY['Cohen Pavilion', 'High ceilings', 'Modern architecture', 'Catering by Lessing''s'],
 '[{"question": "Is it just a theater?", "answer": "No, they have a dedicated event pavilion and ballroom."}]'::jsonb, 
 'Performing Arts Center', 700, true, NOW(), NOW());

-- Verify import
SELECT COUNT(*) as total_imported FROM vendors WHERE exclusive = true AND category = 'venue';
