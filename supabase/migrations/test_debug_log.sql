-- Test if we can write to the debug log table
DO $$
BEGIN
    INSERT INTO public.trigger_debug_log (user_id, user_email, step, message)
    VALUES (gen_random_uuid(), 'test@test.com', 'TEST', 'Testing debug log write');
    
    RAISE NOTICE 'Debug log write successful';
END $$;

-- Check if any logs exist
SELECT COUNT(*) as log_count FROM public.trigger_debug_log;

-- Try to see all logs
SELECT * FROM public.trigger_debug_log ORDER BY log_time DESC LIMIT 10;
