/*
  # Fix RLS performance, security, and indexing issues

  1. Changes
    - Add index on tool_videos.updated_by (foreign key without index)
    - Drop and recreate all RLS policies on profiles and tool_videos using
      (select auth.uid()) pattern for initialization plan optimization
    - Merge the two SELECT policies on profiles into one to eliminate
      multiple permissive policies for the same role/action
    - Recreate handle_new_user() with a fixed search_path to prevent
      mutable search_path vulnerability

  2. Security
    - All auth.uid() calls wrapped in (select ...) subqueries
    - Single SELECT policy on profiles covers both own-row and admin access
    - Function search_path locked to public, pg_catalog
*/

CREATE INDEX IF NOT EXISTS tool_videos_updated_by_idx ON tool_videos (updated_by);

DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can read tool videos" ON tool_videos;
DROP POLICY IF EXISTS "Admins can insert tool videos" ON tool_videos;
DROP POLICY IF EXISTS "Admins can update tool videos" ON tool_videos;
DROP POLICY IF EXISTS "Admins can delete tool videos" ON tool_videos;

CREATE POLICY "Users can read own or admin can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    (select auth.uid()) = id
    OR
    (SELECT is_admin FROM profiles WHERE id = (select auth.uid()))
  );

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Authenticated users can read tool videos"
  ON tool_videos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert tool videos"
  ON tool_videos FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT is_admin FROM profiles WHERE id = (select auth.uid()))
  );

CREATE POLICY "Admins can update tool videos"
  ON tool_videos FOR UPDATE
  TO authenticated
  USING (
    (SELECT is_admin FROM profiles WHERE id = (select auth.uid()))
  )
  WITH CHECK (
    (SELECT is_admin FROM profiles WHERE id = (select auth.uid()))
  );

CREATE POLICY "Admins can delete tool videos"
  ON tool_videos FOR DELETE
  TO authenticated
  USING (
    (SELECT is_admin FROM profiles WHERE id = (select auth.uid()))
  );

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.email, '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
