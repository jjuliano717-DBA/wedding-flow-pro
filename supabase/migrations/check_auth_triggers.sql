-- Check ALL triggers on auth.users, including BEFORE triggers
SELECT 
    t.trigger_name,
    t.event_manipulation,
    t.action_timing,
    t.action_orientation,
    t.action_statement,
    p.proname AS function_name
FROM information_schema.triggers t
LEFT JOIN pg_proc p ON t.action_statement LIKE '%' || p.proname || '%'
WHERE t.event_object_schema = 'auth'
AND t.event_object_table = 'users'
ORDER BY t.action_timing, t.trigger_name;
