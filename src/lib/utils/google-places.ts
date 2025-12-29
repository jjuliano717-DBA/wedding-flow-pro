/**
 * Google Places Utility Functions
 * 
 * Helper functions for extracting Place IDs and mapping Google Places data
 */

export interface GooglePlaceData {
    name: string;
    formatted_address: string;
    address_components: Array<{
        long_name: string;
        short_name: string;
        types: string[];
    }>;
    formatted_phone_number?: string;
    website?: string;
    rating?: number;
    user_ratings_total?: number;
    editorial_summary?: {
        overview?: string;
    };
    photos?: Array<{
        photo_reference: string;
    }>;
}

export interface VenueData {
    business_name: string;
    street_address: string;
    location: string; // City, State
    contact_phone: string;
    website: string;
    google_business_url?: string;
    google_rating: number;
    google_reviews: number;
    description: string;
}

/**
 * Extract Place ID from various Google URL formats
 */
export function extractPlaceId(input: string): string | null {
    // If it's already a Place ID (starts with ChIJ)
    if (input.startsWith('ChIJ')) {
        return input;
    }

    try {
        const url = new URL(input);

        // Format 1: https://maps.google.com/?cid=123456789
        if (url.searchParams.has('cid')) {
            // CID needs to be converted via API, return as-is for now
            return url.searchParams.get('cid');
        }

        // Format 2: https://www.google.com/maps/place/...
        // Extract from path or data parameter
        const pathMatch = url.pathname.match(/place\/([^\/]+)/);
        if (pathMatch) {
            return decodeURIComponent(pathMatch[1]);
        }

        // Format 3: data parameter contains place ID
        const dataParam = url.searchParams.get('data');
        if (dataParam) {
            const placeIdMatch = dataParam.match(/!1s(ChIJ[^!]+)/);
            if (placeIdMatch) {
                return placeIdMatch[1];
            }
        }

        // Format 4: https://g.page/business-name
        // This requires a redirect follow, which we'll handle server-side
        if (url.hostname === 'g.page' || url.hostname === 'goo.gl') {
            return input; // Return full URL for server-side processing
        }

        return null;
    } catch (error) {
        // Not a valid URL, might be a Place ID
        if (input.startsWith('ChIJ')) {
            return input;
        }
        return null;
    }
}

/**
 * Map Google Places API response to our venue data schema
 */
export function mapGooglePlaceToVenue(place: GooglePlaceData): Partial<VenueData> {
    // Extract city and state from address components
    let city = '';
    let state = '';

    place.address_components?.forEach((component) => {
        if (component.types.includes('locality')) {
            city = component.long_name;
        }
        if (component.types.includes('administrative_area_level_1')) {
            state = component.short_name;
        }
    });

    const location = city && state ? `${city}, ${state}` : '';

    return {
        business_name: place.name || '',
        street_address: place.formatted_address || '',
        location,
        contact_phone: place.formatted_phone_number || '',
        website: place.website || '',
        google_rating: place.rating || 0,
        google_reviews: place.user_ratings_total || 0,
        description: place.editorial_summary?.overview || '',
    };
}

/**
 * Validate that place data has minimum required fields
 */
export function validatePlaceData(data: Partial<VenueData>): boolean {
    return !!(data.business_name && data.street_address);
}

/**
 * Format phone number to a consistent format
 */
export function formatPhoneNumber(phone: string): string {
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');

    // Format as (XXX) XXX-XXXX
    if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }

    // Return as-is if not 10 digits
    return phone;
}
