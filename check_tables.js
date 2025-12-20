
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wytscoyfbsklptqdqkir.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5dHNjb3lmYnNrbHB0cWRxa2lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNjgyNjgsImV4cCI6MjA4MTc0NDI2OH0.z8MB-E94Wq3Q5qHb8rE2qSL5QdLyWG9I_JGR1H7qY3s';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function check() {
    console.log("Checking 'threads' table...");
    const { count, error } = await supabase.from('threads').select('*', { count: 'exact', head: true });

    if (error) {
        console.error("Error accessing threads:", error);
    } else {
        console.log("Threads table exists. Row count:", count);
    }

    console.log("Checking 'replies' table...");
    const { count: count2, error: e2 } = await supabase.from('replies').select('*', { count: 'exact', head: true });

    if (e2) {
        console.error("Error accessing replies:", e2);
    } else {
        console.log("Replies table exists. Row count:", count2);
    }
}

check();
