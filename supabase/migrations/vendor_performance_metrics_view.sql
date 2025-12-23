-- =====================================================
-- Vendor Performance Metrics View
-- Purpose: Calculate Look-to-Book analytics with vendor classification
-- Date: 2025-12-22
-- =====================================================

-- Drop existing view if it exists
DROP VIEW IF EXISTS vendor_performance_metrics CASCADE;

-- Create the performance metrics view
CREATE OR REPLACE VIEW vendor_performance_metrics AS
WITH vendor_swipes AS (
    -- Count all swipes per vendor (via inspiration_assets)
    SELECT 
        v.id AS vendor_id,
        v.name AS vendor_name,
        v.owner_id AS planner_id,  -- For Black Book filtering by planner
        COUNT(DISTINCT us.id) AS swipe_count,
        COUNT(DISTINCT CASE 
            WHEN us.swipe_direction IN ('RIGHT', 'SUPER_LIKE') 
            THEN us.id 
        END) AS save_count
    FROM vendors v
    LEFT JOIN inspiration_assets ia ON ia.vendor_id = v.id
    LEFT JOIN user_swipes us ON us.asset_id = ia.id
    GROUP BY v.id, v.name, v.owner_id
),
vendor_inquiries AS (
    -- Count inquiries and bookings per vendor
    SELECT 
        vendor_id,
        COUNT(*) AS inquiry_count,
        COUNT(CASE WHEN status = 'booked' THEN 1 END) AS booking_count
    FROM inquiries
    WHERE vendor_id IS NOT NULL
    GROUP BY vendor_id
)
SELECT 
    vs.vendor_id,
    vs.vendor_name,
    vs.planner_id,
    COALESCE(vs.swipe_count, 0) AS swipe_count,
    COALESCE(vs.save_count, 0) AS save_count,
    COALESCE(vi.inquiry_count, 0) AS inquiry_count,
    COALESCE(vi.booking_count, 0) AS booking_count,
    
    -- Calculate Look-to-Book ratio (bookings / swipes * 100)
    CASE 
        WHEN vs.swipe_count > 0 THEN 
            ROUND((vi.booking_count::NUMERIC / vs.swipe_count::NUMERIC * 100)::NUMERIC, 2)
        ELSE 0
    END AS look_to_book_ratio,
    
    -- Vendor Classification Logic
    CASE
        -- Viral: High swipes (>100), low conversion (<1%)
        WHEN vs.swipe_count > 100 
             AND (vi.booking_count::NUMERIC / NULLIF(vs.swipe_count, 0)::NUMERIC) < 0.01 
        THEN 'Viral'
        
        -- Hidden Gem: Low swipes (<50), high conversion (>10%)
        WHEN vs.swipe_count < 50 
             AND vs.swipe_count > 0
             AND (vi.booking_count::NUMERIC / vs.swipe_count::NUMERIC) > 0.10 
        THEN 'Hidden Gem'
        
        -- Anchor: High swipes (>100), high conversion (>5%)
        WHEN vs.swipe_count > 100 
             AND (vi.booking_count::NUMERIC / NULLIF(vs.swipe_count, 0)::NUMERIC) > 0.05 
        THEN 'Anchor'
        
        -- Emerging: Everything else
        ELSE 'Emerging'
    END AS classification,
    
    -- Metadata
    NOW() AS calculated_at
    
FROM vendor_swipes vs
LEFT JOIN vendor_inquiries vi ON vi.vendor_id = vs.vendor_id
ORDER BY booking_count DESC, swipe_count DESC;

-- Add helpful comment
COMMENT ON VIEW vendor_performance_metrics IS 
'Vendor analytics view with Look-to-Book ratios and classification (Viral/Hidden Gem/Anchor/Emerging). 
Use planner_id column to filter for Black Book private analytics.';

-- =====================================================
-- Example Queries for Verification
-- =====================================================

-- View all metrics
-- SELECT * FROM vendor_performance_metrics LIMIT 10;

-- Find Viral vendors
-- SELECT * FROM vendor_performance_metrics WHERE classification = 'Viral';

-- Find Hidden Gems
-- SELECT * FROM vendor_performance_metrics WHERE classification = 'Hidden Gem';

-- Find Anchors (best performers)
-- SELECT * FROM vendor_performance_metrics WHERE classification = 'Anchor';

-- Filter by planner (for Black Book)
-- SELECT * FROM vendor_performance_metrics 
-- WHERE planner_id = 'your-planner-uuid-here';

-- Top performers by Look-to-Book ratio
-- SELECT vendor_name, look_to_book_ratio, classification, booking_count, swipe_count
-- FROM vendor_performance_metrics 
-- WHERE swipe_count > 10 
-- ORDER BY look_to_book_ratio DESC 
-- LIMIT 20;
