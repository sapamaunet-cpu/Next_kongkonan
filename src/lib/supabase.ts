import { createClient } from '@supabase/supabase-js';

// Pastikan variabel lingkungan (Env) sudah diisi di Vercel atau .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // Menjaga user tetap login meskipun browser ditutup
    autoRefreshToken: true,
  },
});
