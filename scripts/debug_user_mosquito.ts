
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
    const email = 'info@mosquitofl.com';
    console.log(`Checking data for: ${email}`);

    // 1. Check Profiles
    console.log("\n--- PROFILES ---");
    const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email);

    if (profileError) console.error("Error fetching profile:", profileError);
    else console.log(profiles);

    // 2. Check Vendors
    console.log("\n--- VENDORS (by email? usually linked by profile_id) ---");
    // We don't know the ID yet, so we'll check by name if profile isn't found, or by profile_id if it is.
    if (profiles && profiles.length > 0) {
        const userId = profiles[0].id;
        // Assuming vendors table might have a user_id or profile_id column? 
        // Or maybe we check by business_name if available?
        // Let's check listing all vendors to see structure if we can't guess.
        // Actually, earlier file 'fix_mosquito_linkage.sql' suggested vendors table has 'contact_email' or similar?
        // Or maybe just based on the user ID linkage.

        // Let's try to find potential vendor records
        const { data: vendors, error: vendorError } = await supabase
            .from('vendors')
            .select('*')
            .eq('id', userId) // often vendor_id = user_id in 1:1 setup, but maybe not
            .maybeSingle(); // or just list some 

        if (vendors) {
            console.log("Vendor by ID:", vendors);
        } else {
            console.log("No vendor found with exact ID match, searching by text...");
            const { data: vendors2 } = await supabase.from('vendors').select('*').ilike('business_name', '%mosq%');
            console.log("Vendors matching 'mosq':", vendors2);
        }
    }

    // 3. Check Auth Users (Metadata)
    console.log("\n--- AUTH USER METADATA ---");
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
        console.error("Auth Admin Error:", authError);
    } else {
        const user = users.find(u => u.email === email);
        if (user) {
            console.log("User Found:", {
                id: user.id,
                email: user.email,
                confirmed_at: user.confirmed_at,
                last_sign_in: user.last_sign_in_at,
                metadata: user.user_metadata
            });
        } else {
            console.log("User NOT found in Auth.");
        }
    }
}

main();
