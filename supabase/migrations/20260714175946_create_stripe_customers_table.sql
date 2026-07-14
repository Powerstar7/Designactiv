/*
# Create stripe_customers table

1. New Tables
  - `stripe_customers`
    - `id` (uuid, primary key)
    - `user_id` (uuid, references auth.users, unique)
    - `customer_id` (text, the Stripe customer ID)
    - `deleted_at` (timestamptz, nullable, for soft deletes)
    - `created_at` (timestamptz)

2. Security
  - Enable RLS on `stripe_customers`.
  - Authenticated users can read their own row.
  - Insert/update/delete restricted to service_role (edge functions use service role key).
*/

CREATE TABLE IF NOT EXISTS stripe_customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_id text NOT NULL,
  deleted_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_stripe_customers_user_id
  ON stripe_customers (user_id) WHERE deleted_at IS NULL;

ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_stripe_customer" ON stripe_customers;
CREATE POLICY "select_own_stripe_customer" ON stripe_customers FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "service_insert_stripe_customer" ON stripe_customers;
CREATE POLICY "service_insert_stripe_customer" ON stripe_customers FOR INSERT
  TO service_role WITH CHECK (true);

DROP POLICY IF EXISTS "service_update_stripe_customer" ON stripe_customers;
CREATE POLICY "service_update_stripe_customer" ON stripe_customers FOR UPDATE
  TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "service_delete_stripe_customer" ON stripe_customers;
CREATE POLICY "service_delete_stripe_customer" ON stripe_customers FOR DELETE
  TO service_role USING (true);
