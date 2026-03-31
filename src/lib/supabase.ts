import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mfrgvkrhrzxmuuadprrx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mcmd2a3Jocnp4bXV1YWRwcnJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1ODMzMDcsImV4cCI6MjA5MDE1OTMwN30.RFog6BanjMbvqCMsT4nFgve3a7JKVnC24jwFHg4XDJw';

console.log('DEBUG - Supabase URL:', supabaseUrl);
console.log('DEBUG - Supabase Anon Key:', supabaseAnonKey ? 'Present' : 'Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
