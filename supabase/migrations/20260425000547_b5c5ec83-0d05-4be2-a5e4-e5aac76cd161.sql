CREATE TABLE IF NOT EXISTS public.scraped_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id text NOT NULL,
  brand_name text NOT NULL,
  handle text NOT NULL,
  name text NOT NULL,
  image text NOT NULL,
  images jsonb NOT NULL DEFAULT '[]'::jsonb,
  price numeric NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Tops',
  aesthetics jsonb NOT NULL DEFAULT '["Streetwear"]'::jsonb,
  sizes jsonb NOT NULL DEFAULT '["S","M","L","XL"]'::jsonb,
  affiliate_url text NOT NULL,
  scraped_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (brand_id, handle)
);

ALTER TABLE public.scraped_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read scraped products"
  ON public.scraped_products FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS public.scraper_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ran_at timestamptz NOT NULL DEFAULT now(),
  brands_checked int NOT NULL DEFAULT 0,
  products_added int NOT NULL DEFAULT 0,
  notes text
);

ALTER TABLE public.scraper_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read scraper runs"
  ON public.scraper_runs FOR SELECT USING (true);

CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;