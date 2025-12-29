-- Check if there's a 'users' table in public schema
SELECT table_name, table_schema
FROM information_schema.tables
WHERE table_name = 'users'
ORDER BY table_schema;

-- Check the structure of the users table if it exists
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'users'
AND table_schema = 'public'
ORDER BY ordinal_position;
