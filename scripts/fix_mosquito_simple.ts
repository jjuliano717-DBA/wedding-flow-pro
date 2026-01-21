
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
    const email = 'info@mosquitofl.com';
    const newName = 'Keith Brown';
    const tempPassword = 'Password123!';

    console.log(`Fixing data for: ${email} (Simplified)`);

    // 1. Get User ID
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    const user = users?.find(u => u.email === email);

    if (!user) {
        console.error("User not found!");
        return;
    }

    // 2. Update Auth Metadata
    const { error: updateAuthError } = await supabase.auth.admin.updateUserById(
        user.id,
        {
            password: tempPassword,
            user_metadata: {
                ...user.user_metadata,
                full_name: newName,
                // business_name: 'Mosquito FL' // Omitting as it might cause confusion if schema missing
            }
        }
    );
    if (!updateAuthError) console.log("Auth metadata/password updated.");

    // 3. Update Profiles Table (Known columns only)
    const { error: updateProfileError } = await supabase
        .from('profiles')
        .update({
            full_name: newName,
            updated_at: new Date()
        })
        .eq('id', user.id);

    if (updateProfileError) console.error("Profile Update Error:", updateProfileError);
    else console.log("Profile 'full_name' updated.");

    // We skip vendors table for now as it seems to be missing columns or checks
}

main();
