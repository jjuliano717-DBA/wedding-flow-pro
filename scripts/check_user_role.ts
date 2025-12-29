// scripts/check_user_role.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Supabase URL or Service Role Key not set.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function check() {
    const { data, error } = await supabase
        .from('profiles')
        .select('email, role')
        .eq('email', 'venue_user@example.com');

    if (error) {
        console.error('❌ Query error:', error.message);
    } else if (data && data.length > 0) {
        console.log('✅ User record:', data[0]);
    } else {
        console.log('⚠️ No user found with that email');
    }
}

check().finally(() => process.exit());
