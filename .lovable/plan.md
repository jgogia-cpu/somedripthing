# Site-wide overhaul: Gallery Minimal, black & bone

Every current section and feature stays (rotating model covers, Trending, New Drops, brand pages, product pages, newsletter, Instagram, currency, wishlist, shop buttons). The change is visual only.

## Look and feel
- Colours: near-black background (#050505), raised surfaces (#141414), bone text (#e8e4dd), with bright bone (#f5f3ee) for highlights. The orange ember accent goes away, so the look is monochrome.
- Typography: Instrument Serif for large headlines, Work Sans for body text, and small uppercase labels with wide letter spacing (gallery-placard style). Brand logo fonts stay as they are.
- Space: much more empty space, thin 1px hairline dividers, square corners, and no glows, gradients or heavy shadows.
- Motion: slow image fades and a gentle zoom on hover only. Nothing bouncy, to keep scrolling smooth.

## Pages
- **Homepage:** the cover photo goes edge to edge at full height, with a small DRIPWAY wordmark and a caption placed like a gallery placard (brand, piece, price). Trending becomes one large image next to two smaller ones. New Drops becomes a numbered list (01, 02...) with large brand images. Newsletter and Instagram become quiet one-line bands.
- **Brands directory:** a clean index of brand names in large serif type, with the brand's image appearing on hover (desktop) or as a thumbnail (mobile). The editorial picks section stays.
- **Brand profile:** a full-width lookbook opener, a short bio in a narrow column, then a calm product grid with generous spacing.
- **Category pages:** a simplified filter bar, an even grid with labels underneath, and the shuffle kept.
- **Product page:** a large image gallery on the left and a slim sticky info column on the right (name, price, sizes, Shop [Brand]). The made-to-order panel is restyled to match.
- **Menus & footer:** a thin, see-through top bar that becomes solid on scroll, a full-screen black menu on mobile, and a minimal footer with columns of small links.
- About, Collections, Blog, Account, Wishlist and the other pages get the new colours, fonts and spacing automatically.

## Technical details
- Update the colour and spacing tokens in `src/index.css` and `tailwind.config.ts` (black/bone HSL values, radius 0, hairline border token). Remove the ember accent usages.
- Restyle the shared shadcn variants (button, card, input, badge) so every page inherits the new look.
- Rework layouts in `Index.tsx`, `Brands.tsx`, `BrandProfile.tsx`, `Category.tsx`, `ProductDetail.tsx`, `Navbar`, `Footer`, `ProductCard`, `BrandCard` and `EditorialProduct`. Data and logic stay unchanged (hero slide pairing, forbidden brands, scraped products, SEO components).
- Keep the earlier fixes against flickering and layout jumps (memoised cards, lazy images, stable aspect ratios).
- Check desktop and mobile in the browser before finishing, and update the style memory with the new palette.
