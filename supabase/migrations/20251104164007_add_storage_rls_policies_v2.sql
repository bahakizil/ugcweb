/*
  # Add Storage RLS Policies

  1. Images Bucket Policies
    - Authenticated users can upload images
    - Anyone can read images (public bucket)
    - Users can update/delete images
    
  2. Videos Bucket Policies
    - Service role can upload videos (for n8n)
    - Anyone can read videos (public bucket)
*/

-- Drop existing policies if any
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can read images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;
DROP POLICY IF EXISTS "Service role can upload videos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can read videos" ON storage.objects;
DROP POLICY IF EXISTS "Service role can update videos" ON storage.objects;
DROP POLICY IF EXISTS "Service role can delete videos" ON storage.objects;

-- Images bucket policies
CREATE POLICY "Authenticated users can upload images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'images');

CREATE POLICY "Anyone can read images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'images');

CREATE POLICY "Users can update own images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'images');

CREATE POLICY "Users can delete own images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'images');

-- Videos bucket policies
CREATE POLICY "Service role can upload videos"
  ON storage.objects
  FOR INSERT
  TO authenticated, service_role
  WITH CHECK (bucket_id = 'videos');

CREATE POLICY "Anyone can read videos"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'videos');

CREATE POLICY "Service role can update videos"
  ON storage.objects
  FOR UPDATE
  TO service_role
  USING (bucket_id = 'videos');

CREATE POLICY "Service role can delete videos"
  ON storage.objects
  FOR DELETE
  TO service_role
  USING (bucket_id = 'videos');