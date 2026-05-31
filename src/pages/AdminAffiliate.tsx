import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Loader2, RefreshCw } from "lucide-react";
import SEO from "@/components/SEO";

type Click = {
  id: number;
  created_at: string;
  event_name: string;
  click_type: string | null;
  brand_id: string | null;
  brand_name: string | null;
  brand_slug: string | null;
  product_id: string | null;
  product_name: string | null;
  destination_url: string;
  source_path: string | null;
  source: string | null;
};

const ADMIN_EMAIL = "jgogia@ualberta.ca";
const RANGES = [
  { label: "Last 24h", days: 1 },
  { label: "Last 7d", days: 7 },
  { label: "Last 30d", days: 30 },
  { label: "Last 90d", days: 90 },
  { label: "All time", days: 0 },
];

export default function AdminAffiliate() {
  const { user, loading: authLoading } = useAuth();
  const [rows, setRows] = useState<Click[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [rangeDays, setRangeDays] = useState(30);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      let q = supabase
        .from("affiliate_clicks")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5000);
      if (rangeDays > 0) {
        const since = new Date(Date.now() - rangeDays * 86400_000).toISOString();
        q = q.gte("created_at", since);
      }
      const { data, error } = await q;
      if (error) throw error;
      setRows((data as Click[]) ?? []);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email?.toLowerCase() === ADMIN_EMAIL) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, rangeDays]);

  const stats = useMemo(() => {
    const total = rows.length;
    const byBrand = new Map<string, { name: string; slug: string | null; count: number }>();
    const byProduct = new Map<string, { name: string; brand: string; count: number; id: string }>();
    const byType = new Map<string, number>();
    const bySource = new Map<string, number>();
    rows.forEach((r) => {
      const bkey = r.brand_id || r.brand_name || "unknown";
      const b = byBrand.get(bkey) || { name: r.brand_name || "Unknown", slug: r.brand_slug, count: 0 };
      b.count++; byBrand.set(bkey, b);
      if (r.product_id) {
        const p = byProduct.get(r.product_id) || {
          name: r.product_name || r.product_id, brand: r.brand_name || "", count: 0, id: r.product_id,
        };
        p.count++; byProduct.set(r.product_id, p);
      }
      byType.set(r.click_type || "other", (byType.get(r.click_type || "other") || 0) + 1);
      const s = r.source || "—";
      bySource.set(s, (bySource.get(s) || 0) + 1);
    });
    return {
      total,
      brands: [...byBrand.entries()].sort((a, b) => b[1].count - a[1].count),
      products: [...byProduct.values()].sort((a, b) => b.count - a.count),
      types: [...byType.entries()].sort((a, b) => b[1] - a[1]),
      sources: [...bySource.entries()].sort((a, b) => b[1] - a[1]),
    };
  }, [rows]);

  if (authLoading) return null;
  if (!user) {
    return (
      <div className="container py-20 text-center">
        <p>You must be signed in to view the affiliate dashboard.</p>
      </div>
    );
  }
  if (user.email?.toLowerCase() !== ADMIN_EMAIL) {
    return (
      <div className="container py-20 text-center">
        <p>You don't have access to this page.</p>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <SEO title="Affiliate Dashboard — DRIPWAY Admin" description="Affiliate click + conversion tracking" path="/admin/affiliate" />

      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Affiliate clicks</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            First-party tracking for every outbound brand & product link.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {RANGES.map((r) => (
            <Button
              key={r.days}
              variant={rangeDays === r.days ? "default" : "outline"}
              size="sm"
              onClick={() => setRangeDays(r.days)}
            >
              {r.label}
            </Button>
          ))}
          <Button onClick={load} disabled={loading} variant="outline" size="sm" className="gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />} Refresh
          </Button>
        </div>
      </div>

      {err && (
        <Card className="mb-6 border-destructive/40">
          <CardContent className="pt-6 text-sm text-destructive">Error: {err}</CardContent>
        </Card>
      )}

      {/* Top-line cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total clicks</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{stats.total}</p></CardContent>
        </Card>
        {stats.types.slice(0, 3).map(([t, c]) => (
          <Card key={t}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground capitalize">{t} clicks</CardTitle>
            </CardHeader>
            <CardContent><p className="text-3xl font-bold">{c}</p></CardContent>
          </Card>
        ))}
      </div>

      {/* Brands */}
      <Card className="mt-6">
        <CardHeader><CardTitle>Clicks by brand</CardTitle></CardHeader>
        <CardContent>
          {stats.brands.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Brand</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                  <TableHead className="text-right">% of total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.brands.map(([key, b]) => (
                  <TableRow key={key}>
                    <TableCell>
                      {b.slug ? (
                        <Link to={`/brand/${b.slug}`} className="hover:text-accent">{b.name}</Link>
                      ) : b.name}
                    </TableCell>
                    <TableCell className="text-right font-medium">{b.count}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {stats.total ? ((b.count / stats.total) * 100).toFixed(1) : "0"}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">No clicks recorded in this range yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Products */}
      <Card className="mt-6">
        <CardHeader><CardTitle>Top products</CardTitle></CardHeader>
        <CardContent>
          {stats.products.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.products.slice(0, 50).map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="max-w-[380px] truncate">
                      <Link to={`/product/${p.id}`} className="hover:text-accent">{p.name}</Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{p.brand}</TableCell>
                    <TableCell className="text-right font-medium">{p.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">No product clicks yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Sources */}
      <Card className="mt-6">
        <CardHeader><CardTitle>Clicks by source placement</CardTitle></CardHeader>
        <CardContent>
          {stats.sources.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.sources.map(([s, c]) => (
                  <TableRow key={s}>
                    <TableCell className="font-mono text-xs">{s}</TableCell>
                    <TableCell className="text-right">{c}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : null}
        </CardContent>
      </Card>

      {/* Recent */}
      <Card className="mt-6">
        <CardHeader><CardTitle>Recent clicks</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>From</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.slice(0, 100).map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(r.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-xs capitalize">{r.click_type || "—"}</TableCell>
                  <TableCell className="text-sm">{r.brand_name || "—"}</TableCell>
                  <TableCell className="max-w-[260px] truncate text-sm">{r.product_name || "—"}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-xs text-muted-foreground">{r.source_path || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}