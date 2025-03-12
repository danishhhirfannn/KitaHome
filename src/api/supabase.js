import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gpbtkggpbuarrvkpiqzq.supabase.co"; 
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwYnRrZ2dwYnVhcnJ2a3BpcXpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3NjcwMTIsImV4cCI6MjA1NzM0MzAxMn0.JWNqEugmEwJdNNokyD8v9jpz_WisUiVA7Yl1DJZcB-M";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);