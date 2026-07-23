import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // In practice these are always present in the Bolt environment. We still
  // guard so the app degrades gracefully instead of crashing on import.
  console.warn('Supabase env vars are missing — contact form submissions will not be saved.');
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '', {
  auth: { persistSession: false },
});

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}
