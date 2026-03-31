import { createClient } from '@supabase/supabase-js';

const url = 'https://mfrgvkrhrzxmuuadprrx.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mcmd2a3Jocnp4bXV1YWRwcnJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1ODMzMDcsImV4cCI6MjA5MDE1OTMwN30.RFog6BanjMbvqCMsT4nFgve3a7JKVnC24jwFHg4XDJw';

console.log('Supabase init - URL:', url);
console.log('Supabase init - Key:', key ? 'presente' : 'falta');

export const supabase = createClient(url, key);