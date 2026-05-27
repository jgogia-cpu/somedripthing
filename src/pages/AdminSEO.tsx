import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, RefreshCw, ExternalLink } from "lucide-react";
import SEO from "@/components/SEO";

type Row = { keys?: string[]; clicks: number; impressions: number; ctr: number; position: number };
type SearchResp = { rows?: Row[]; error?: string };
type Sitemap = {
  path: string;
  lastSubmitted?: string;
  isPending?: boolean;
  isSitemapsIndex?: boolean;
  warnings?: string;
  errors?: string;
  contents?: { type: string; submitted: string; indexed: string }[];
};
type SitemapsResp = { sitemap?: Sitemap[]; error?: string };

interface Insights {
  site: string;
  period: { startDate: string; endDate: string };
  topPages: SearchResp;
  topQueries: SearchResp;
  sitemaps: SitemapsResp;
}

export default function AdminSEO() {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const { data, error } = await supabase.functions.invoke<Insights>("gsc-insights", { body: {} });
      if (error) throw error;
      setData(data ?? null);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) load();
  }, [user]);

  if (authLoading) return null;
  const ADMIN_EMAIL = "jgogia@ualberta.ca";
  if (!user) {
    return (
      <div className="container py-20 text-center">
        <p>You must be signed in to view the SEO dashboard.</p>
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

  const sitemapErrors = data?.sitemaps?.sitemap?.flatMap((s) =>
    [
      Number(s.errors || 0) > 0 ? { path: s.path, kind: "errors", count: Number(s.errors) } : null,
      Number(s.warnings || 0) > 0 ? { path: s.path, kind: "warnings", count: Number(s.warnings) } : null,
    ].filter(Boolean),
  ) as { path: string; kind: string; count: number }[] | undefined;

  const totalSubmitted = data?.sitemaps?.sitemap?.reduce(
    (sum, s) => sum + (s.contents?.reduce((a, c) => a + Number(c.submitted || 0), 0) || 0),
    0,
  );
  const totalIndexed = data?.sitemaps?.sitemap?.reduce(
    (sum, s) => sum + (s.contents?.reduce((a, c) => a + Number(c.indexed || 0), 0) || 0),
    0,
  );

  return (
    <div className="container py-10">
      <SEO title="SEO Dashboard — DRIPWAY Admin" description="Internal SEO insights" path="/admin/seo" />
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">SEO Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {data ? `${data.site} · ${data.period.startDate} → ${data.period.endDate}` : "Search Console insights"}
          </p>
        </div>
        <Button onClick={load} disabled={loading} variant="outline" size="sm" className="gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />} Refresh
        </Button>
      </div>

      {err && (
        <Card className="mb-6 border-destructive/40">
          <CardContent className="pt-6 text-sm text-destructive">Error: {err}</CardContent>
        </Card>
      )}

      {/* Index status */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Submitted URLs</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{totalSubmitted ?? "—"}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Indexed URLs</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalIndexed ?? "—"}</p>
            {totalSubmitted ? (
              <p className="text-xs text-muted-foreground">
                {Math.round(((totalIndexed || 0) / totalSubmitted) * 100)}% coverage
              </p>
            ) : null}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Sitemap errors / warnings</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {sitemapErrors ? sitemapErrors.reduce((a, e) => a + e.count, 0) : "—"}
            </p>
            <p className="text-xs text-muted-foreground">
              {data?.sitemaps?.sitemap?.length ?? 0} sitemap(s) submitted
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sitemaps */}
      <Card className="mt-6">
        <CardHeader><CardTitle>Sitemaps & crawl status</CardTitle></CardHeader>
        <CardContent>
          {data?.sitemaps?.error && <p className="text-sm text-destructive">{data.sitemaps.error}</p>}
          {data?.sitemaps?.sitemap?.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Path</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Indexed</TableHead>
                  <TableHead>Errors</TableHead>
                  <TableHead>Warnings</TableHead>
                  <TableHead>Last submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.sitemaps.sitemap.map((s) => {
                  const sub = s.contents?.reduce((a, c) => a + Number(c.submitted || 0), 0) || 0;
                  const idx = s.contents?.reduce((a, c) => a + Number(c.indexed || 0), 0) || 0;
                  return (
                    <TableRow key={s.path}>
                      <TableCell className="max-w-[280px] truncate font-mono text-xs">{s.path}</TableCell>
                      <TableCell>{sub}</TableCell>
                      <TableCell>{idx}</TableCell>
                      <TableCell className={Number(s.errors) > 0 ? "text-destructive" : ""}>{s.errors || 0}</TableCell>
                      <TableCell>{s.warnings || 0}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {s.lastSubmitted ? new Date(s.lastSubmitted).toLocaleString() : "—"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : !data?.sitemaps?.error ? (
            <p className="text-sm text-muted-foreground">No sitemap data yet.</p>
          ) : null}
        </CardContent>
      </Card>

      {/* Top pages */}
      <Card className="mt-6">
        <CardHeader><CardTitle>Top landing pages (28d)</CardTitle></CardHeader>
        <CardContent>
          {data?.topPages?.error && <p className="text-sm text-destructive">{data.topPages.error}</p>}
          {data?.topPages?.rows?.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                  <TableHead className="text-right">Impressions</TableHead>
                  <TableHead className="text-right">CTR</TableHead>
                  <TableHead className="text-right">Position</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.topPages.rows.map((r) => (
                  <TableRow key={r.keys?.[0]}>
                    <TableCell className="max-w-[380px] truncate">
                      <a href={r.keys?.[0]} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-accent">
                        <span className="truncate">{r.keys?.[0]}</span>
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                    </TableCell>
                    <TableCell className="text-right">{r.clicks}</TableCell>
                    <TableCell className="text-right">{r.impressions}</TableCell>
                    <TableCell className="text-right">{(r.ctr * 100).toFixed(1)}%</TableCell>
                    <TableCell className="text-right">{r.position.toFixed(1)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : !data?.topPages?.error ? (
            <p className="text-sm text-muted-foreground">No traffic yet — Search Console needs ~2–3 days after verification.</p>
          ) : null}
        </CardContent>
      </Card>

      {/* Top queries */}
      <Card className="mt-6">
        <CardHeader><CardTitle>Top queries (28d)</CardTitle></CardHeader>
        <CardContent>
          {data?.topQueries?.error && <p className="text-sm text-destructive">{data.topQueries.error}</p>}
          {data?.topQueries?.rows?.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Query</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                  <TableHead className="text-right">Impressions</TableHead>
                  <TableHead className="text-right">CTR</TableHead>
                  <TableHead className="text-right">Position</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.topQueries.rows.map((r) => (
                  <TableRow key={r.keys?.[0]}>
                    <TableCell>{r.keys?.[0]}</TableCell>
                    <TableCell className="text-right">{r.clicks}</TableCell>
                    <TableCell className="text-right">{r.impressions}</TableCell>
                    <TableCell className="text-right">{(r.ctr * 100).toFixed(1)}%</TableCell>
                    <TableCell className="text-right">{r.position.toFixed(1)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : !data?.topQueries?.error ? (
            <p className="text-sm text-muted-foreground">No query data yet.</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}