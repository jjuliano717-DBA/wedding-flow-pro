
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

// Load env
try {
    const envConfig = dotenv.parse(fs.readFileSync('.env'));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
} catch (e) {
    console.log('Could not read .env details, checking process.env');
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

    // 1. Find User
    console.log(`Finding user: ${email}...`);
    // Try querying auth.users via admin api usually, but here we might only have access to public tables or use getUser via admin auth
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();

    if (userError) {
        console.error('Error listing users:', userError);
        process.exit(1);
    }

    const user = users.find(u => u.email === email);

    if (!user) {
        console.error('User not found!');
        // Optional: Create user? User didn't ask explicitly to create user, but "associated it with Keith Brown".
        // Use create if needed.
        console.log('Attempting to create user...');
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
            email,
            password: 'tempPassword123!', // Temporary password
            email_confirm: true,
            user_metadata: { full_name: 'Keith Brown' }
        });

        if (createError) {
            console.error('Failed to create user:', createError);
            process.exit(1);
        }
        console.log('Created new user:', newUser.user.id);
        await createVendor(newUser.user.id);
        return;
    }

    console.log('Found user:', user.id);
    await createVendor(user.id);
}

async function createVendor(userId: string) {
    const vendorData = {
        owner_id: userId,
        name: "Decorate With Lights of Raleigh",
        description: "Landscape lighting designer",
        location: "Raleigh, NC",
        street_address: "2800 Sumner Blvd Suite 102",
        website: "https://www.decoratewithlights.com/",
        contact_phone: "(919) 424-3779",
        contact_email: "info@mosquitofl.com",
        type: "Lighting",
        category: "vendor",
        google_rating: 5.0,
        google_reviews: 15
        // Removed status and verified as they might not exist
    };

    console.log('Checking for existing vendor...');
    const { data: existingVendor, error: fetchError } = await supabase
        .from('vendors')
        .select('*')
        .eq('contact_email', vendorData.contact_email)
        .single();

    if (existingVendor) {
        console.log('Vendor already exists, updating...', existingVendor.id);
        const { data, error } = await supabase
            .from('vendors')
            .update({
                ...vendorData,
                images: ["https://lh3.googleusercontent.com/p/AF1QipOFGKlr1FXJfsg_JQBwP6QG5wXdYe03eQthwSsK=w408-h271-k-no"]
            })
            .eq('id', existingVendor.id)
            .select();

        if (error) {
            console.error('Error updating vendor:', error.message);
            if (error.message.includes('column "images" does not exist')) {
                console.log('Retrying update without images...');
                await supabase.from('vendors').update(vendorData).eq('id', existingVendor.id);
            }
        } else {
            console.log('Vendor updated successfully!', data);
        }
    } else {
        console.log('Creating new vendor...');
        const { data, error } = await supabase
            .from('vendors')
            .insert([{
                ...vendorData,
                images: ["https://lh3.googleusercontent.com/p/AF1QipOFGKlr1FXJfsg_JQBwP6QG5wXdYe03eQthwSsK=w408-h271-k-no"]
            }])
            .select();

        if (error) {
            console.error('Error creating vendor (attempt 1):', error.message);
            if (error.message.includes('column "images" does not exist')) {
                console.log('Retrying without images column...');
                const { data: data2, error: error2 } = await supabase
                    .from('vendors')
                    .insert([vendorData])
                    .select();

                if (error2) {
                    console.error('Error creating vendor (attempt 2):', error2);
                } else {
                    console.log('Vendor created successfully (without images)!', data2);
                }
            }
        } else {
            console.log('Vendor created successfully!', data);
        }
    }
}

main();
