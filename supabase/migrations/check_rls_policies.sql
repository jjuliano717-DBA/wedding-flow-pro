-- Check current RLS policies on vendors table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual AS using_expression,
    with_check AS with_check_expression
FROM pg_policies
WHERE tablename = 'vendors'
ORDER BY cmd, policyname;
