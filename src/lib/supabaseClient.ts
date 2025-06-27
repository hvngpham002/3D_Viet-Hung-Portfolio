import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

const getSupabase = () => {
    if (supabaseInstance) {
        return supabaseInstance;
    }

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        throw new Error("Supabase URL and Key must be defined in environment variables.");
    }

    supabaseInstance = createClient(supabaseUrl, supabaseKey);
    return supabaseInstance;
};

export default getSupabase;
