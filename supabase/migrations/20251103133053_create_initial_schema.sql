/*
  # Initial Schema for AI Generation Platform

  ## Overview
  This migration creates the complete database schema for an AI-powered text-to-image/video platform
  with token-based subscriptions, payment processing, and generation history tracking.

  ## New Tables

  ### 1. `profiles`
  Extended user profile information linked to auth.users
  - `id` (uuid, primary key) - References auth.users(id)
  - `email` (text) - User's email address
  - `full_name` (text, nullable) - User's full name
  - `avatar_url` (text, nullable) - Profile picture URL
  - `subscription_tier` (text) - Current subscription level: 'free', 'basic', 'pro', 'premium'
  - `token_balance` (integer) - Current available tokens for AI generations
  - `total_tokens_purchased` (integer) - Lifetime token purchase total
  - `total_tokens_used` (integer) - Lifetime token usage total
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last profile update timestamp

  ### 2. `subscriptions`
  Tracks active subscription plans and billing cycles
  - `id` (uuid, primary key) - Unique subscription identifier
  - `user_id` (uuid) - References profiles(id)
  - `tier` (text) - Subscription tier: 'basic', 'pro', 'premium'
  - `status` (text) - Subscription status: 'active', 'canceled', 'past_due', 'expired'
  - `stripe_subscription_id` (text, nullable) - Stripe subscription ID for payment tracking
  - `stripe_customer_id` (text, nullable) - Stripe customer ID
  - `current_period_start` (timestamptz) - Billing period start date
  - `current_period_end` (timestamptz) - Billing period end date
  - `cancel_at_period_end` (boolean) - Whether subscription cancels at period end
  - `tokens_per_month` (integer) - Monthly token allocation for this tier
  - `price_monthly` (decimal) - Monthly price in dollars
  - `created_at` (timestamptz) - Subscription creation date
  - `updated_at` (timestamptz) - Last subscription update

  ### 3. `token_transactions`
  Logs all token balance changes (purchases, usage, refills)
  - `id` (uuid, primary key) - Unique transaction identifier
  - `user_id` (uuid) - References profiles(id)
  - `type` (text) - Transaction type: 'purchase', 'usage', 'refill', 'bonus', 'refund'
  - `amount` (integer) - Token amount (positive for additions, negative for usage)
  - `balance_after` (integer) - Token balance after this transaction
  - `description` (text) - Human-readable transaction description
  - `generation_id` (uuid, nullable) - References generations(id) if related to a generation
  - `payment_id` (uuid, nullable) - References payments(id) if related to a payment
  - `metadata` (jsonb, nullable) - Additional transaction metadata
  - `created_at` (timestamptz) - Transaction timestamp

  ### 4. `generations`
  Stores all AI-generated content (images and videos)
  - `id` (uuid, primary key) - Unique generation identifier
  - `user_id` (uuid) - References profiles(id)
  - `type` (text) - Content type: 'image', 'video'
  - `prompt` (text) - User's text prompt for generation
  - `status` (text) - Generation status: 'pending', 'processing', 'completed', 'failed'
  - `result_url` (text, nullable) - URL to generated content (image/video)
  - `thumbnail_url` (text, nullable) - URL to thumbnail preview
  - `tokens_used` (integer) - Number of tokens consumed for this generation
  - `n8n_webhook_id` (text, nullable) - n8n workflow execution ID for tracking
  - `error_message` (text, nullable) - Error details if generation failed
  - `metadata` (jsonb, nullable) - Additional generation parameters and settings
  - `is_favorite` (boolean) - User favorite flag
  - `is_public` (boolean) - Whether generation has a public share link
  - `public_share_id` (text, nullable, unique) - Unique ID for public sharing
  - `created_at` (timestamptz) - Generation request timestamp
  - `completed_at` (timestamptz, nullable) - Generation completion timestamp

  ### 5. `payments`
  Tracks all Stripe payment transactions
  - `id` (uuid, primary key) - Unique payment identifier
  - `user_id` (uuid) - References profiles(id)
  - `stripe_payment_intent_id` (text, unique) - Stripe PaymentIntent ID
  - `stripe_invoice_id` (text, nullable) - Stripe Invoice ID
  - `amount` (decimal) - Payment amount in dollars
  - `currency` (text) - Payment currency code (e.g., 'usd')
  - `status` (text) - Payment status: 'pending', 'succeeded', 'failed', 'refunded'
  - `payment_type` (text) - Type: 'subscription', 'token_purchase', 'upgrade'
  - `tokens_credited` (integer, nullable) - Tokens added from this payment
  - `subscription_id` (uuid, nullable) - References subscriptions(id)
  - `metadata` (jsonb, nullable) - Additional payment metadata
  - `created_at` (timestamptz) - Payment creation timestamp
  - `updated_at` (timestamptz) - Last payment update

  ## Security

  All tables have Row Level Security (RLS) enabled with restrictive policies:
  - Users can only access their own data
  - Authenticated users required for all operations
  - Public sharing only for generations with is_public flag enabled

  ## Indexes

  Performance indexes created on frequently queried columns:
  - User ID lookups across all tables
  - Generation status and type filtering
  - Token transaction chronological queries
  - Subscription status checks
*/

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  avatar_url text,
  subscription_tier text NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'basic', 'pro', 'premium')),
  token_balance integer NOT NULL DEFAULT 10,
  total_tokens_purchased integer NOT NULL DEFAULT 0,
  total_tokens_used integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tier text NOT NULL CHECK (tier IN ('basic', 'pro', 'premium')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'expired')),
  stripe_subscription_id text UNIQUE,
  stripe_customer_id text,
  current_period_start timestamptz NOT NULL DEFAULT now(),
  current_period_end timestamptz NOT NULL,
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  tokens_per_month integer NOT NULL,
  price_monthly decimal(10, 2) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create token_transactions table
