## Goal
Make DRIPWAY feel lighter and easier to navigate without abandoning the dark aesthetic.

## 1. Softer dark theme
Edit `src/index.css` `.dark` tokens (the app runs in dark mode globally):
- `--background`: `0 0% 5%` → `0 0% 11%` (lifted charcoal)
- `--card`: `0 0% 8%` → `0 0% 14%`
- `--popover`: match card
- `--secondary` / `--muted`: `0 0% 12%` → `0 0% 18%`
- `--border` / `--input`: `0 0% 14%` → `0 0% 22%` (more visible separators)
- `--muted-foreground`: `0 0% 50%` → `0 0% 65%` (readable secondary text)
- `--foreground`: keep `0 0% 95%`
- Accent coral stays the same so brand color is unchanged.

No component changes needed — everything uses semantic tokens, so the whole site lifts in one pass. Spot-check Navbar, ProductCard, BrandCard, Footer for any hardcoded `bg-black` / `bg-[#...]` and swap to tokens.

## 2. Navbar restructure (`src/components/Navbar.tsx`)
Replace fiddly hover dropdowns and consolidate top-level items.

New desktop nav order:
```
DRIPWAY | Shop ▾   Brands   Collections   Blog | [search bar] [♥] [👤] [currency]
```

- **Shop ▾** — single click-to-open mega menu (Radix `DropdownMenu`, no hover) with two columns: "Him" and "Her", each listing the 8 subcategories. Closes on outside click / route change.
- **Brands** — new link to `/collections` (or a dedicated brands view if desired later) so brand discovery is one click.
- **Collections** — keep.
- **Blog** — promoted from More dropdown to top level.
- **Affiliate** — moved to footer + a small accent pill in the user dropdown (less prominent, still reachable).
- Remove the separate Him / Her / More dropdowns and the hover-intent logic.

**Visible search bar**
- Replace the search icon with an inline input (`w-56`, rounded-full, muted background) between nav links and icons on `md+`.
- Submitting routes to `/collections?q=<term>`; Collections page already filters — extend it to read the `q` param and pre-fill its search field. Icon-only fallback on mobile.

**Mobile menu**
- Replace nested Him/Her accordions with a flat list: Shop Him, Shop Her (each opens its own subcategory sheet), Brands, Collections, Blog, Affiliate.
- Larger tap targets (`py-3.5`), full-width search at the top of the sheet.

## 3. Routing / supporting edits
- `src/pages/Collections.tsx`: read `?q=` from `useSearchParams` on mount and seed the existing search state. No other logic changes.
- No new routes, no backend changes.

## Out of scope
- No light mode toggle (user picked softer dark).
- No homepage redesign, no product card changes, no data changes.
- Affiliate, admin, blog flows untouched beyond nav placement.

## Files touched
- `src/index.css` (theme tokens)
- `src/components/Navbar.tsx` (rewrite desktop + mobile nav)
- `src/pages/Collections.tsx` (read `q` query param)
- Minor token swaps in `Footer.tsx` / any component using hardcoded near-black backgrounds (audit during build).
