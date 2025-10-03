-- Create storage bucket for health records
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'health-records',
  'health-records',
  false,
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
);

-- Storage policies for health records
CREATE POLICY "Users can view their own health records"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'health-records' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can upload their own health records"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'health-records' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own health records"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'health-records' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);