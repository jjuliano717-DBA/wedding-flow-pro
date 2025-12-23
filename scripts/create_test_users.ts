// scripts/create_test_users.ts
import { supabase } from "../src/lib/supabase";

const testUsers = [
    { email: "vendor@demo.com", role: "vendor" },
    { email: "admin@test.com", role: "admin" },
    { email: "venue@demo.com", role: "venue" },
];

async function createTestUsers() {
    for (const { email, role } of testUsers) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password: "pasword1",
        });
        if (error) {
            console.error(`Failed to sign up ${email}:`, error.message);
            continue;
        }
        const userId = data.user?.id;
        if (userId) {
            const { error: upsertError } = await supabase
                .from("users")
                .upsert({ id: userId, role });
            if (upsertError) {
                console.error(`Failed to set role for ${email}:`, upsertError.message);
            } else {
                console.log(`Created ${email} with role ${role}`);
            }
        }
    }
}

createTestUsers()
    .then(() => console.log("All test users processed"))
    .catch((e) => console.error("Unexpected error", e))
    .finally(() => process.exit());
