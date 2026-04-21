/*
  # User Tool Credentials

  1. New Table
    - `user_tool_credentials`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles.id) - the end user
      - `tool_id` (text) - matches tool.id from frontend
      - `external_login` (text) - login for the external tool platform
      - `external_password` (text) - password for the external tool platform
      - `platform_url` (text) - URL where the user logs into the external tool
      - `notes` (text) - extra instructions for the user
      - `is_active` (boolean, default true) - whether access is granted
      - `created_at`, `updated_at` (timestamptz)
      - `updated_by` (uuid) - admin who made the last change
      - UNIQUE(user_id, tool_id)

  2. Security
    - Enable RLS
    - Users can read their own credentials only
    - Admins can read/write all credentials
*/

CREATE TABLE IF NOT EXISTS user_tool_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tool_id text NOT NULL,
  external_login text DEFAULT '',
  external_password text DEFAULT '',
  platform_url text DEFAULT '',
  notes text DEFAULT '',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  UNIQUE (user_id, tool_id)
);

CREATE INDEX IF NOT EXISTS idx_user_tool_credentials_user ON user_tool_credentials(user_id);

ALTER TABLE user_tool_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own tool credentials"
  ON user_tool_credentials FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all tool credentials"
  ON user_tool_credentials FOR SELECT
  TO authenticated
  USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can insert tool credentials"
  ON user_tool_credentials FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT is_admin FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can update tool credentials"
  ON user_tool_credentials FOR UPDATE
  TO authenticated
  USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()))
  WITH CHECK ((SELECT is_admin FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can delete tool credentials"
  ON user_tool_credentials FOR DELETE
  TO authenticated
  USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()));
