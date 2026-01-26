import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';

// Load env
try {
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        const envConfig = dotenv.parse(fs.readFileSync(envPath));
        for (const k in envConfig) {
            process.env[k] = envConfig[k];
        }
    }
} catch (e) {
    console.log('Could not read .env details, checking process.env');
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Supabase credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log('🧪 Testing Geospatial Search Function\n');
    console.log('==========================================\n');

    // Test 1: Miami Beach 10-mile radius
    console.log('Test 1: Miami Beach (33139) - 10 mile radius');
    console.log('Coordinates: 25.7907, -80.1300');

    const { data: test1, error: error1 } = await supabase
        .rpc('search_vendors_geo', {
            p_origin_lat: 25.7907,
            p_origin_long: -80.1300,
            p_radius_miles: 10
        });

    if (error1) {
        console.error('❌ Test 1 failed:', error1.message);
    } else {
        console.log(`✅ Found ${test1.length} vendors`);
        const vizcaya = test1.find((v: any) => v.name.toLowerCase().includes('vizcaya'));
        if (vizcaya) {
            console.log(`   ✓ Vizcaya found at ${vizcaya.distance_miles.toFixed(1)} miles`);
        } else {
            console.log('   ⚠️  Vizcaya not found in results');
        }
        console.log('   Top 3 results:');
        test1.slice(0, 3).forEach((v: any) => {
            console.log(`     - ${v.name}: ${v.distance_miles.toFixed(1)} mi`);
        });
    }

    console.log('\n==========================================\n');

    // Test 2: Miami Beach 100-mile radius
    console.log('Test 2: Miami Beach (33139) - 100 mile radius');

    const { data: test2, error: error2 } = await supabase
        .rpc('search_vendors_geo', {
            p_origin_lat: 25.7907,
            p_origin_long: -80.1300,
            p_radius_miles: 100
        });

    if (error2) {
        console.error('❌ Test 2 failed:', error2.message);
    } else {
        console.log(`✅ Found ${test2.length} vendors`);
        const breakers = test2.find((v: any) => v.name.toLowerCase().includes('breakers'));
        if (breakers) {
            console.log(`   ✓ The Breakers found at ${breakers.distance_miles.toFixed(1)} miles`);
        } else {
            console.log('   ⚠️  The Breakers not found in results');
        }
    }

    console.log('\n==========================================\n');

    // Test 3: Capacity filter >500
    console.log('Test 3: Miami Beach (33139) - 100 miles, Capacity >500');

    const { data: test3, error: error3 } = await supabase
        .rpc('search_vendors_geo', {
            p_origin_lat: 25.7907,
            p_origin_long: -80.1300,
            p_radius_miles: 100,
            p_filter_capacity_min: 500
        });

    if (error3) {
        console.error('❌ Test 3 failed:', error3.message);
    } else {
        console.log(`✅ Found ${test3.length} large venues`);
        if (test3.length > 0) {
            console.log('   Large capacity venues:');
            test3.slice(0, 5).forEach((v: any) => {
                console.log(`     - ${v.name}: ${v.capacity_num || 'N/A'} capacity, ${v.distance_miles.toFixed(1)} mi`);
            });
        }
    }

    console.log('\n==========================================\n');
    console.log('✅ All tests completed!\n');
}

main().catch(e => {
    console.error('💥 Unexpected error:', e);
    process.exit(1);
});
