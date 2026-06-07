import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export interface Crumb {
  label: string;
  to?: string;
}

/**
 * Lightweight breadcrumb trail with JSON-LD already emitted on relevant pages.
 * Pass the trail without the leading "Home" — it's added automatically.
 */
export default function Breadcrumbs({ items, className = "" }: { items: Crumb[]; className?: string }) {
  const all: Crumb[] = [{ label: "Home", to: "/" }, ...items];
  return (
    <nav aria-label="Breadcrumb" className={`flex flex-wrap items-center gap-1 text-xs text-muted-foreground ${className}`}>
      {all.map((c, i) => {
        const last = i === all.length - 1;
        return (
          <span key={i} className="flex items-center gap-1">
            {i === 0 ? (
              <Link to={c.to!} className="flex items-center gap-1 transition-colors hover:text-foreground">
                <Home className="h-3 w-3" />
                <span className="sr-only">{c.label}</span>
              </Link>
            ) : last || !c.to ? (
              <span className="truncate font-medium text-foreground/80" aria-current="page">{c.label}</span>
            ) : (
              <Link to={c.to} className="truncate transition-colors hover:text-foreground">{c.label}</Link>
            )}
            {!last && <ChevronRight className="h-3 w-3 text-muted-foreground/50" />}
          </span>
        );
      })}
    </nav>
  );
}