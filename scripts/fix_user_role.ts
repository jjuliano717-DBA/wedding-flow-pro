
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Manually load .env because local ts-node might behave differently
const envConfig = dotenv.parse(fs.readFileSync('.env'));
for (const k in envConfig) {
    process.env[k] = envConfig[k];
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("Supabase URL:", supabaseUrl);
console.log("Service Key available:", !!supabaseServiceKey);

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing credentials (SUPABASE_SERVICE_ROLE_KEY needed)");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
    const email = 'jasonjuliano@live.com';
    console.log(`Checking user: ${email}`);

    // Check profiles table
    const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email);

    if (profileError) {
        console.error("Error fetching profile:", profileError);
    } else {
        console.log("Profile found:", profiles);
    }

    if (profiles && profiles.length > 0) {
        const user = profiles[0];
        if (user.role !== 'couple') {
            console.log(`Current role is '${user.role}'. Updating to 'couple'...`);
            const { data: updateData, error: updateError } = await supabase
                .from('profiles')
                .update({ role: 'couple' })
                .eq('id', user.id)
                .select();

            if (updateError) {
                console.error("Update failed:", updateError);
            } else {
                console.log("Update success:", updateData);
            }
        } else {
            console.log("User is already a couple.");
        }
    } else {
        console.log("No profile found for that email.");
        // Check ALL profiles just in case of mismatch
        // const { data: all } = await supabase.from('profiles').select('email, role').limit(5);
        // console.log("Sample profiles:", all);
    }
}

main();
