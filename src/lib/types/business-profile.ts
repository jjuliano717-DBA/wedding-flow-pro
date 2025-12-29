/**
 * Business Profile Linking Types
 * 
 * Types for the linkUserToBusiness function that bridges Auth and Business Data
 */

export type LinkBusinessProfileResult =
    | { status: 'claimed'; profileId: string; message: string }
    | { status: 'linked'; profileId: string; message: string }
    | { status: 'created'; profileId: string; message: string }
    | { status: 'error'; message: string; error?: unknown };

export interface BusinessProfile {
    id: string;
    owner_id: string | null;
    name: string;
    category: string; // 'vendor', 'venue', 'planner'
    type: string | null;
    venue_type?: string | null; // Specific venue category
    description: string | null;
    location: string | null;
    street_address?: string | null;
    contact_email: string | null;
    contact_phone: string | null;
    website: string | null;
    google_business_url: string | null;
    image_url: string | null;
    google_rating: number | null;
    google_reviews: number | null;
    heart_rating: number | null;
    exclusive: boolean | null;
    featured: boolean | null;
    service_zipcodes: string[] | null;
    guest_capacity?: number | null;
    amenities?: string[] | null;
    faqs?: any | null;
    price?: string | null; // '$', '$$', '$$$', '$$$$'
    indoor?: boolean | null;
    outdoor?: boolean | null;
    images?: string[] | null;
    created_at: string;
    updated_at: string;
}

export interface LinkBusinessProfileInput {
    userEmail: string;
    userId: string;
    userRole?: string; // Optional: used to set category for new profiles
}
