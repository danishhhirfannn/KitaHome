import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qpizokcmzjnckchupzop.supabase.co"; 
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwaXpva2NtempuY2tjaHVwem9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxNTQ5MzksImV4cCI6MjA0ODczMDkzOX0.J_FhtdMUBDIna2ecRsja2vxjoaevr6Aqzn76pQrJYH8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);