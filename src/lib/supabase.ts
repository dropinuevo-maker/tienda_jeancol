import { createClient } from '@supabase/supabase-js';

const options = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  global: {
    headers: {
      'x-client-info': 'supabase-js/2.100.0',
    },
  },
};

export const supabase = createClient(
  'https://mfrgvkrhrzxmuuadprrx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mcmd2a3Jocnp4bXV1YWRwcnJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1ODMzMDcsImV4cCI6MjA5MDE1OTMwN30.RFog6BanjMbvqCMsT4nFgve3a7JKVnC24jwFHg4XDJw',
  options
);