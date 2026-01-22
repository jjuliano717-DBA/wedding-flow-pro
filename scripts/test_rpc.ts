
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testExecSql() {
    console.log('🧪 Testing generic SQL execution RPC...');

    // Attempt to call a hypothetical exec_sql function
    const { data, error } = await supabase.rpc('exec_sql', {
        sql_query: 'SELECT 1 as test'
    });

    if (error) {
        console.error('❌ exec_sql failed (likely does not exist):', error.message);
    } else {
        console.log('✅ exec_sql works!', data);
    }
}

testExecSql();
