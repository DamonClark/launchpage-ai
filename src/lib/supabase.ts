import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Client-side Supabase client (uses anon key)
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Server-side Supabase client (uses service role key for admin operations)
export const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

export interface PageRecord {
  id: string;
  slug: string;
  title: string;
  json: any;
  created_at: string;
}

export interface LeadRecord {
  id: string;
  page_slug: string;
  name?: string;
  email: string;
  metadata?: any;
  created_at: string;
}

export async function createPage(slug: string, title: string, json: any): Promise<PageRecord> {
  if (!supabaseAdmin) {
    throw new Error('Supabase is not configured. Please set SUPABASE environment variables.');
  }

  const { data, error } = await supabaseAdmin
    .from('pages')
    .insert({
      slug,
      title,
      json,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create page: ${error.message}`);
  }

  return data;
}

export async function getPageBySlug(slug: string): Promise<PageRecord | null> {
  if (!supabaseAdmin) {
    throw new Error('Supabase is not configured. Please set SUPABASE environment variables.');
  }

  const { data, error } = await supabaseAdmin
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    throw new Error(`Failed to fetch page: ${error.message}`);
  }

  return data;
}

export async function createLead(pageSlug: string, email: string, name?: string, metadata?: any): Promise<LeadRecord> {
  if (!supabaseAdmin) {
    throw new Error('Supabase is not configured. Please set SUPABASE environment variables.');
  }

  const { data, error } = await supabaseAdmin
    .from('leads')
    .insert({
      page_slug: pageSlug,
      email,
      name,
      metadata,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create lead: ${error.message}`);
  }

  return data;
}

export async function getLeadsByPageSlug(pageSlug: string): Promise<LeadRecord[]> {
  if (!supabaseAdmin) {
    throw new Error('Supabase is not configured. Please set SUPABASE environment variables.');
  }

  const { data, error } = await supabaseAdmin
    .from('leads')
    .select('*')
    .eq('page_slug', pageSlug)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch leads: ${error.message}`);
  }

  return data || [];
}
