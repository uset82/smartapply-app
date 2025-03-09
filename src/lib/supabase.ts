import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check your .env file.');
}

export const supabase = createClient(
  supabaseUrl || '', 
  supabaseAnonKey || ''
);

// Type definitions for database tables
export type User = {
  id: string;
  email: string;
  created_at: string;
};

export type Application = {
  id: string;
  user_id: string;
  company: string;
  position: string;
  job_url: string;
  status: 'saved' | 'applied' | 'interviewing' | 'offer' | 'rejected';
  notes: string;
  created_at: string;
  updated_at: string;
};

export type CoverLetter = {
  id: string;
  user_id: string;
  application_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}; 