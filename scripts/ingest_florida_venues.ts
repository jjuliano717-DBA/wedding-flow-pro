import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: Missing Supabase credentials');
    console.error('Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or VITE_SUPABASE_ANON_KEY) environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Top-rated Florida wedding venues
const floridaVenues = [
    {
        name: "Vizcaya Museum and Gardens",
        service_area: "Miami, FL",
        category: "venue",
        google_place_id: "ChIJ3yz5Z_m22YgRqV4Uu8p8TYw",
        google_rating: 4.6,
        description: "Historic Italian Renaissance-style villa and gardens overlooking Biscayne Bay, perfect for elegant waterfront weddings.",
        location: "3251 S Miami Ave, Miami, FL 33129",
        price_range: "$$$$$",
        capacity_min: 50,
        capacity_max: 300,
    },
    {
        name: "The Breakers Palm Beach",
        service_area: "Palm Beach, FL",
        category: "venue",
        google_place_id: "ChIJx9Sx5tIW2YgR8dLqY7vLmU8",
        google_rating: 4.7,
        description: "Legendary oceanfront resort offering luxurious indoor and outdoor wedding venues with stunning Atlantic Ocean views.",
        location: "1 S County Rd, Palm Beach, FL 33480",
        price_range: "$$$$$",
        capacity_min: 100,
        capacity_max: 500,
    },
    {
        name: "Bonnet House Museum & Gardens",
        service_area: "Fort Lauderdale, FL",
        category: "venue",
        google_place_id: "ChIJ9VhP5wGr2YgRkT5MyD8XXXY",
        google_rating: 4.6,
        description: "Historic beachfront estate with tropical gardens, art studios, and diverse ecosystems for unique wedding celebrations.",
        location: "900 N Birch Rd, Fort Lauderdale, FL 33304",
        price_range: "$$$$",
        capacity_min: 50,
        capacity_max: 200,
    },
    {
        name: "Bok Tower Gardens",
        service_area: "Lake Wales, FL",
        category: "venue",
        google_place_id: "ChIJp_qVL8Qm3ogRQF7OxHLqD-A",
        google_rating: 4.7,
        description: "Serene garden sanctuary featuring a 205-foot Singing Tower and lush landscapes perfect for romantic ceremonies.",
        location: "1151 Tower Blvd, Lake Wales, FL 33853",
        price_range: "$$$",
        capacity_min: 50,
        capacity_max: 150,
    },
    {
        name: "The Ringling",
        service_area: "Sarasota, FL",
        category: "venue",
        google_place_id: "ChIJt1xKX-fEwogRmJ9nGd_vh5A",
        google_rating: 4.7,
        description: "Museum of art and historic mansion with stunning courtyard and bayfront views for elegant cultural weddings.",
        location: "5401 Bay Shore Rd, Sarasota, FL 34243",
        price_range: "$$$$",
        capacity_min: 100,
        capacity_max: 300,
    },
    {
        name: "Alfred I. duPont Building",
        service_area: "Miami, FL",
        category: "venue",
        google_place_id: "ChIJ5YqVp_q22YgRNdXnQ8pLqYY",
        google_rating: 4.5,
        description: "Historic Art Deco landmark in downtown Miami offering grand ballroom spaces for sophisticated urban weddings.",
        location: "169 E Flagler St, Miami, FL 33131",
        price_range: "$$$$",
        capacity_min: 100,
        capacity_max: 400,
    },
    {
        name: "Cypress Grove Estate House",
        service_area: "Orlando, FL",
        category: "venue",
        google_place_id: "ChIJBxZ8qQV354gR4DvLHxPyZ1E",
        google_rating: 4.8,
        description: "Elegant lakefront estate with Mediterranean architecture and manicured gardens in the heart of Orlando.",
        location: "218 N Salisbury Ave, Orlando, FL 32801",
        price_range: "$$$$",
        capacity_min: 50,
        capacity_max: 200,
    },
    {
        name: "The Biltmore Hotel",
        service_area: "Coral Gables, FL",
        category: "venue",
        google_place_id: "ChIJbTYC0AC22YgRTnF8m9v5fxQ",
        google_rating: 4.6,
        description: "Historic Mediterranean Revival hotel with opulent ballrooms, gardens, and a signature tower for grand celebrations.",
        location: "1200 Anastasia Ave, Coral Gables, FL 33134",
        price_range: "$$$$$",
        capacity_min: 100,
        capacity_max: 600,
    },
    {
        name: "Southernmost Beach Resort",
        service_area: "Key West, FL",
        category: "venue",
        google_place_id: "ChIJi8nJXJjD0YgRYvGqMPe5aqk",
        google_rating: 4.3,
        description: "Tropical beachfront resort offering intimate and relaxed wedding venues with stunning sunset views.",
        location: "1319 Duval St, Key West, FL 33040",
        price_range: "$$$$",
        capacity_min: 30,
        capacity_max: 150,
    },
    {
        name: "Casa Feliz",
        service_area: "Winter Park, FL",
        category: "venue",
        google_place_id: "ChIJ1dJxXvN554gR0VqC7HoLxU0",
        google_rating: 4.7,
        description: "Historic Spanish farmhouse with charming gardens and rustic elegance for intimate wedding celebrations.",
        location: "656 N Park Ave, Winter Park, FL 32789",
        price_range: "$$$",
        capacity_min: 50,
        capacity_max: 150,
    },
    {
        name: "The Don CeSar",
        service_area: "St. Pete Beach, FL",
        category: "venue",
        google_place_id: "ChIJh_aEo1_LwogRfGqVLI-xvEc",
        google_rating: 4.5,
        description: "Iconic pink palace on the beach offering luxurious ballrooms and beachfront ceremony locations.",
        location: "3400 Gulf Blvd, St Pete Beach, FL 33706",
        price_range: "$$$$$",
        capacity_min: 100,
        capacity_max: 400,
    },
    {
        name: "Paradise Cove",
        service_area: "Orlando, FL",
        category: "venue",
        google_place_id: "ChIJr8YyE_B554gRbDnLmNvPxQM",
        google_rating: 4.6,
        description: "Tropical lakefront venue with tiki huts, white-sand beach, and lush gardens for island-style weddings.",
        location: "17129 Tiffany Anne Cir, Orlando, FL 32820",
        price_range: "$$$",
        capacity_min: 50,
        capacity_max: 300,
    },
    {
        name: "The Lightner Museum",
        service_area: "St. Augustine, FL",
        category: "venue",
        google_place_id: "ChIJU7sO1fU65ogRCcMqO7pBvUg",
        google_rating: 4.6,
        description: "Historic museum in a former grand hotel with ornate architecture and courtyard for elegant weddings.",
        location: "75 King St, St. Augustine, FL 32084",
        price_range: "$$$$",
        capacity_min: 100,
        capacity_max: 250,
    },
    {
        name: "Cummer Museum of Art & Gardens",
        service_area: "Jacksonville, FL",
        category: "venue",
        google_place_id: "ChIJHeBPZjQB5YgRqTnG_3kLrx4",
        google_rating: 4.7,
        description: "Art museum with stunning riverfront gardens featuring formal English and Italian gardens for artistic celebrations.",
        location: "829 Riverside Ave, Jacksonville, FL 32204",
        price_range: "$$$$",
        capacity_min: 50,
        capacity_max: 200,
    },
    {
        name: "Morikami Museum and Japanese Gardens",
        service_area: "Delray Beach, FL",
        category: "venue",
        google_place_id: "ChIJ7TvLp0IM2YgR8vH5nPxLqYw",
        google_rating: 4.7,
        description: "Authentic Japanese gardens with koi ponds, bamboo groves, and traditional architecture for tranquil weddings.",
        location: "4000 Morikami Park Rd, Delray Beach, FL 33446",
        price_range: "$$$",
        capacity_min: 50,
        capacity_max: 200,
    },
    {
        name: "The Treasury on the Plaza",
        service_area: "St. Augustine, FL",
        category: "venue",
        google_place_id: "ChIJB_g01fU65ogREqFnD7pCvTo",
        google_rating: 4.8,
        description: "Historic bank building transformed into an elegant event space in the heart of America's oldest city.",
        location: "48 Treasury St, St. Augustine, FL 32084",
        price_range: "$$$$",
        capacity_min: 80,
        capacity_max: 200,
    },
    {
        name: "Howey Mansion",
        service_area: "Howey-in-the-Hills, FL",
        category: "venue",
        google_place_id: "ChIJvfPZ8Y9354gR0TqL7XsLxU4",
        google_rating: 4.7,
        description: "Mediterranean Revival mansion with grand ballroom and scenic lake views for classic elegant weddings.",
        location: "1001 Citrus Ave, Howey-in-the-Hills, FL 34737",
        price_range: "$$$$",
        capacity_min: 100,
        capacity_max: 250,
    },
    {
        name: "The Acre Orlando",
        service_area: "Orlando, FL",
        category: "venue",
        google_place_id: "ChIJa8pJfvN554gRmDrLnNvQxQ8",
        google_rating: 4.9,
        description: "Romantic outdoor venue featuring a glass chapel, lush gardens, and enchanting lighting for dreamy celebrations.",
        location: "8955 Commodity Cir, Orlando, FL 32819",
        price_range: "$$$",
        capacity_min: 50,
        capacity_max: 200,
    },
    {
        name: "Flagler Museum",
        service_area: "Palm Beach, FL",
        category: "venue",
        google_place_id: "ChIJU_Kx5tIW2YgRaELqI7vMmU0",
        google_rating: 4.6,
        description: "Gilded Age mansion with opulent interiors and pristine gardens for luxurious historical weddings.",
        location: "1 Whitehall Way, Palm Beach, FL 33480",
        price_range: "$$$$$",
        capacity_min: 100,
        capacity_max: 300,
    },
    {
        name: "The Westin Cape Coral Resort",
        service_area: "Cape Coral, FL",
        category: "venue",
        google_place_id: "ChIJP_sO1wGz2YgRlU5NyT9XxXQ",
        google_rating: 4.4,
        description: "Waterfront resort with marina views, modern ballrooms, and tropical outdoor spaces for Southwest Florida weddings.",
        location: "5951 Silver King Blvd, Cape Coral, FL 33914",
        price_range: "$$$$",
        capacity_min: 80,
        capacity_max: 300,
    },
];

// Placeholder image URLs for venues (using high-quality generic wedding venue images)
const placeholderImages = [
    "https://images.unsplash.com/photo-1519167758481-83f29da8c19f?w=800",
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800",
    "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800",
    "https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?w=800",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800",
];

async function ingestVenues() {
    console.log('🎊 Starting Florida wedding venue ingestion...\n');

    for (const venue of floridaVenues) {
        console.log(`📍 Processing: ${venue.name} (${venue.service_area})`);

        // Insert venue
        const { data: vendorData, error: vendorError } = await supabase
            .from('vendors')
            .insert({
                name: venue.name,
                category: venue.category,
                description: venue.description,
                location: venue.location,
                street_address: venue.location,
                price_range: venue.price_range,
                capacity_min: venue.capacity_min,
                capacity_max: venue.capacity_max,
                guest_capacity: venue.capacity_max,
                google_place_id: venue.google_place_id,
                google_rating: venue.google_rating,
                is_claimed: false,
                owner_id: null,
                verified: false,
                active: true,
            })
            .select()
            .single();

        if (vendorError) {
            console.error(`   ❌ Error inserting ${venue.name}:`, vendorError.message);
            continue;
        }

        console.log(`   ✅ Venue created (ID: ${vendorData.id})`);

        // Create placeholder inspiration assets
        const assets = placeholderImages.map((url, index) => ({
            vendor_id: vendorData.id,
            image_url: url,
            alt_text: `${venue.name} - Photo ${index + 1}`,
            category_tag: 'venue',
            cost_model: 'VENUE',
        }));

        const { error: assetsError } = await supabase
            .from('inspiration_assets')
            .insert(assets);

        if (assetsError) {
            console.error(`   ⚠️  Error creating assets for ${venue.name}:`, assetsError.message);
        } else {
            console.log(`   ✅ Created ${assets.length} placeholder assets`);
        }

        console.log('');
    }

    console.log('🎉 Venue ingestion complete!');
    console.log(`📊 Total venues processed: ${floridaVenues.length}`);
}

// Run the ingestion
ingestVenues()
    .then(() => {
        console.log('\n✨ All done!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Fatal error:', error);
        process.exit(1);
    });