CREATE TABLE IF NOT EXISTS token_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('purchase', 'usage', 'refill', 'bonus', 'refund')),
  amount integer NOT NULL,
  balance_after integer NOT NULL,
  description text NOT NULL,
  generation_id uuid,
  payment_id uuid,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create generations table
CREATE TABLE IF NOT EXISTS generations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('image', 'video')),
  prompt text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  result_url text,
  thumbnail_url text,
  tokens_used integer NOT NULL,
  n8n_webhook_id text,
  error_message text,
  metadata jsonb,
  is_favorite boolean NOT NULL DEFAULT false,
  is_public boolean NOT NULL DEFAULT false,
  public_share_id text UNIQUE,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_payment_intent_id text UNIQUE NOT NULL,
  stripe_invoice_id text,
  amount decimal(10, 2) NOT NULL,
  currency text NOT NULL DEFAULT 'usd',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
  payment_type text NOT NULL CHECK (payment_type IN ('subscription', 'token_purchase', 'upgrade')),
  tokens_credited integer,
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE SET NULL,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add foreign key for token_transactions
ALTER TABLE token_transactions ADD CONSTRAINT fk_generation
  FOREIGN KEY (generation_id) REFERENCES generations(id) ON DELETE SET NULL;

ALTER TABLE token_transactions ADD CONSTRAINT fk_payment
  FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_tier ON profiles(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_token_transactions_user_id ON token_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_token_transactions_created_at ON token_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_generations_user_id ON generations(user_id);
CREATE INDEX IF NOT EXISTS idx_generations_status ON generations(status);
CREATE INDEX IF NOT EXISTS idx_generations_type ON generations(type);
CREATE INDEX IF NOT EXISTS idx_generations_created_at ON generations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_generations_public_share_id ON generations(public_share_id) WHERE public_share_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_payment_intent_id ON payments(stripe_payment_intent_id);

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles table
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for subscriptions table
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own subscriptions"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own subscriptions"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for token_transactions table
CREATE POLICY "Users can view own token transactions"
  ON token_transactions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own token transactions"
  ON token_transactions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for generations table
CREATE POLICY "Users can view own generations"
  ON generations FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Anyone can view public generations"
  ON generations FOR SELECT
  TO anon
  USING (is_public = true);

CREATE POLICY "Users can insert own generations"
  ON generations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own generations"
  ON generations FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own generations"
  ON generations FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for payments table
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call function on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS set_updated_at_profiles ON profiles;
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_subscriptions ON subscriptions;
CREATE TRIGGER set_updated_at_subscriptions
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_payments ON payments;
CREATE TRIGGER set_updated_at_payments
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();