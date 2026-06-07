
-- Restrict scraper_runs to service_role only (drop public read)
DROP POLICY IF EXISTS "Anyone can read scraper runs" ON public.scraper_runs;
REVOKE SELECT ON public.scraper_runs FROM anon, authenticated;

-- Lock down handle_new_user SECURITY DEFINER function: only trigger context should call it
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
