// src/utils/supabaseClient.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'postgresql://postgres.uegjdyqczrmzhwlutfyt:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlZ2pkeXFjenJtemh3bHV0Znl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNTk5NTEsImV4cCI6MjA2ODgzNTk1MX0.m1OV8JlIX8HOsio01OSIn4CMwp4dXGN5WDvuOWezbDA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
