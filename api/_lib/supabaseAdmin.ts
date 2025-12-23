import { createClient } from '@supabase/supabase-js';

// Node.js environment uses process.env
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Missing Supabase environment variables in API route.');
}

// Service role key is preferred for backend operations to bypass RLS if needed,
// but for this specific user swipe logic, we might want to stay in the user context.
// However, calculations and database writes that involve multiple tables often need elevated privileges.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
