/**
 * Google Places API Client
 * Fetches business verification data from Google to display trust scores
 */

const PLACES_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

export interface PlaceDetails {
    placeId: string;
    name: string;
    rating: number;
    userRatingsTotal: number;
    businessStatus: 'OPERATIONAL' | 'CLOSED_TEMPORARILY' | 'CLOSED_PERMANENTLY' | 'UNKNOWN';
    formattedAddress?: string;
    formattedPhoneNumber?: string;
    website?: string;
    url?: string; // Google Maps URL
    photos?: string[];
    verified: boolean;
}

export interface TrustScore {
    score: number; // 0-100
    tier: 'gold' | 'silver' | 'bronze' | 'unverified';
    breakdown: {
        ratingScore: number;
        reviewCountScore: number;
        statusScore: number;
    };
}

/**
 * Extract Place ID from a Google Business URL
 * Supports formats like:
 * - https://www.google.com/maps/place/?cid=XXXXXXX
 * - https://maps.google.com/?cid=XXXXXXX
 * - https://g.page/business-name
 * - https://www.google.com/maps/place/Business+Name/@lat,lng,zoom/data=...
 */
export function extractPlaceIdFromUrl(googleBusinessUrl: string): string | null {
    if (!googleBusinessUrl) return null;

    try {
        const url = new URL(googleBusinessUrl);

        // Check for CID parameter (most reliable)
        const cid = url.searchParams.get('cid');
        if (cid) {
            return `cid:${cid}`;
        }

        // Check for place_id in data parameter
        const pathMatch = googleBusinessUrl.match(/place\/([^\/]+)/);
        if (pathMatch) {
            return `query:${decodeURIComponent(pathMatch[1]).replace(/\+/g, ' ')}`;
        }

        // For g.page links, use the path as a search query
        if (url.hostname === 'g.page') {
            return `query:${url.pathname.slice(1)}`;
        }

        return null;
    } catch {
        return null;
    }
}

/**
 * Fetch place details from Google Places API using Text Search
 * We use text search since we often have business names rather than exact place IDs
 */
export async function getPlaceDetails(searchQuery: string, location?: string): Promise<PlaceDetails | null> {
    if (!PLACES_API_KEY) {
        console.warn('Google Places API key not configured');
        return null;
    }

    try {
        // Use Places API Text Search
        const query = location ? `${searchQuery} ${location}` : searchQuery;
        const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${PLACES_API_KEY}`;

        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();

        if (searchData.status !== 'OK' || !searchData.results?.length) {
            console.warn('Place not found:', searchQuery);
            return null;
        }

        const place = searchData.results[0];

        // Get detailed info using Place Details API
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,rating,user_ratings_total,business_status,formatted_address,formatted_phone_number,website,url,photos&key=${PLACES_API_KEY}`;

        const detailsResponse = await fetch(detailsUrl);
        const detailsData = await detailsResponse.json();

        if (detailsData.status !== 'OK') {
            // Fallback to basic search results
            return {
                placeId: place.place_id,
                name: place.name,
                rating: place.rating || 0,
                userRatingsTotal: place.user_ratings_total || 0,
                businessStatus: place.business_status || 'UNKNOWN',
                formattedAddress: place.formatted_address,
                verified: true,
            };
        }

        const details = detailsData.result;
        return {
            placeId: place.place_id,
            name: details.name,
            rating: details.rating || 0,
            userRatingsTotal: details.user_ratings_total || 0,
            businessStatus: details.business_status || 'OPERATIONAL',
            formattedAddress: details.formatted_address,
            formattedPhoneNumber: details.formatted_phone_number,
            website: details.website,
            url: details.url,
            photos: details.photos?.slice(0, 5).map((p: any) =>
                `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${p.photo_reference}&key=${PLACES_API_KEY}`
            ),
            verified: true,
        };
    } catch (error) {
        console.error('Error fetching place details:', error);
        return null;
    }
}

/**
 * Fetch place details directly from a Google Business URL
 */
export async function getPlaceDetailsFromUrl(googleBusinessUrl: string): Promise<PlaceDetails | null> {
    const placeReference = extractPlaceIdFromUrl(googleBusinessUrl);
    if (!placeReference) {
        return null;
    }

    // If we have a query-based reference, search for it
    if (placeReference.startsWith('query:')) {
        const query = placeReference.slice(6);
        return getPlaceDetails(query);
    }

    // If we have a CID, we'd need to use a different approach
    // For now, return null and let the UI fall back to manual verification
    return null;
}

/**
 * Calculate a trust score based on Google Place details
 * Score ranges from 0-100:
 * - Rating contributes up to 40 points (4.0+ rating = 40 pts)
 * - Review count contributes up to 40 points (100+ reviews = 40 pts)
 * - Business status contributes up to 20 points (OPERATIONAL = 20 pts)
 */
export function calculateTrustScore(placeDetails: PlaceDetails | null): TrustScore {
    if (!placeDetails) {
        return {
            score: 0,
            tier: 'unverified',
            breakdown: { ratingScore: 0, reviewCountScore: 0, statusScore: 0 }
        };
    }

    // Rating score (0-40): 4.0 rating = 40 pts, scales linearly from 3.0
    const ratingScore = Math.min(40, Math.max(0, (placeDetails.rating - 3) * 40));

    // Review count score (0-40): logarithmic scale, 100+ reviews = 40 pts
    const reviewCountScore = Math.min(40, Math.log10(placeDetails.userRatingsTotal + 1) * 20);

    // Status score (0-20): OPERATIONAL = 20 pts
    let statusScore = 0;
    if (placeDetails.businessStatus === 'OPERATIONAL') {
        statusScore = 20;
    } else if (placeDetails.businessStatus === 'CLOSED_TEMPORARILY') {
        statusScore = 10;
    }

    const totalScore = Math.round(ratingScore + reviewCountScore + statusScore);

    // Determine tier
    let tier: TrustScore['tier'] = 'unverified';
    if (totalScore >= 80) tier = 'gold';
    else if (totalScore >= 60) tier = 'silver';
    else if (totalScore >= 40) tier = 'bronze';

    return {
        score: totalScore,
        tier,
        breakdown: {
            ratingScore: Math.round(ratingScore),
            reviewCountScore: Math.round(reviewCountScore),
            statusScore
        }
    };
}

/**
 * Get verification data for a vendor/venue by name and location
 * This is the main function to use for vendor verification
 */
export async function getVendorVerification(vendorName: string, location?: string, googleBusinessUrl?: string): Promise<{
    placeDetails: PlaceDetails | null;
    trustScore: TrustScore;
}> {
    let placeDetails: PlaceDetails | null = null;

    // Try to get details from Google Business URL first
    if (googleBusinessUrl) {
        placeDetails = await getPlaceDetailsFromUrl(googleBusinessUrl);
    }

    // Fall back to searching by name and location
    if (!placeDetails && vendorName) {
        placeDetails = await getPlaceDetails(vendorName, location);
    }

    const trustScore = calculateTrustScore(placeDetails);

    return { placeDetails, trustScore };
}
