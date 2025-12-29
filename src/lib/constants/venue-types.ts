/**
 * Venue Type Taxonomy
 * 37 venue categories with descriptions
 */

export interface VenueTypeOption {
    value: string;
    label: string;
    description: string;
}

export interface VenueTypeCategory {
    category: string;
    types: VenueTypeOption[];
}

export const VENUE_TYPES: VenueTypeCategory[] = [
    {
        category: "Traditional & Formal",
        types: [
            { value: "all-inclusive", label: "All-Inclusive Venues", description: "Stress-free, standardized elegance" },
            { value: "banquet-hall", label: "Banquet Halls", description: "Traditional, grand, accommodating large guest counts" },
            { value: "conference-center", label: "Conference Centers", description: "Functional, formal, often corporate-adjacent" },
            { value: "country-club", label: "Country Clubs", description: "Preppy, exclusive, manicured, social" },
            { value: "hotel", label: "Hotels", description: "Convenient, glamorous, ballroom-style" },
            { value: "house-of-worship", label: "House of Worship", description: "Religious, sacred, traditional" },
            { value: "university", label: "Universities and Colleges", description: "Nostalgic, academic, architectural, formal" },
        ]
    },
    {
        category: "Rustic & Natural",
        types: [
            { value: "barn", label: "Barns", description: "Country-chic, rustic, relaxed" },
            { value: "cabin", label: "Cabins and Cottages", description: "Cozy, intimate, woodsy" },
            { value: "campground", label: "Campgrounds", description: "Adventurous, casual, nature-focused (Glamping)" },
            { value: "farm", label: "Farms", description: "Organic, earth-to-table, pastoral" },
            { value: "ranch", label: "Ranches", description: "Western, rustic, spacious, rugged" },
            { value: "treehouse", label: "Tree Houses", description: "Whimsical, nature-immersive, intimate" },
            { value: "winery", label: "Wineries and Vineyards", description: "Romantic, sophisticated, scenic, agricultural" },
        ]
    },
    {
        category: "Urban & Industrial",
        types: [
            { value: "brewery", label: "Breweries and Distilleries", description: "Hip, casual, industrial, craft-focused" },
            { value: "city-hall", label: "City Halls", description: "Civil, chic, minimal, efficient" },
            { value: "loft", label: "Lofts and Rooftops", description: "Trendy, skyline views, open-concept, modern" },
            { value: "nightclub", label: "Nightclubs", description: "High-energy, party-focused, glamorous, late-night" },
            { value: "restaurant", label: "Restaurants", description: "Foodie-centric, intimate, turnkey" },
        ]
    },
    {
        category: "Historic & Unique",
        types: [
            { value: "bed-and-breakfast", label: "Bed and Breakfasts", description: "Quaint, homestyle, intimate" },
            { value: "castle", label: "Castles", description: "Fairytale, regal, historic, luxurious" },
            { value: "greenhouse", label: "Greenhouses", description: "Botanical, lush, light-filled, organic" },
            { value: "historic-place", label: "Historic Places", description: "Timeless, antique, character-rich" },
            { value: "lake-house", label: "Lake Houses", description: "Serene, waterfront, family-oriented" },
            { value: "private-garden", label: "Private Gardens", description: "Floral, romantic, soft, natural" },
        ]
    },
    {
        category: "Waterfront & Outdoor",
        types: [
            { value: "aquarium", label: "Aquariums and Zoos", description: "Exotic, interactive, underwater/wildlife backdrop" },
            { value: "beach", label: "Beaches", description: "Relaxed, oceanic, breezy, barefoot" },
            { value: "boat", label: "Boats and Yachts", description: "Nautical, luxury, moving scenery" },
            { value: "resort", label: "Resorts", description: "Vacation-vibe, luxurious, comprehensive amenities" },
        ]
    },
    {
        category: "Entertainment & Cultural",
        types: [
            { value: "amusement-park", label: "Amusement Parks", description: "Playful, nostalgic, high-energy, unconventional" },
            { value: "food-truck-park", label: "Food Truck Park", description: "Festival-style, casual, eclectic, community-focused" },
            { value: "library", label: "Libraries", description: "Intellectual, quiet, literary, architectural" },
            { value: "museum", label: "Museums and Galleries", description: "Cultured, artistic, sophisticated, curated" },
            { value: "sports-stadium", label: "Sports Stadiums", description: "Fan-centric, massive scale, energetic" },
            { value: "theater", label: "Theaters", description: "Dramatic, theatrical, vintage/art deco" },
        ]
    },
    {
        category: "Private & Personal",
        types: [
            { value: "private-home", label: "Private Homes", description: "Personal, sentimental, flexible control" },
            { value: "public-park", label: "Public Spaces and Parks", description: "Community-oriented, open, budget-conscious" },
        ]
    }
];

// Flatten all venue types for easy lookup
export const ALL_VENUE_TYPES: VenueTypeOption[] = VENUE_TYPES.flatMap(cat => cat.types);

// Get venue type label by value
export const getVenueTypeLabel = (value: string): string => {
    const venueType = ALL_VENUE_TYPES.find(vt => vt.value === value);
    return venueType?.label || value;
};

// Get venue type description by value
export const getVenueTypeDescription = (value: string): string => {
    const venueType = ALL_VENUE_TYPES.find(vt => vt.value === value);
    return venueType?.description || '';
};
