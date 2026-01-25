-- Supabase SQL Schema for Goodbye Watermark
-- Run this in your Supabase SQL Editor

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  uuid TEXT UNIQUE NOT NULL,
  daily_count INTEGER DEFAULT 0,
  last_reset_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Processed images table
CREATE TABLE IF NOT EXISTS processed_images (
  id UUID PRIMARY KEY,
  session_id TEXT NOT NULL,
  original_url TEXT NOT NULL,
  processed_url TEXT NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  share_slug TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sessions_uuid ON sessions(uuid);
CREATE INDEX IF NOT EXISTS idx_processed_images_session ON processed_images(session_id);
CREATE INDEX IF NOT EXISTS idx_processed_images_share_slug ON processed_images(share_slug);
CREATE INDEX IF NOT EXISTS idx_processed_images_public ON processed_images(is_public) WHERE is_public = TRUE;

-- Enable Row Level Security
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE processed_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sessions
CREATE POLICY "Allow anonymous session creation" ON sessions
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous session read" ON sessions
  FOR SELECT TO anon
  USING (true);

CREATE POLICY "Allow anonymous session update" ON sessions
  FOR UPDATE TO anon
  USING (true);

-- RLS Policies for processed_images
CREATE POLICY "Allow anonymous image creation" ON processed_images
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public image read" ON processed_images
  FOR SELECT TO anon
  USING (is_public = TRUE OR session_id = current_setting('request.headers')::json->>'x-session-id');

CREATE POLICY "Allow session owner to read own images" ON processed_images
  FOR SELECT TO anon
  USING (true);

CREATE POLICY "Allow session owner to update own images" ON processed_images
  FOR UPDATE TO anon
  USING (true);

-- Storage bucket (run in Supabase Dashboard > Storage)
-- Create a bucket named 'processed-images' with public access

-- Storage policies (run after creating the bucket)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('processed-images', 'processed-images', true);
