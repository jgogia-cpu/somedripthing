
CREATE TABLE public.affiliate_clicks (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  event_name TEXT NOT NULL DEFAULT 'outbound_brand_click',
  click_type TEXT,
  brand_id TEXT,
  brand_name TEXT,
  brand_slug TEXT,
  product_id TEXT,
  product_name TEXT,
  destination_url TEXT NOT NULL,
  source_path TEXT,
  source TEXT,
  user_id UUID,
  user_agent TEXT
);

CREATE INDEX affiliate_clicks_created_at_idx ON public.affiliate_clicks (created_at DESC);
CREATE INDEX affiliate_clicks_brand_idx ON public.affiliate_clicks (brand_id);
CREATE INDEX affiliate_clicks_product_idx ON public.affiliate_clicks (product_id);

GRANT INSERT ON public.affiliate_clicks TO anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.affiliate_clicks_id_seq TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.affiliate_clicks TO authenticated;
GRANT ALL ON public.affiliate_clicks TO service_role;
GRANT ALL ON SEQUENCE public.affiliate_clicks_id_seq TO service_role;

ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;

-- Anyone (anon or authenticated) can record a click
CREATE POLICY "anyone can insert clicks"
ON public.affiliate_clicks
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only the admin email can read
CREATE POLICY "admin can read clicks"
ON public.affiliate_clicks
FOR SELECT
TO authenticated
USING ((auth.jwt() ->> 'email') = 'jgogia@ualberta.ca');
