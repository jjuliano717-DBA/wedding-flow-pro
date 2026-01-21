
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function inspectSchema() {
    console.log('Inspecting vendors table...');

    // We can't query information_schema easily via JS client usually, but we can try selecting one row
    const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error selecting from vendors:', error);
        return;
    }

    if (data && data.length > 0) {
        console.log('Columns found based on first row keys:', Object.keys(data[0]));
    } else {
        // If no data, try inserting a dummy to get an error with column info, or just trust previous knowledge?
        // Let's assume standard columns plus what I saw in BusinessDashboard. 
        // But I specifically want to know if 'images' or 'gallery_images' exists.
        console.log('No data found in vendors table. Checking recent migrations might be better.');
    }
}

inspectSchema();
