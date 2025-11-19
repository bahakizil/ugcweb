/*
  # Add Admin Role System

  1. Changes
    - Add `is_admin` column to profiles table
    - Add `max_tokens` column to profiles for unlimited tokens (null = unlimited)
    - Update RLS policies for admin access
    
  2. Admin Features
    - Admins have unlimited tokens (max_tokens = null)
    - Admins can view all generations
    - Admins bypass token checks
*/

-- Add is_admin column to profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_admin boolean DEFAULT false NOT NULL;
  END IF;
END $$;

-- Add max_tokens column (null = unlimited for admins)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'max_tokens'
  ) THEN
    ALTER TABLE profiles ADD COLUMN max_tokens integer DEFAULT NULL;
  END IF;
END $$;

-- Create index on is_admin for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);

-- Add policy for admins to view all generations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'generations' 
    AND policyname = 'Admins can view all generations'
  ) THEN
    CREATE POLICY "Admins can view all generations"
      ON generations
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM profiles 
          WHERE profiles.id = auth.uid() 
          AND profiles.is_admin = true
        )
      );
  END IF;
END $$;