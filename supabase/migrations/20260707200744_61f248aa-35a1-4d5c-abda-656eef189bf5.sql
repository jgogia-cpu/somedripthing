
CREATE TABLE public.hidden_products (
  product_id text PRIMARY KEY,
  reason text NOT NULL,
  hidden_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.hidden_products TO anon, authenticated;
GRANT ALL ON public.hidden_products TO service_role;
ALTER TABLE public.hidden_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read hidden products" ON public.hidden_products FOR SELECT USING (true);
