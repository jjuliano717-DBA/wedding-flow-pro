
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wytscoyfbsklptqdqkir.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5dHNjb3lmYnNrbHB0cWRxa2lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNjgyNjgsImV4cCI6MjA4MTc0NDI2OH0.z8MB-E94Wq3Q5qHb8rE2qSL5QdLyWG9I_JGR1H7qY3s';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function inspectWeddings() {
    const { data, error } = await supabase.from('real_weddings').select('*').limit(1);

    if (error) {
        console.error("Error:", error);
    } else {
        if (data.length > 0) {
            console.log("Columns:", Object.keys(data[0]));
        } else {
            console.log("Table is empty, cannot infer columns from data. Assuming basic columns only.");
        }
    }
}

inspectWeddings();
