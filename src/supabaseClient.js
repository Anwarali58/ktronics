import { createClient } from '@supabase/supabase-js'

// Your actual Supabase Project URL
const supabaseUrl = 'https://vozvkukiaczqqlwrisrv.supabase.co' 

// Your actual Anon Public Key
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvenZrdWtpYWN6cXFsd3Jpc3J2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0MTIxODAsImV4cCI6MjEwMTk4ODE4MH0.vo0_--s3BtpmFR4l_vAcf942ulH7AXE72MKCC799_GI'

export const supabase = createClient(supabaseUrl, supabaseKey)