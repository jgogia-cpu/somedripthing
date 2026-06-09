GRANT ALL ON public.scraper_runs TO service_role;
ALTER TABLE public.scraper_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role manages scraper runs"
ON public.scraper_runs
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);