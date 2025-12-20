
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wytscoyfbsklptqdqkir.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5dHNjb3lmYnNrbHB0cWRxa2lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNjgyNjgsImV4cCI6MjA4MTc0NDI2OH0.z8MB-E94Wq3Q5qHb8rE2qSL5QdLyWG9I_JGR1H7qY3s';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkColumn() {
    // Attempt to select ONLY the image_url column. 
    // If it doesn't exist, PostgREST will return an error 400 'Could not find the ... column'.
    const { data, error } = await supabase.from('vendors').select('image_url').limit(1);

    if (error) {
        console.error("Column check failed:", error);
    } else {
        console.log("Column exists. Data:", data);
    }
}

checkColumn();
