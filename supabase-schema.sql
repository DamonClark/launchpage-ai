-- LaunchPage AI Database Schema
-- Run this in your Supabase SQL Editor

-- Create pages table
CREATE TABLE pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  json JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create leads table
-- Note: page_slug references pages(slug) but allows orphan leads (e.g., from homepage)
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug TEXT NOT NULL,
  name TEXT,
  email TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key as a non-enforced reference (for data integrity guidance only)
-- This allows 'landing-page' and other virtual slugs without requiring a pages record
COMMENT ON COLUMN leads.page_slug IS 'References pages(slug) but not enforced to allow homepage leads';

-- Create indexes for better performance
CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_leads_page_slug ON leads(page_slug);
CREATE INDEX idx_leads_email ON leads(email);

-- Enable Row Level Security (RLS) for better security
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow public read access to pages
CREATE POLICY "Allow public read access to pages" ON pages
  FOR SELECT USING (true);

-- Allow public insert access to leads
CREATE POLICY "Allow public insert access to leads" ON leads
  FOR INSERT WITH CHECK (true);

-- Allow service role full access
CREATE POLICY "Allow service role full access to pages" ON pages
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role full access to leads" ON leads
  FOR ALL USING (auth.role() = 'service_role');
