/*
  # Fix Database Security and Performance Issues

  1. Add Missing Indexes
    - Add index for `payments.subscription_id` foreign key
    - Add index for `token_transactions.generation_id` foreign key
    - Add index for `token_transactions.payment_id` foreign key

  2. Optimize RLS Policies
    - Replace `auth.uid()` with `(select auth.uid())` in all policies
    - This prevents re-evaluation for each row, improving performance at scale

  3. Fix Function Search Path
    - Set explicit search_path for functions to prevent role mutable issues

  4. Consolidate Permissive Policies
    - Merge multiple SELECT policies on generations table into single policy

  5. Remove Unused Indexes
    - Drop indexes that are not being used to reduce maintenance overhead
*/

-- Add missing indexes for foreign keys
CREATE INDEX IF NOT EXISTS idx_payments_subscription_id ON public.payments(subscription_id);
CREATE INDEX IF NOT EXISTS idx_token_transactions_generation_id ON public.token_transactions(generation_id);
CREATE INDEX IF NOT EXISTS idx_token_transactions_payment_id ON public.token_transactions(payment_id);

-- Drop and recreate RLS policies with optimized auth function calls
-- PROFILES table policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = id);

-- SUBSCRIPTIONS table policies
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can view own subscriptions"
  ON public.subscriptions FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can insert own subscriptions"
  ON public.subscriptions FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can update own subscriptions"
  ON public.subscriptions FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- TOKEN_TRANSACTIONS table policies
DROP POLICY IF EXISTS "Users can view own token transactions" ON public.token_transactions;
CREATE POLICY "Users can view own token transactions"
  ON public.token_transactions FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own token transactions" ON public.token_transactions;
CREATE POLICY "Users can insert own token transactions"
  ON public.token_transactions FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

-- GENERATIONS table policies - consolidate multiple permissive policies
DROP POLICY IF EXISTS "Users can view own generations" ON public.generations;
DROP POLICY IF EXISTS "Admins can view all generations" ON public.generations;

CREATE POLICY "Users can view generations"
  ON public.generations FOR SELECT
  TO authenticated
  USING (
    (select auth.uid()) = user_id 
    OR 
    (
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = (select auth.uid())
        AND profiles.is_admin = true
      )
    )
  );

DROP POLICY IF EXISTS "Users can insert own generations" ON public.generations;
CREATE POLICY "Users can insert own generations"
  ON public.generations FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own generations" ON public.generations;
CREATE POLICY "Users can update own generations"
  ON public.generations FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own generations" ON public.generations;
CREATE POLICY "Users can delete own generations"
  ON public.generations FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- PAYMENTS table policies
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
CREATE POLICY "Users can view own payments"
  ON public.payments FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own payments" ON public.payments;
CREATE POLICY "Users can insert own payments"
  ON public.payments FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

-- Fix function search path mutability
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    subscription_tier,
    token_balance,
    total_tokens_purchased,
    total_tokens_used,
    is_admin
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'free',
    100,
    0,
    0,
    false
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_subscriptions
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_payments
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Remove unused indexes
DROP INDEX IF EXISTS public.idx_profiles_is_admin;
DROP INDEX IF EXISTS public.idx_profiles_subscription_tier;
DROP INDEX IF EXISTS public.idx_subscriptions_user_id;
DROP INDEX IF EXISTS public.idx_subscriptions_status;
DROP INDEX IF EXISTS public.idx_token_transactions_created_at;
DROP INDEX IF EXISTS public.idx_generations_public_share_id;
DROP INDEX IF EXISTS public.idx_payments_user_id;
DROP INDEX IF EXISTS public.idx_payments_stripe_payment_intent_id;