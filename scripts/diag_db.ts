import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspectSchema() {
    console.log('Inspecting Schema...');

    // Check if we can query the users table
    const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*')
        .limit(1);

    if (usersError) {
        console.error('Error querying users table:', usersError.message);
    } else {
        console.log('Successfully queried users table. Sample:', users);
    }

    // Check for triggers on auth.users (requires a bit more than just anon key usually, but let's try RPC if available)
    // Actually, we can just try to signUp and see the error again with more detail
    const email = `diag-${Date.now()}@test.com`;
    console.log(`Trying signUp for ${email}...`);
    const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password: 'pasword1',
        options: {
            data: { full_name: 'Diagnostic User', role: 'couple' }
        }
    });

    if (signUpError) {
        console.error('SignUp Error Detail:', JSON.stringify(signUpError, null, 2));
    } else {
        console.log('SignUp Succeeded for diag user');
    }
}

inspectSchema();
