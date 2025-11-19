/*
  # Add job_id to generations table

  1. Changes
    - Add `job_id` column to `generations` table (unique identifier for n8n jobs)
    - Add `source_image_url` column to store uploaded image URL
    - Add index on job_id for faster lookups

  2. Notes
    - job_id will be a unique hash generated on the frontend
    - Used as filename when uploading to n8n bucket
*/

-- Add job_id column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'generations' AND column_name = 'job_id'
  ) THEN
    ALTER TABLE generations ADD COLUMN job_id text UNIQUE;
  END IF;
END $$;

-- Add source_image_url column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'generations' AND column_name = 'source_image_url'
  ) THEN
    ALTER TABLE generations ADD COLUMN source_image_url text;
  END IF;
END $$;

-- Create index on job_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_generations_job_id ON generations(job_id);