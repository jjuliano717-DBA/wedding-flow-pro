import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import pg from 'pg';

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

async function main() {
    console.log('🚀 Installing geospatial search RPC function via direct connection...\n');

    // Read the migration SQL
    const migrationPath = path.join(process.cwd(), 'supabase/migrations/20260125000002_geo_search_function.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // Extract project ref from URL
    const match = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
    if (!match) {
        console.error("Could not parse Supabase URL");
        process.exit(1);
    }

    const projectRef = match[1];

    // Try connection via pooler
    const connectionString = `postgresql://postgres.${projectRef}:${supabaseServiceKey}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`;

    try {
        console.log('📍 Connecting to database...');
        const client = new pg.Client({
            connectionString,
            ssl: { rejectUnauthorized: false },
            connectionTimeoutMillis: 10000
        });

        await client.connect();
        console.log('✅ Connected!\n');

        console.log('Executing SQL migration...');
        await client.query(migrationSQL);
        console.log('✅ Migration executed successfully!\n');

        // Test the function
        console.log('🧪 Testing geospatial search function...\n');
        console.log('Test: Search Miami Beach (25.7907, -80.1300) with 10-mile radius');

        const testResult = await client.query(`
            SELECT id, name, distance_miles
            FROM search_vendors_geo(25.7907, -80.1300, 10)
            LIMIT 5
        `);

        console.log(`✅ Found ${testResult.rows.length} vendors within 10 miles of Miami Beach\n`);

        if (testResult.rows.length > 0) {
            console.log('Sample results:');
            testResult.rows.forEach((r: any) => {
                console.log(`  - ${r.name}: ${parseFloat(r.distance_miles).toFixed(1)} miles away`);
            });
        }

        await client.end();
        console.log('\n✅ All done! Geospatial search is ready to use.');
    } catch (error: any) {
        console.error('❌ Connection failed:', error.message);
        console.log('\nPlease run this SQL manually in Supabase Dashboard:');
        console.log('https://supabase.com/dashboard/project/wytscoyfbsklptqdqkir/sql\n');
        process.exit(1);
    }
}

main().catch(e => {
    console.error('💥 Unexpected error:', e);
    process.exit(1);
});
