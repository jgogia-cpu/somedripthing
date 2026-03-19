INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view blog images"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'blog-images');

CREATE POLICY "Service role can upload blog images"
ON storage.objects
FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'blog-images');