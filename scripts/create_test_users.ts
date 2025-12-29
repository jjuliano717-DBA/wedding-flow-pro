// scripts/create_test_users.ts
import { createClient } from '@supabase/supabase-js';

// Load Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Supabase URL or Service Role Key not set.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Define the test users we want to create
const testUsers = [
    { email: 'vendor_user@example.com', role: 'vendor', fullName: 'Vendor User' },
    { email: 'venue_user@example.com', role: 'venue', fullName: 'Venue User' },
];

async function createTestUsers() {
    for (const { email, role, fullName } of testUsers) {
        const { data, error } = await supabase.auth.admin.createUser({
            email,
            password: 'password1',
            email_confirm: true,
            user_metadata: { role, full_name: fullName },
        });

        if (error) {
            console.error(`❌ Failed to create ${role} user (${email}):`, error.message);
        } else {
            console.log(`✅ Created ${role} user (${email}) – ID: ${data?.user?.id}`);
        }
    }
}

createTestUsers()
    .then(() => console.log('🚀 All test users processed'))
    .catch((e) => console.error('⚠️ Unexpected error', e))
    .finally(() => process.exit());
