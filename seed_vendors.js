
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wytscoyfbsklptqdqkir.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5dHNjb3lmYnNrbHB0cWRxa2lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNjgyNjgsImV4cCI6MjA4MTc0NDI2OH0.z8MB-E94Wq3Q5qHb8rE2qSL5QdLyWG9I_JGR1H7qY3s';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const vendors = [
    { name: "Original Weddings", type: "Photographer", google_rating: 4.9, google_reviews: 677, heart_rating: 5, location: "Tampa, FL", description: "High-capacity team providing synchronized photo and video for large events.", exclusive: false },
    { name: "Munoz Photography", type: "Photographer", google_rating: 4.9, google_reviews: 194, heart_rating: 5, location: "Fort Lauderdale, FL", description: "Award-winning studio specializing in high-fashion, editorial wedding imagery.", exclusive: false },
    { name: "Iyrus Weddings", type: "Photographer", google_rating: 5, google_reviews: 140, heart_rating: 5, location: "Tampa, FL", description: "Highly reviewed for storytelling and emotional candid photography.", exclusive: false },
    { name: "Flowers by Fudgie", type: "Florist", google_rating: 4.9, google_reviews: 264, heart_rating: 4, location: "Sarasota, FL", description: "Luxury event florist specializing in custom designs for high-end coastal venues.", exclusive: false },
    { name: "Eve’s Florist", type: "Florist", google_rating: 4.8, google_reviews: 135, heart_rating: 4, location: "Tampa, FL", description: "Dedicated to personalized bridal bouquets and floral venue transformations.", exclusive: false },
    { name: "Beneva Flowers", type: "Florist", google_rating: 4.8, google_reviews: 310, heart_rating: 4, location: "Sarasota, FL", description: "High-volume luxury florist with specialized event planning consultants.", exclusive: false },
    { name: "Eddie B & Company", type: "DJ/Band", google_rating: 4.9, google_reviews: 1583, heart_rating: 5, location: "Fort Lauderdale, FL", description: "Full-service entertainment including live bands, DJs, and lighting effects.", exclusive: false },
    { name: "Joe Farren Music", type: "DJ/Band", google_rating: 5, google_reviews: 143, heart_rating: 5, location: "Tampa, FL", description: "Multi-instrumentalist providing live acoustic sets and high-energy DJ services.", exclusive: false },
    { name: "Soundwave Ent.", type: "DJ/Band", google_rating: 5, google_reviews: 571, heart_rating: 5, location: "Orlando, FL", description: "Specialized in LED lighting design and professional MC services.", exclusive: false },
    { name: "Good Food Events", type: "Caterer", google_rating: 4.9, google_reviews: 118, heart_rating: 5, location: "Tampa, FL", description: "Innovative custom menus with full-service event decor and rentals.", exclusive: false },
    { name: "Arthur’s Catering", type: "Caterer", google_rating: 4.8, google_reviews: 240, heart_rating: 4, location: "Altamonte Springs, FL", description: "Established caterer known for creative food stations and plated excellence.", exclusive: false },
    { name: "Just Think Cake", type: "Cake Designer", google_rating: 4.9, google_reviews: 408, heart_rating: 5, location: "Ft. Walton Beach, FL", description: "Expert in architectural wedding cakes and high-detail sugar artistry.", exclusive: false },
    { name: "The Artistic Whisk", type: "Cake Designer", google_rating: 4.9, google_reviews: 138, heart_rating: 5, location: "St. Petersburg, FL", description: "Luxury bakery focusing on European-style scratch-made wedding cakes.", exclusive: false },
    { name: "Elegant Pairings", type: "Planner", google_rating: 5, google_reviews: 112, heart_rating: 5, location: "Pensacola, FL", description: "Full-service destination wedding planners with high-touch coordination.", exclusive: false },
    { name: "Florida Sun Weddings", type: "Planner", google_rating: 5, google_reviews: 225, heart_rating: 5, location: "Sarasota, FL", description: "Specialized in Gulf Coast beach wedding elopements and ceremonies.", exclusive: false },
    { name: "Renata Hair & Makeup", type: "Hair & Makeup", google_rating: 4.9, google_reviews: 253, heart_rating: 5, location: "Miami, FL", description: "Premier bridal glam team focusing on long-wear, camera-ready styles.", exclusive: false },
    { name: "Looking Like a Star", type: "Hair & Makeup", google_rating: 5, google_reviews: 95, heart_rating: 5, location: "Miami, FL", description: "Mobile hair and makeup team specializing in luxury bridal transformations.", exclusive: false },
    { name: "Cinemedia", type: "Videographer", google_rating: 5, google_reviews: 129, heart_rating: 5, location: "Orlando, FL", description: "Cinematic film production focusing on documentary-style wedding stories.", exclusive: false },
    { name: "Bells & Whistles", type: "Videographer", google_rating: 5, google_reviews: 150, heart_rating: 5, location: "Pembroke Pines, FL", description: "Husband-and-wife team providing emotional, high-definition wedding films.", exclusive: false },
    { name: "Mosquito Shield", type: "Pest Control", google_rating: 4.9, google_reviews: 320, heart_rating: 5, location: "Tampa, FL", description: "Essential barrier protection for outdoor and waterfront wedding venues.", exclusive: false }
];

async function seed() {
    console.log("Seeding vendors...");

    // Optional: clear existing
    // await supabase.from('vendors').delete().neq('id', '00000000-0000-0000-0000-000000000000'); 

    const { data, error } = await supabase.from('vendors').insert(vendors).select();

    if (error) {
        console.error("Error inserting vendors:", error);
    } else {
        console.log(`Successfully added ${data.length} vendors.`);
    }
}

seed();
