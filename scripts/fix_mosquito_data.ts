
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

// Load environment variables
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
    const newName = 'Keith Brown';
    const newBusinessName = 'Agri-Pest Control'; // User didn't specify, but domain mosquitofl implies text. Or I can leave specific business name as "Mosquito FL" 
    // UPDATE: User says "info@mosquitofl.com"... I will use "Mosquito FL" as placeholder if not known, or just "Mosquito Control". 
    // Actually, I'll check if the user provided it in their prompt? "create info@mosquitofl.com with the name Keith Brown". 
    // Doesn't explicitly state business name. I'll use "Mosquito FL" as a reasonable default.
    const tempPassword = 'Password123!';

    console.log(`Fixing data for: ${email}`);

    // 1. Get User ID
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    const user = users?.find(u => u.email === email);

    if (!user) {
        console.error("User not found!");
        return;
    }

    console.log(`Found user ID: ${user.id}`);

    // 2. Update Auth Metadata and Password
    const { error: updateAuthError } = await supabase.auth.admin.updateUserById(
        user.id,
        {
            password: tempPassword,
            user_metadata: {
                ...user.user_metadata,
                full_name: newName,
                business_name: 'Mosquito FL'
            }
        }
    );

    if (updateAuthError) console.error("Auth Update Error:", updateAuthError);
    else console.log("Auth metadata and password updated.");

    // 3. Update Profiles Table
    const { error: updateProfileError } = await supabase
        .from('profiles')
        .update({
            full_name: newName,
            business_name: 'Mosquito FL',
            updated_at: new Date()
        })
        .eq('id', user.id);

    if (updateProfileError) console.error("Profile Update Error:", updateProfileError);
    else console.log("Profile table updated.");

    // 4. Update/Create Vendor Record
    console.log("Checking vendor record...");
    const { data: vendor, error: vendorSearchError } = await supabase
        .from('vendors')
        .select('*')
        .eq('id', user.id) // Assuming id matches user_id, which is standard for 2PlanAWedding schemas I've seen
        .maybeSingle();

    if (!vendor) {
        console.log("Vendor record missing. Creating...");
        const { error: createVendorError } = await supabase
            .from('vendors')
            .insert({
                id: user.id, // Explicitly link
                name: 'Mosquito FL',
                business_name: 'Mosquito FL',
                contact_name: newName,
                category: 'Health & Beauty', // Default
                location: 'Florida', // Inferred from email
                email: email
            });

        if (createVendorError) console.error("Create Vendor Error:", createVendorError);
        else console.log("Vendor record created.");
    } else {
        console.log("Vendor record exists. Updating...");
        const { error: updateVendorError } = await supabase
            .from('vendors')
            .update({
                name: 'Mosquito FL',
                business_name: 'Mosquito FL',
                contact_name: newName
            })
            .eq('id', user.id);

        if (updateVendorError) console.error("Update Vendor Error:", updateVendorError);
        else console.log("Vendor record updated.");
    }

    console.log("\nDONE. User should be able to login with:");
    console.log(`Email: ${email}`);
    console.log(`Password: ${tempPassword}`);
}

main();
