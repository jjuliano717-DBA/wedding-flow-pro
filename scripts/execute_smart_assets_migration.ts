// scripts/execute_smart_assets_migration.ts
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Supabase URL or Service Role Key not set.');
    console.error('Please set environment variables:');
    console.error('  export NEXT_PUBLIC_SUPABASE_URL="https://wytscoyfbsklptqdqkir.supabase.co"');
    console.error('  export SUPABASE_SERVICE_ROLE_KEY="eyJhbG..."');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeMigration() {
    console.log('🚀 Starting Smart Assets Migration...');
    console.log('=================================================');

    // Read the migration file
    const migrationPath = path.join(__dirname, '../supabase/migrations/20251226_smart_assets_validation_and_data.sql');

    if (!fs.existsSync(migrationPath)) {
        console.error(`❌ Migration file not found: ${migrationPath}`);
        process.exit(1);
    }

    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    console.log(`📄 Read migration file: ${migrationPath}`);
    console.log(`📏 SQL size: ${migrationSQL.length} bytes`);
    console.log('');

    try {
        console.log('⚙️  Executing migration SQL...');

        // Execute the migration
        const { data, error } = await supabase.rpc('exec_sql', { sql_string: migrationSQL });

        if (error) {
            console.error('❌ Migration failed:', error.message);
            console.error('Full error:', error);
            process.exit(1);
        }

        console.log('✅ Migration executed successfully!');
        console.log('');
        console.log('📊 Verifying data insertion...');

        // Verify tables have data
        const tables = [
            'inspiration_assets',
            'vendor_availability',
            'user_swipes',
            'budget_slots',
            'budget_candidates'
        ];

        for (const table of tables) {
            const { count, error: countError } = await supabase
                .from(table)
                .select('*', { count: 'exact', head: true });

            if (countError) {
                console.log(`⚠️  Could not count ${table}: ${countError.message}`);
            } else {
                console.log(`  ✓ ${table}: ${count} records`);
            }
        }

        console.log('');
        console.log('=================================================');
        console.log('✅ Migration Complete!');
        console.log('=================================================');
        console.log('');
        console.log('Next Steps:');
        console.log('1. Open Supabase Dashboard → Table Editor');
        console.log('2. Browse inspiration_assets, vendor_availability tables');
        console.log('3. Test vendor_asset_analytics view for metrics');
        console.log('4. Verify RLS by logging in as different roles');

    } catch (err) {
        console.error('❌ Unexpected error:', err);
        process.exit(1);
    }
}

executeMigration()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error('Fatal error:', err);
        process.exit(1);
    });
