
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wonfkfwfbdmkpjdalpdm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvbmZrZndmYmRta3BqZGFscGRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MDAzMzQsImV4cCI6MjA3ODk3NjMzNH0.Q6HwHofWrMQ4amjaBmpwKZJkkjc0Kbyf99gV9-C-ff8';

export const supabase = createClient(supabaseUrl, supabaseKey);
