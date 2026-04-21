/*
  # Create profiles and tool_videos tables

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text)
      - `email` (text)
      - `is_admin` (boolean, default false) — controls admin dashboard access
      - `has_access` (boolean, default false) — set true after payment confirmed
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    - `tool_videos`
      - `id` (uuid, primary key)
      - `tool_id` (text, unique) — matches tool id from frontend data
      - `youtube_video_id` (text) — YouTube video ID
      - `title` (text)
      - `description` (text)
      - `updated_at` (timestamptz)
      - `updated_by` (uuid, references auth.users)

  2. Security
    - Enable RLS on both tables
    - profiles: users can read/update own profile; admins can read all
    - tool_videos: anyone authenticated can read; only admins can insert/update/delete

  3. Trigger
    - Auto-create profile row when user signs up via auth.users insert trigger
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text DEFAULT '',
  email text DEFAULT '',
  is_admin boolean DEFAULT false,
  has_access boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tool_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id text UNIQUE NOT NULL,
  youtube_video_id text DEFAULT '',
  title text DEFAULT '',
  description text DEFAULT '',
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    (SELECT is_admin FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Authenticated users can read tool videos"
  ON tool_videos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert tool videos"
  ON tool_videos FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT is_admin FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Admins can update tool videos"
  ON tool_videos FOR UPDATE
  TO authenticated
  USING (
    (SELECT is_admin FROM profiles WHERE id = auth.uid())
  )
  WITH CHECK (
    (SELECT is_admin FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Admins can delete tool videos"
  ON tool_videos FOR DELETE
  TO authenticated
  USING (
    (SELECT is_admin FROM profiles WHERE id = auth.uid())
  );

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.email, '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
