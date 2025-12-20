
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wytscoyfbsklptqdqkir.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5dHNjb3lmYnNrbHB0cWRxa2lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNjgyNjgsImV4cCI6MjA4MTc0NDI2OH0.z8MB-E94Wq3Q5qHb8rE2qSL5QdLyWG9I_JGR1H7qY3s';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function check() {
    const tables = ['vendors', 'venues', 'real_weddings', 'planning_tips'];

    for (const table of tables) {
        console.log(`Checking '${table}' table...`);
        const { error } = await supabase.from(table).select('*', { count: 'exact', head: true });
        if (error) {
            console.error(`Error accessing ${table}:`, error.message);
        } else {
            console.log(`${table} exists.`);
        }
    }
}

check();
