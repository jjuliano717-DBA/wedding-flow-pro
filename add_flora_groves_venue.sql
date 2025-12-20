-- Ensure required columns exist for the new data structure
ALTER TABLE venues ADD COLUMN IF NOT EXISTS heart_rating numeric DEFAULT 0;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS google_rating numeric DEFAULT 0;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS google_reviews integer DEFAULT 0;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS capacity_num integer DEFAULT 0;

-- Add or Update Flora Groves Farm Venue
INSERT INTO venues (
  name, 
  description, 
  location, 
  type, 
  capacity, 
  capacity_num, 
  price, 
  google_rating, 
  google_reviews, 
  heart_rating, 
  exclusive, 
  indoor, 
  outdoor, 
  image_url, 
  images, 
  amenities, 
  website, 
  contact_email,
  address, 
  faq
) VALUES (
  'Flora Groves Farm',
  'Escape to Flora Groves Farm, a working peach orchard and event venue in Thonotosassa, Florida. This venue offers a blend of rustic charm and modern elegance with a classic red barn, open fields, and beautiful peach trees. Perfect for weddings, elopements, and special events. The venue features a climate-controlled barn, bridal suite, and picturesque outdoor ceremony sites under the oaks.',
  'Thonotosassa, FL',
  'Rustic Barn',
  'Up to 165 guests',
  165,
  '$$',
  5.0,
  0,
  5.0,
  true,
  true,
  true,
  'https://hctg-images.imgix.net/images/venues/flora-groves-farm/20251020FloraGrovesFarm08.jpeg?auto=format%2Ccompress&fit=clamp&h=430&s=f0f195b25047c2ef6e848512118afa0a',
  ARRAY[
    'https://hctg-images.imgix.net/images/venues/flora-groves-farm/20251020FloraGrovesFarm08.jpeg?auto=format%2Ccompress&fit=clamp&h=430&s=f0f195b25047c2ef6e848512118afa0a',
    'https://hctg-images.imgix.net/images/venues/flora-groves-farm/20251021FloraGrovesFarm11_2025-10-21-201644_keuq.jpg?auto=format%2Ccompress&fit=clamp&h=430&s=b87465b64386982ad9e5ed6274849742',
    'https://hctg-images.imgix.net/images/venues/flora-groves-farm/20251021FloraGrovesFarm17.jpg?auto=format%2Ccompress&fit=clamp&h=430&s=b55c3fc1f95dbeb60881f5765e917d73',
    'https://hctg-images.imgix.net/images/venues/flora-groves-farm/20251021FloraGrovesFarm03.jpg?auto=format%2Ccompress&fit=clamp&h=430&s=23939536b2584a299bef53c752483df1',
    'https://hctg-images.imgix.net/images/venues/flora-groves-farm/20251021FloraGrovesFarm12_2025-10-21-201644_aqad.jpg?auto=format%2Ccompress&fit=clamp&h=430&s=4ed37b5002a66a591236b10b25cf07f5'
  ],
  ARRAY['Outdoor Ceremony', 'Barn', 'Bridal Suite', 'Parking', 'Wheelchair Access', 'Pet Friendly', 'Climate Controlled', 'Peach Orchard'],
  'https://hellofloragrovesfarm.com/',
  NULL,
  '2382 North Kingsway Road, Thonotosassa, FL 33592',
  '[
    {"question": "What is the guest capacity?", "answer": "We can accommodate up to 165 guests for ceremonies and receptions."},
    {"question": "Is alcohol allowed?", "answer": "Yes, BYO is allowed provided it is served by a licensed bartender."},
    {"question": "Is there a bridal suite?", "answer": "Yes, our farmhouse includes a bridal suite for getting ready."},
    {"question": "What happens in case of rain?", "answer": "We have a climate-controlled barn that serves as a beautiful backup for ceremonies and reception space."},
    {"question": "Are pets allowed?", "answer": "Yes, we are a pet-friendly venue!"}
  ]'::jsonb
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
  exclusive = EXCLUDED.exclusive,
  indoor = EXCLUDED.indoor,
  outdoor = EXCLUDED.outdoor,
  image_url = EXCLUDED.image_url,
  images = EXCLUDED.images,
  amenities = EXCLUDED.amenities,
  website = EXCLUDED.website,
  contact_email = EXCLUDED.contact_email,
  address = EXCLUDED.address,
  faq = EXCLUDED.faq;
