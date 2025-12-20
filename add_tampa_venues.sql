-- Add 10 New Tampa Venues
INSERT INTO venues (
  name, description, location, type, capacity, capacity_num, price, 
  google_rating, google_reviews, heart_rating, 
  amenities, website, address, image_url, images
) VALUES 
-- 1. The Orlo House & Ballroom
(
  'The Orlo House & Ballroom',
  'The Orlo House & Ballroom provides a sophisticated blend of a 1920s historic home and a modern ballroom, making it ideal for those seeking architectural character in the heart of Tampa. "I want to re-live our wedding day at the Orlo over and over again. It was beautiful and perfect!"',
  'Tampa, FL',
  'Wedding Venue',
  'Up to 200 guests',
  200,
  'Contact for Pricing',
  4.8, 120, 4.8,
  ARRAY['Bridal Suite', 'Grand Staircase', 'Wheelchair-accessible Ballroom', 'Historic Home'],
  'https://www.theorlo.com/',
  '315 S Plant Ave, Tampa, FL 33606',
  'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800', -- Placeholder
  ARRAY['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800']
),
-- 2. Armature Works
(
  'Armature Works',
  'Armature Works is a restored 1910 trolley warehouse that offers an industrial-chic atmosphere with multiple event spaces, including a rooftop with skyline views. "An awesome spot with a great atmosphere and a ton of food options."',
  'Tampa Heights, FL',
  'Historic Venue',
  'Up to 1,200 guests',
  1200,
  '$$',
  4.6, 500, 4.6,
  ARRAY['Waterfront Views', 'In-house Catering', 'High Ceilings', 'Rooftop Access', 'Industrial Chic'],
  'https://armatureworks.com/private-events/',
  '1910 N Ola Ave, Tampa, FL 33602',
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800',
  ARRAY['https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800']
),
-- 3. Oxford Exchange
(
  'Oxford Exchange',
  'Oxford Exchange features a glass-roofed atrium and European-inspired decor, providing a scholarly and elegant backdrop for intimate to mid-sized celebrations. "From the time you walk in it’s gorgeous."',
  'Tampa, FL',
  'Event Venue',
  'Up to 200 guests',
  200,
  '$$',
  4.6, 350, 4.6,
  ARRAY['Bespoke Furniture', 'In-house Catering', 'Central Location', 'Glass-roofed Atrium'],
  'http://oxfordexchange.com/',
  '420 W Kennedy Blvd, Tampa, FL 33606',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800',
  ARRAY['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800']
),
-- 4. The Florida Aquarium
(
  'The Florida Aquarium',
  'The Florida Aquarium offers a unique nautical experience where you can exchange vows in front of a 500,000-gallon coral reef habitat. "The exhibits were awesome, well kept, educational and beautiful!"',
  'Tampa, FL',
  'Aquarium',
  'Up to 250 guests',
  250,
  'Contact for Pricing',
  4.5, 800, 4.5,
  ARRAY['Rooftop Terrace', 'On-site Catering', 'Marine-life Backdrops', 'Coral Reef Habitat'],
  'https://www.flaquarium.org/',
  '701 Channelside Dr, Tampa, FL 33602',
  'https://images.unsplash.com/photo-1583212235753-b250a347d156?auto=format&fit=crop&w=800',
  ARRAY['https://images.unsplash.com/photo-1583212235753-b250a347d156?auto=format&fit=crop&w=800']
),
-- 5. Hotel Haya
(
  'Hotel Haya',
  'Located in historic Ybor City, Hotel Haya combines mid-century modern luxury with the rich cultural heritage of the district. "An oasis to forget work and relax with family and friends in beautifully arranged areas."',
  'Ybor City, FL',
  'Hotel',
  'Up to 200 guests',
  200,
  'Contact for Pricing',
  4.5, 150, 4.5,
  ARRAY['Boutique Guest Rooms', 'Private Courtyard', 'On-site Restaurant', 'Mid-century Modern'],
  'https://hotelhaya.com/',
  '1412 E 7th Ave, Tampa, FL 33605',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800',
  ARRAY['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800']
),
-- 6. Rialto Theatre
(
  'Rialto Theatre',
  'The Rialto Theatre serves as a "blank canvas" venue with 27-foot ceilings and original brick walls, perfect for personalized design. "From my first visit, I knew I had found the right location."',
  'Tampa, FL',
  'Event Venue',
  'Approximately 400 guests',
  400,
  'Contact for Pricing',
  4.2, 90, 4.2,
  ARRAY['Historic Proscenium Arch', 'Private Vintage Lounge', 'Art Gallery', 'Blank Canvas'],
  'http://rialtotampa.com/',
  '1617 N Franklin St, Tampa, FL 33602',
  'https://images.unsplash.com/photo-1514533248882-6f614d8a7197?auto=format&fit=crop&w=800',
  ARRAY['https://images.unsplash.com/photo-1514533248882-6f614d8a7197?auto=format&fit=crop&w=800']
),
-- 7. Tampa Museum of Art
(
  'Tampa Museum of Art',
  'Tampa Museum of Art provides a sleek, modernist waterfront setting with iconic LED installations and views of the Hillsborough River. "The variety of art on display is impressive -- there’s truly something for everyone."',
  'Tampa, FL',
  'Museum',
  'Up to 400 guests',
  400,
  'Contact for Pricing',
  4.2, 400, 4.2,
  ARRAY['Covered Riverfront Terrace', 'Modern Art Gallery Access', 'Waterfront Views', 'LED Installations'],
  'https://tampamuseum.org/',
  '120 W Gasparilla Plaza, Tampa, FL 33602',
  'https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&w=800',
  ARRAY['https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&w=800']
),
-- 8. Yacht StarShip Cruises & Events
(
  'Yacht StarShip Cruises & Events',
  'Yacht StarShip Cruises & Events offers an all-inclusive moving nautical venue with fine dining and panoramic skyline views. "The crew and servers were polite and accommodating. The boat was very clean."',
  'Tampa, FL',
  'Event Venue',
  'Up to 600 guests',
  600,
  '$$',
  4.4, 600, 4.4,
  ARRAY['Climate Control', 'In-house Chef', 'Entertainment Packages', 'Skyline Views', 'Nautical Venue'],
  'https://www.yachtstarship.com/',
  '603 Channelside Dr, Tampa, FL 33602',
  'https://images.unsplash.com/photo-1540910419868-474947cebacb?auto=format&fit=crop&w=800',
  ARRAY['https://images.unsplash.com/photo-1540910419868-474947cebacb?auto=format&fit=crop&w=800']
),
-- 9. Le Méridien Tampa, The Courthouse
(
  'Le Méridien Tampa, The Courthouse',
  'Le Méridien Tampa, The Courthouse is a former federal courthouse featuring marble hallways and oak-paneled courtrooms repurposed into elegant event spaces. "Each staff member was friendly and informative about the history of the hotel."',
  'Tampa, FL',
  'Hotel',
  'Up to 225 guests',
  225,
  'Contact for Pricing',
  4.4, 250, 4.4,
  ARRAY['Historic Ballroom', 'Outdoor Grand Staircase', 'Luxury Accommodations', 'Former Federal Courthouse'],
  'https://www.marriott.com/tpamd',
  '601 N Florida Ave, Tampa, FL 33602',
  'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800',
  ARRAY['https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800']
),
-- 10. Tampa Garden Club
(
  'Tampa Garden Club',
  'Nestled on Bayshore Boulevard, the Tampa Garden Club offers a private garden atmosphere with a spacious ballroom overlooking the bay. "Very beautiful location, awesome view of the bay... Plenty of space and large kitchen."',
  'Tampa, FL',
  'Wedding Venue',
  'Up to 325 guests',
  325,
  'Reasonably Priced',
  4.5, 100, 4.5,
  ARRAY['Waterfront Conservatory', 'Wedding Garden', 'Free On-site Parking', 'Bay Views'],
  'https://www.tampagardenclub.com/',
  '2629 Bayshore Blvd, Tampa, FL 33629',
  'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800',
  ARRAY['https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800']
)
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  location = EXCLUDED.location,
  type = EXCLUDED.type,
  capacity = EXCLUDED.capacity,
  capacity_num = EXCLUDED.capacity_num,
  price = EXCLUDED.price,
  google_rating = EXCLUDED.google_rating,
  google_reviews = EXCLUDED.google_reviews,
  heart_rating = EXCLUDED.heart_rating,
  amenities = EXCLUDED.amenities,
  website = EXCLUDED.website,
  address = EXCLUDED.address,
  image_url = EXCLUDED.image_url,
  images = EXCLUDED.images;
