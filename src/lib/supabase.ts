import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  is_active: boolean;
  is_admin: boolean;
  has_access: boolean;
  avatar_url: string | null;
  business_type: string | null;
  company_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface ToolVideo {
  id: string;
  tool_id: string;
  youtube_video_id: string;
  title: string;
  description: string;
  updated_at: string;
  updated_by: string | null;
}

export interface UserToolCredential {
  id: string;
  user_id: string;
  tool_id: string;
  external_login: string;
  external_password: string;
  platform_url: string;
  notes: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
}
