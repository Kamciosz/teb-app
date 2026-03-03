import { createClient } from '@supabase/supabase-js';

// Hardcoded keys to avoid environment variable issues on Vercel
const supabaseUrl = 'https://twhaxrvcyiutvantwccx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3aGF4cnZjeWl1dHZhbnR3Y2N4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNjQwMjgsImV4cCI6MjA4Nzg0MDAyOH0.aZaGHi6iqRN7rLS8FRtVquwf60K5ma7P-ySzP3JvNs4';

export const supabase = createClient(supabaseUrl, supabaseKey);
