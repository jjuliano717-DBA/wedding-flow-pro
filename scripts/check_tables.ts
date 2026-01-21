
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

const envConfig = dotenv.parse(fs.readFileSync('.env'));
for (const k in envConfig) {
    process.env[k] = envConfig[k];
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
    // We can't query information_schema directly via supabase-js client easily unless we use RPC or just check if 'users' table access works.
    // Instead, I'll try to select from 'users' and 'profiles' and see which one errors.

    console.log("Checking 'profiles' table...");
    const { error: profileError } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    if (profileError) console.log("Profiles Error:", profileError.message);
    else console.log("Profiles table exists and is accessible.");

    console.log("Checking 'users' table...");
    const { error: usersError } = await supabase.from('users').select('count', { count: 'exact', head: true });
    if (usersError) console.log("Users Error:", usersError.message);
    else console.log("Users table exists and is accessible.");
}

main();
