DROP POLICY IF EXISTS "Service role manages scraper runs" ON public.scraper_runs;
CREATE POLICY "Service role can read scraper runs"
ON public.scraper_runs
FOR SELECT
TO service_role
USING (true);