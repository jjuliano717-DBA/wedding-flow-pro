import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyVenues() {
    console.log('🔍 Verifying unclaimed venue ingestion...\n');

    // Get unclaimed venues
    const { data, error, count } = await supabase
        .from('vendors')
        .select('*', { count: 'exact' })
        .eq('is_claimed', false)
        .eq('category', 'venue');

    if (error) {
        console.error('❌ Error querying vendors:', error.message);
        return;
    }

    console.log(`✅ Found ${count} unclaimed venues in database\n`);

    if (data && data.length > 0) {
        console.log('📋 Unclaimed Venues:');
        data.forEach((venue, index) => {
            console.log(`${index + 1}. ${venue.name}`);
            console.log(`   📍 Location: ${venue.location}`);
            console.log(`   ⭐ Google Rating: ${venue.google_rating || 'N/A'}`);
            console.log(`   👥 Capacity: ${venue.capacity_min}-${venue.capacity_max} guests`);
            console.log(`   🔑 Claim Token: ${venue.claim_token?.substring(0, 8)}...`);
            console.log('');
        });
    }
}

verifyVenues()
    .then(() => {
        console.log('✨ Verification complete!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Fatal error:', error);
        process.exit(1);
    });
