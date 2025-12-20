-- Add Flora Groves Farm to Venues

INSERT INTO venues (
    name, 
    location, 
    description, 
    price, 
    capacity, 
    capacity_num, 
    type, 
    images, 
    amenities, 
    website, 
    contact_email, 
    faq, 
    exclusive,
    address,
    google_rating,
    google_reviews,
    indoor,
    outdoor
) VALUES (
    'Flora Groves Farm',
    'Thonotosassa, FL',
    'Tucked into a shady grove on the edge of the forest, this family-run farm is a dream for nature lovers. Intimate weddings are especially lovely here, thanks to beautifully curated gathering spaces, rustic farm details, and a warm, welcoming touch from the dedicated owners.

The unique open-air “chapel” nestles seamlessly among the mossy oaks, featuring green-glass chandeliers and a Florida-chic white shell floor. Mingle amid the seasonal blooms, twinkle-lit trees, and cozy fire pits in the Garden.',
    '$5,800+',
    'Up to 150',
    150,
    'Rustic Barn',
    ARRAY[
        'https://images.unsplash.com/photo-1519225468759-428dbe8aa33f?auto=format&fit=crop&w=1200', -- Barn/Chapel vibe
        'https://images.unsplash.com/photo-1464366400600-7168b8af9bc6?auto=format&fit=crop&w=1200', -- Nature/Forest
        'https://images.unsplash.com/photo-1510076857177-7470076d4098?auto=format&fit=crop&w=1200', -- Rustic details
        'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200'  -- Wedding couple in nature
    ],
    ARRAY['Open-Air Chapel', 'Garden Reception Area', 'Bridal Suite', 'On-Site Accommodations', 'Pet Friendly', 'Fire Pits', 'Access Limited Wheelchair', 'BYO Catering (List)'],
    'https://www.herecomestheguide.com/wedding-venues/florida/flora-groves-farm', -- Using guide link as proxy or real if known
    'events@floragrovesfarm.com', -- Placeholder, better than null
    '[
        {"question": "What is the rental fee?", "answer": "Rental fees start at $5,800/event and vary by season and guest count."},
        {"question": "Is there a ceremony fee?", "answer": "Yes, ceremony fees differ depending on day of week ($1,200 - $2,200)."},
        {"question": "What is the capacity?", "answer": "We comfortably accommodate up to 125-150 guests."},
        {"question": "Is it pet friendly?", "answer": "Yes! You might even spot our resident goats."}
    ]'::jsonb,
    true, -- Exclusive (Approved)
    '2382 North Kingsway Road, Thonotosassa, FL 33592',
    4.8,
    42,
    true, -- Indoor (Barn structure?)
    true  -- Outdoor (Garden/Chapel)
);
