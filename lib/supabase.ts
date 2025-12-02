
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ajqevpsayhwlssspnvkl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqcWV2cHNheWh3bHNzc3BudmtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNDgwMTIsImV4cCI6MjA3OTcyNDAxMn0.A_GqlA6QNtbepOb6ib6vgn-TE8GVD4reizO8sKGGzB4';

export const supabase = createClient(supabaseUrl, supabaseKey);
