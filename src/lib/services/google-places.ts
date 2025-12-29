/**
 * Google Places Service
 * 
 * Service for fetching venue data from Google Places API
 * 
 * IMPORTANT: This implementation requires a backend API route to protect the API key.
 * For production, create a Supabase Edge Function or Express backend.
 * 
 * For now, this is a client-side implementation with a placeholder for the backend call.
 */

import { extractPlaceId, mapGooglePlaceToVenue, validatePlaceData, type VenueData } from '@/lib/utils/google-places';

const GOOGLE_PLACES_API_URL = 'https://maps.googleapis.com/maps/api/place/details/json';

/**
 * Fetch place data from Google Places API
 * 
 * NOTE: In production, this should call a backend API route that proxies the request
 * to protect the API key.
 */
export async function fetchPlaceData(urlOrPlaceId: string): Promise<Partial<VenueData> | null> {
    try {
        // Extract Place ID from URL
        const placeId = extractPlaceId(urlOrPlaceId);

        if (!placeId) {
            throw new Error('Invalid Google Business URL or Place ID');
        }

        // TODO: Replace with backend API call
        // For now, return mock data for development
        // In production, call: POST /api/google-places with { placeId }

        const response = await callBackendAPI(placeId);

        if (!response) {
            throw new Error('Failed to fetch place data');
        }

        const venueData = mapGooglePlaceToVenue(response);

        // Include the original URL as google_business_url
        venueData.google_business_url = urlOrPlaceId;

        if (!validatePlaceData(venueData)) {
            throw new Error('Incomplete place data received');
        }

        return venueData;
    } catch (error) {
        console.error('Error fetching place data:', error);
        throw error;
    }
}

/**
 * Call Supabase Edge Function to fetch Google Places data
 * 
 * This function calls the Supabase Edge Function that securely
 * calls Google Places API with the API key.
 */
async function callBackendAPI(placeId: string): Promise<any> {
    try {
        // Get Supabase URL from environment
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        if (!supabaseUrl) {
            console.error('VITE_SUPABASE_URL not configured');
            // Fallback to mock data if Supabase not configured
            return getMockPlaceData();
        }

        const response = await fetch(
            `${supabaseUrl}/functions/v1/google-places`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${supabaseAnonKey}`
                },
                body: JSON.stringify({ placeId })
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch place data');
        }

        const data = await response.json();

        // Google Places API returns data in 'result' field
        return data.result || data;
    } catch (error) {
        console.error('Error calling backend API:', error);
        // Fallback to mock data on error for development
        console.warn('Falling back to mock data');
        return getMockPlaceData();
    }
}

/**
 * Mock place data for development/testing
 */
function getMockPlaceData() {
    return {
        name: 'Flora Groves Farm',
        formatted_address: '8520 Poyner Ln, Thonotosassa, FL 33592',
        address_components: [
            { long_name: 'Thonotosassa', short_name: 'Thonotosassa', types: ['locality'] },
            { long_name: 'Florida', short_name: 'FL', types: ['administrative_area_level_1'] }
        ],
        formatted_phone_number: '(813) 986-9620',
        website: 'https://www.floragrovesfarm.com',
        rating: 5.0,
        user_ratings_total: 127,
        editorial_summary: {
            overview: 'Beautiful outdoor wedding venue nestled in the heart of Thonotosassa. Our picturesque farm offers stunning vineyard views, rustic charm, and modern amenities for your perfect day.'
        },
        photos: [
            { photo_reference: 'mock_photo_ref_1' },
            { photo_reference: 'mock_photo_ref_2' },
            { photo_reference: 'mock_photo_ref_3' }
        ]
    };
}

/**
 * Follow redirects for short URLs (g.page, goo.gl)
 * 
 * This should be done server-side to avoid CORS issues
 */
export async function followRedirect(shortUrl: string): Promise<string | null> {
    try {
        // This needs to be done server-side
        // For now, return null and let user paste the full URL
        console.warn('Short URL redirect following not implemented. Please use full Google Maps URL.');
        return null;
    } catch (error) {
        console.error('Error following redirect:', error);
        return null;
    }
}
