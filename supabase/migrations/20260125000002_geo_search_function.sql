-- =====================================================
-- Geospatial Search RPC Function
-- Purpose: Search vendors/venues by location with filters
-- =====================================================

CREATE OR REPLACE FUNCTION search_vendors_geo(
    p_origin_lat DECIMAL,
    p_origin_long DECIMAL,
    p_radius_miles INTEGER DEFAULT 25,
    p_filter_capacity_min INTEGER DEFAULT NULL,
    p_filter_category TEXT DEFAULT NULL,
    p_filter_date DATE DEFAULT NULL
) RETURNS TABLE (
    id UUID,
    name TEXT,
    description TEXT,
    type TEXT,
    category TEXT,
    location TEXT,
    latitude DECIMAL,
    longitude DECIMAL,
    distance_miles DECIMAL,
    website TEXT,
    image_url TEXT,
    google_rating DECIMAL,
    google_reviews INTEGER,
    heart_rating DECIMAL,
    exclusive BOOLEAN,
    is_claimed BOOLEAN,
    capacity_num INTEGER,
    phone TEXT,
    service_areas TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        v.id,
        v.name,
        v.description,
        v.type,
        v.category,
        v.location,
        v.latitude,
        v.longitude,
        haversine_distance(p_origin_lat, p_origin_long, v.latitude, v.longitude) as distance_miles,
        v.website,
        v.image_url,
        v.google_rating,
        v.google_reviews,
        v.heart_rating,
        v.exclusive,
        (v.owner_id IS NOT NULL) as is_claimed,
        v.capacity_num,
        v.phone,
        v.service_areas
    FROM vendors v
    WHERE 
        -- Must have valid coordinates
        v.latitude IS NOT NULL 
        AND v.longitude IS NOT NULL
        
        -- Within radius
        AND haversine_distance(p_origin_lat, p_origin_long, v.latitude, v.longitude) <= p_radius_miles
        
        -- Category filter (if provided)
        AND (p_filter_category IS NULL OR v.category = p_filter_category)
        
        -- Capacity filter (if provided)
        AND (p_filter_capacity_min IS NULL OR v.capacity_num >= p_filter_capacity_min)
        
        -- Availability filter (if date provided, exclude unavailable vendors)
        AND (
            p_filter_date IS NULL 
            OR NOT EXISTS (
                SELECT 1 
                FROM vendor_availability va
                WHERE va.vendor_id = v.id
                AND va.blocked_date = p_filter_date
            )
        )
        
    -- Ranking: Claimed (verified) first, then by rating, then by distance
    ORDER BY
        (v.owner_id IS NOT NULL) DESC,  -- Claimed vendors first
        v.google_rating DESC NULLS LAST,  -- Higher ratings first
        distance_miles ASC;  -- Closer vendors first
END;
$$ LANGUAGE plpgsql STABLE;

-- Add index for better performance (if not exists)
CREATE INDEX IF NOT EXISTS idx_vendors_geocoding ON vendors(latitude, longitude) WHERE latitude IS NOT NULL;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION search_vendors_geo(DECIMAL, DECIMAL, INTEGER, INTEGER, TEXT, DATE) TO anon, authenticated;

COMMENT ON FUNCTION search_vendors_geo IS 'Search vendors/venues by geographic location with radius, capacity, category, and availability filters';
