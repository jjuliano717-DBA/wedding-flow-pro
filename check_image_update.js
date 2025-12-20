
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wytscoyfbsklptqdqkir.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5dHNjb3lmYnNrbHB0cWRxa2lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNjgyNjgsImV4cCI6MjA4MTc0NDI2OH0.z8MB-E94Wq3Q5qHb8rE2qSL5QdLyWG9I_JGR1H7qY3s';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkImageColumn() {
    // 1. Get first vendor
    const { data: vendors } = await supabase.from('vendors').select('id, name').limit(1);
    if (!vendors || vendors.length === 0) {
        console.log("No vendors found.");
        return;
    }
    const vendor = vendors[0];
    console.log(`Checking vendor: ${vendor.name} (${vendor.id})`);

    // 2. Try to update image_url
    const { data, error } = await supabase
        .from('vendors')
        .update({ image_url: 'https://test.com/image.jpg' })
        .eq('id', vendor.id)
        .select();

    if (error) {
        console.error("Error updating image_url:", error);
    } else {
        console.log("Success! Updated vendor:", data[0]);
    }
}

checkImageColumn();
