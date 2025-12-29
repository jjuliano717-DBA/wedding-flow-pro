-- Verify all required columns exist in vendors table for venue profile management
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'vendors'
AND table_schema = 'public'
AND column_name IN (
    'google_business_url',
    'location',
    'street_address',
    'description',
    'price',
    'guest_capacity',
    'contact_phone',
    'phone',
    'website',
    'service_zipcodes',
    'venue_type',
    'contact_email'
)
ORDER BY column_name;
