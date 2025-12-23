import handler from '../api/v1/interactions/swipe';
import { supabaseAdmin } from '../api/_lib/supabaseAdmin';

async function runRegressionTest() {
    console.log('🚀 Starting Regression Test...');

    const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
    console.log(`🔑 Using ${hasServiceKey ? 'SERVICE_ROLE' : 'ANON'} key`);

    // 1. SETUP: Create Test Data
    const timestamp = Date.now();
    const testEmail = `test_${timestamp}@example.com`;

    try {
        // A. Find an existing user from various tables
        console.log('🔍 Checking for existing users...');
        const { data: authUsers } = await supabaseAdmin.from('auth.users' as any).select('id').limit(1);
        const { data: profiles } = await supabaseAdmin.from('profiles').select('id').limit(1);
        const { data: users } = await supabaseAdmin.from('users').select('id').limit(1);

        let userId = authUsers?.[0]?.id || profiles?.[0]?.id || users?.[0]?.id;

        if (!userId) {
            console.error('❌ FATAL: No users found. Please run dummy data or create a user first.');
            process.exit(1);
        }

        // Ensure a profile exists for this user to avoid FK issues
        const { data: existingProfile } = await supabaseAdmin.from('profiles').select('id').eq('id', userId).single();
        if (!existingProfile) {
            console.log('📝 Creating profile record for user...');
            await supabaseAdmin.from('profiles').insert({ id: userId, email: 'test@example.com', role: 'couple' });
        }

        console.log('✅ Using User ID:', userId);

        const { data: project, error: projectError } = await supabaseAdmin
            .from('projects')
            .insert({
                user_id: userId,
                name: 'Test Wedding ' + timestamp,
                guest_count: 100,
                tax_rate: 0.08
            })
            .select('id')
            .single();
        if (projectError) throw projectError;

        // B. Find or Create Vendor & Asset
        const { data: existingVendors } = await supabaseAdmin.from('vendors').select('id').limit(1);
        let vendorId = existingVendors?.[0]?.id;

        if (!vendorId) {
            const { data: vendor, error: vendorError } = await supabaseAdmin
                .from('vendors')
                .insert({
                    owner_id: userId,
                    business_name: 'Test Vendor ' + timestamp
                })
                .select('id')
                .single();
            if (vendorError) throw vendorError;
            vendorId = vendor.id;
        }

        const { data: asset, error: assetError } = await supabaseAdmin
            .from('inspiration_assets')
            .insert({
                vendor_id: vendorId,
                image_url: 'https://example.com/test.jpg',
                category_tag: 'Floral',
                cost_model: 'per_guest',
                base_cost_low: 1000, // $10.00
                base_cost_high: 1000,
                min_service_fee_pct: 0.20 // 20%
            })
            .select('id')
            .single();
        if (assetError) throw assetError;

        console.log('✅ Test Data Created');

        // 2. EXECUTE: Call Handler
        const req = {
            method: 'POST',
            body: {
                user_id: userId,
                asset_id: asset.id,
                project_id: project.id,
                swipe_direction: 'RIGHT'
            }
        };

        let responseData: any = {};
        const res = {
            status: (code: number) => ({
                json: (data: any) => {
                    responseData = data;
                    return { code, data };
                }
            })
        };

        await handler(req as any, res as any);

        console.log('✅ API Handler Executed');
        console.log('Response:', JSON.stringify(responseData, null, 2));

        // 3. ASSERT: Verification
        // Calculation: 100 guests * $10 = $1000 (100000 cents)
        // Service Fee: $1000 * 0.20 = $200 (20000 cents)
        // Tax: ($1000 + $200) * 0.08 = $96 (9600 cents)
        // Total: 1000 + 200 + 96 = $1296 (129600 cents)

        const { data: candidate, error: candidateError } = await supabaseAdmin
            .from('budget_candidates')
            .select('calculated_total_real')
            .eq('source_asset_id', asset.id)
            .single();

        if (candidateError) throw candidateError;

        const expectedTotal = 129600;
        if (candidate.calculated_total_real === expectedTotal) {
            console.log('🎉 REGRESSION TEST PASSED!');
            console.log(`Assertion: Expected $1,296, Got: $${candidate.calculated_total_real / 100}`);
        } else {
            console.error('❌ REGRESSION TEST FAILED!');
            console.error(`Expected: ${expectedTotal}, Got: ${candidate.calculated_total_real}`);
        }

    } catch (err: any) {
        console.error('💥 Test Error:', err);
    } finally {
        console.log('🧹 Cleanup: Test data remains in DB for manual inspection if needed.');
        process.exit(0);
    }
}

runRegressionTest();
