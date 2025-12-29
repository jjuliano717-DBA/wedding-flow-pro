-- Check the vendors table schema to see all available fields
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'vendors'
ORDER BY ordinal_position;
