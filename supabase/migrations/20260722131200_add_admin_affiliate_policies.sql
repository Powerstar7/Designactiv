/*
# Add admin RLS policies for affiliate management

1. Security Changes
  - Add SELECT policy on `affiliates` for admin users (role = 'admin' in user_profiles)
  - Add UPDATE policy on `affiliates` for admin users
  - Add SELECT policy on `affiliate_sales` for admin users
  - Add INSERT policy on `affiliate_sales` for admin users (manual sale registration)
  - Add UPDATE policy on `affiliate_sales` for admin users
  - Add SELECT policy on `affiliate_payouts` for admin users
  - Add INSERT policy on `affiliate_payouts` for admin users
  - Add UPDATE policy on `affiliate_payouts` for admin users

2. Notes
  - Admin is determined by checking user_profiles.role = 'admin'
  - These policies allow admins to manage the entire affiliate system
  - Regular affiliates still only see their own data via existing policies
*/

-- Admin can view all affiliates
DROP POLICY IF EXISTS "admin_select_all_affiliates" ON affiliates;
CREATE POLICY "admin_select_all_affiliates" ON affiliates FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Admin can update any affiliate
DROP POLICY IF EXISTS "admin_update_all_affiliates" ON affiliates;
CREATE POLICY "admin_update_all_affiliates" ON affiliates FOR UPDATE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Admin can view all affiliate sales
DROP POLICY IF EXISTS "admin_select_all_sales" ON affiliate_sales;
CREATE POLICY "admin_select_all_sales" ON affiliate_sales FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Admin can insert sales (manual registration)
DROP POLICY IF EXISTS "admin_insert_sales" ON affiliate_sales;
CREATE POLICY "admin_insert_sales" ON affiliate_sales FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Admin can update any sale
DROP POLICY IF EXISTS "admin_update_all_sales" ON affiliate_sales;
CREATE POLICY "admin_update_all_sales" ON affiliate_sales FOR UPDATE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Admin can view all payouts
DROP POLICY IF EXISTS "admin_select_all_payouts" ON affiliate_payouts;
CREATE POLICY "admin_select_all_payouts" ON affiliate_payouts FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Admin can insert payouts
DROP POLICY IF EXISTS "admin_insert_payouts" ON affiliate_payouts;
CREATE POLICY "admin_insert_payouts" ON affiliate_payouts FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Admin can update payouts (mark as paid)
DROP POLICY IF EXISTS "admin_update_all_payouts" ON affiliate_payouts;
CREATE POLICY "admin_update_all_payouts" ON affiliate_payouts FOR UPDATE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );
