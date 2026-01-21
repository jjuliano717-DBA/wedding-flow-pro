
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

const envConfig = dotenv.parse(fs.readFileSync('.env'));
for (const k in envConfig) {
    process.env[k] = envConfig[k];
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

async function main() {
    console.log("Checking columns for 'profiles'...");
    // We can try to select specific columns to see if they error
    const { error: profileError } = await supabase.from('profiles').select('stress_level').limit(1);
    if (profileError) console.log("Profiles 'stress_level' check failed:", profileError.message);
    else console.log("Profiles 'stress_level' exists.");

    console.log("Checking columns for 'users'...");
    const { error: usersError } = await supabase.from('users').select('stress_level').limit(1);
    if (usersError) console.log("Users 'stress_level' check failed:", usersError.message);
    else console.log("Users 'stress_level' exists.");
}

main();
