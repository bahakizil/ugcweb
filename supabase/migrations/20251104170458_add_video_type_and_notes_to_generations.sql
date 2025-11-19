/*
  # Add Video Type and Notes to Generations Table

  1. Changes
    - Add `video_type` column to `generations` table
      - Type: text with enum constraint
      - Options: 'performance', 'premium', 'ugc', 'product', 'dynamic'
      - Default: 'performance'
    - Add `notes` column to `generations` table
      - Type: text, nullable
      - For optional user notes about the generation
  
  2. Purpose
    - Allow users to select video type when creating generations
    - Store optional notes/instructions for the video generation
    - Pass this information to n8n webhook for processing
*/

-- Add video_type column with enum constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'generations' AND column_name = 'video_type'
  ) THEN
    ALTER TABLE generations 
    ADD COLUMN video_type text DEFAULT 'performance' NOT NULL;
    
    ALTER TABLE generations
    ADD CONSTRAINT generations_video_type_check 
    CHECK (video_type IN ('performance', 'premium', 'ugc', 'product', 'dynamic'));
  END IF;
END $$;

-- Add notes column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'generations' AND column_name = 'notes'
  ) THEN
    ALTER TABLE generations 
    ADD COLUMN notes text;
  END IF;
END $$;