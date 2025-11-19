/*
  # Update Free User Token Balance

  1. Changes
    - Update default token_balance from 10 to 20 for new free users
    - Update the handle_new_user() function to give 20 tokens to new sign-ups

  2. Notes
    - Only affects NEW users going forward
    - Existing users keep their current token balance
    - Free tier users will receive 20 tokens upon registration
*/

-- Update default token balance in profiles table
ALTER TABLE profiles ALTER COLUMN token_balance SET DEFAULT 20;

-- Update the handle_new_user function to give 20 tokens
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
    20,
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