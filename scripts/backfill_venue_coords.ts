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
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("❌ Missing Supabase credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// City to Coordinates Lookup (Florida cities + major US cities)
const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
    // Florida cities
    'miami': { lat: 25.7617, lng: -80.1918 },
    'miami beach': { lat: 25.7907, lng: -80.1300 },
    'tampa': { lat: 27.9506, lng: -82.4572 },
    'tampa heights': { lat: 27.9641, lng: -82.4571 },
    'ybor city': { lat: 27.9614, lng: -82.4367 },
    'orlando': { lat: 28.5383, lng: -81.3792 },
    'fort lauderdale': { lat: 26.1224, lng: -80.1373 },
    'sarasota': { lat: 27.3364, lng: -82.5307 },
    'st. petersburg': { lat: 27.7676, lng: -82.6403 },
    'st petersburg': { lat: 27.7676, lng: -82.6403 },
    'palm beach': { lat: 26.7056, lng: -80.0364 },
    'palm beach gardens': { lat: 26.8467, lng: -80.1387 },
    'clearwater': { lat: 27.9659, lng: -82.8001 },
    'clearwater beach': { lat: 27.9789, lng: -82.8267 },
    'boca raton': { lat: 26.3683, lng: -80.1289 },
    'west palm beach': { lat: 26.7153, lng: -80.0534 },
    'key west': { lat: 24.5551, lng: -81.7800 },
    'coral gables': { lat: 25.7217, lng: -80.2684 },
    'delray beach': { lat: 26.4615, lng: -80.0728 },
    'winter park': { lat: 28.6000, lng: -81.3392 },
    'dunedin': { lat: 28.0197, lng: -82.7718 },
    'st. pete beach': { lat: 27.7253, lng: -82.7412 },
    'st pete beach': { lat: 27.7253, lng: -82.7412 },
    'brooksville': { lat: 28.5553, lng: -82.3876 },
    'dover': { lat: 27.9942, lng: -82.2190 },
    'safety harbor': { lat: 28.0069, lng: -82.6943 },
    'manalapan': { lat: 26.5620, lng: -80.0392 },
    'jupiter': { lat: 26.9342, lng: -80.0942 },
    'riviera beach': { lat: 26.7753, lng: -80.0581 },
    'boynton beach': { lat: 26.5253, lng: -80.0664 },
    'north palm beach': { lat: 26.8153, lng: -80.0581 },
    'thonotosassa': { lat: 28.0517, lng: -82.2976 },
    'lake wales': { lat: 27.9014, lng: -81.5859 },
    'pembroke pines': { lat: 26.0029, lng: -80.2240 },
    'altamonte springs': { lat: 28.6611, lng: -81.3656 },
    'ft. walton beach': { lat: 30.4057, lng: -86.6221 },
    'pensacola': { lat: 30.4213, lng: -87.2169 },

    // Major US cities (for out-of-state vendors)
    'new york': { lat: 40.7128, lng: -74.0060 },
    'los angeles': { lat: 34.0522, lng: -118.2437 },
    'chicago': { lat: 41.8781, lng: -87.6298 },
    'houston': { lat: 29.7604, lng: -95.3698 },
    'phoenix': { lat: 33.4484, lng: -112.0740 },
    'philadelphia': { lat: 39.9526, lng: -75.1652 },
    'san antonio': { lat: 29.4241, lng: -98.4936 },
    'san diego': { lat: 32.7157, lng: -117.1611 },
    'dallas': { lat: 32.7767, lng: -96.7970 },
    'san jose': { lat: 37.3382, lng: -121.8863 },
    'austin': { lat: 30.2672, lng: -97.7431 },
    'nashville': { lat: 36.1627, lng: -86.7816 },
    'atlanta': { lat: 33.7490, lng: -84.3880 },
    'boston': { lat: 42.3601, lng: -71.0589 },
    'seattle': { lat: 47.6062, lng: -122.3321 },
    'portland': { lat: 45.5152, lng: -122.6784 },
    'sonoma': { lat: 38.2919, lng: -122.4580 },
};

function extractCityFromLocation(location: string): string | null {
    if (!location) return null;

    const normalized = location.toLowerCase().trim();

    // Try to match city names in the location string
    for (const city of Object.keys(CITY_COORDS)) {
        if (normalized.includes(city)) {
            return city;
        }
    }

    return null;
}

async function main() {
    console.log('🌍 Starting geocoding backfill for vendors...\n');

    // Fetch all vendors without coordinates
    const { data: vendors, error } = await supabase
        .from('vendors')
        .select('id, name, location, latitude, longitude')
        .is('latitude', null);

    if (error) {
        console.error('❌ Error fetching vendors:', error);
        process.exit(1);
    }

    console.log(`Found ${vendors.length} vendors needing geocoding\n`);

    let successCount = 0;
    let failedCount = 0;
    const failed: string[] = [];

    for (const vendor of vendors) {
        const city = extractCityFromLocation(vendor.location);

        if (city && CITY_COORDS[city]) {
            const coords = CITY_COORDS[city];

            const { error: updateError } = await supabase
                .from('vendors')
                .update({
                    latitude: coords.lat,
                    longitude: coords.lng
                })
                .eq('id', vendor.id);

            if (updateError) {
                console.error(`❌ Failed to update ${vendor.name}:`, updateError.message);
                failedCount++;
                failed.push(vendor.name);
            } else {
                console.log(`✅ ${vendor.name} → ${city} (${coords.lat}, ${coords.lng})`);
                successCount++;
            }
        } else {
            console.log(`⚠️  ${vendor.name} → No match for "${vendor.location}"`);
            failedCount++;
            failed.push(vendor.name);
        }
    }

    console.log('\n==========================================');
    console.log('Geocoding Backfill Complete!');
    console.log('==========================================');
    console.log(`✅ Successfully geocoded: ${successCount}`);
    console.log(`❌ Failed/Skipped: ${failedCount}`);

    if (failed.length > 0) {
        console.log('\nVendors that could not be geocoded:');
        failed.forEach(name => console.log(`  - ${name}`));
    }
}

main().catch(e => {
    console.error('💥 Unexpected error:', e);
    process.exit(1);
});
