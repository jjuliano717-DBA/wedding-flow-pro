import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase'; // We will generate this or use 'any' for now if types aren't ready

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables. Please check your .env file.');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');


// Helper to check connection
export const checkSupabaseConnection = async () => {
    try {
        const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
        if (error) throw error;
        console.log('Supabase Connected Successfully');
        return true;
    } catch (e) {
        console.error('Supabase Connection Failed:', e);
        return false;
    }
};
