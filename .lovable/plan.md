
# 🛍️ DRIP — Niche Fashion Discovery Platform

## Brand Positioning
- **Name suggestion**: DRIP (or similar — short, memorable, fashion-native)
- **Value prop**: "Discover the brands Instagram won't show you" — a curated discovery engine for underground, emerging, and niche fashion
- **Target audience**: Gen Z & young millennials (18-30), trend-conscious, Instagram/TikTok-native shoppers tired of fast fashion but priced out of luxury
- **Voice**: Confident, editorial, culturally aware — like a cool friend who always finds brands first

---

## Website Structure & Pages

### 1. Homepage
- Hero section with rotating featured brand spotlight + editorial imagery
- "Trending Now" carousel of hot brands/products
- Category/aesthetic quick-filter chips (Streetwear, Minimalist, Y2K, Avant-Garde, etc.)
- Pinterest-style masonry grid of curated product picks
- "New Drops" section highlighting recently added brands
- Newsletter signup with "Get early access to new brands"
- Editorial/blog preview section

### 2. Browse/Explore Page
- Full filtering system: aesthetic, price range, category, culture, location, brand size
- Search with autocomplete
- Sort by: trending, newest, price, popularity
- Infinite scroll product/brand grid
- Toggle between brand view and product view

### 3. Brand Profile Page
- Brand hero image/banner + logo
- Bio, origin story, social links (Instagram, TikTok)
- Aesthetic tags and style badges
- Product grid from that brand
- "Similar Brands" recommendations
- Social proof: follower count, community rating
- Affiliate CTA: "Shop [Brand]" button (redirects to brand site with tracking)

### 4. Product Detail Page
- Large product imagery
- Price, description, available sizes (pulled from brand)
- "Buy from [Brand]" affiliate button
- Save to wishlist
- Related products from same brand + similar brands
- User reviews/ratings (community-driven)

### 5. Editorial/Blog Section
- Brand spotlight articles
- Trend reports and style guides
- "How to style" content
- SEO-optimized long-form content

### 6. User Dashboard (optional login)
- Saved/wishlisted brands and products
- Style preferences quiz results
- Personalized feed based on taste
- Purchase history (tracked via affiliate cookies)

### 7. Brand Submission Portal (Phase 2)
- Application form for brands wanting to be listed
- Brand dashboard to manage their profile

---

## Monetization Model
- **Affiliate links**: Every "Shop" button carries affiliate tracking (direct partnerships or networks like ShareASale, Impact, Skimlinks)
- **Featured placements**: Brands pay for homepage spotlight, category page top placement
- **Sponsored content**: Paid editorial features and brand stories
- **Premium brand profiles**: Enhanced profiles with analytics for brands (Phase 2)

---

## Core Features for MVP

### Phase 1 — Launch
1. Homepage with featured brands, trending grid, category filters
2. Browse page with full filtering (aesthetic, price, category, style)
3. Brand profile pages with product listings
4. Product detail pages with affiliate redirect buttons
5. Search with autocomplete
6. Optional user accounts (wishlist, saved brands)
7. Mobile-responsive, clean & modern design
8. Editorial/blog section for SEO and discovery
9. Newsletter signup

### Phase 2 — Growth
10. Brand submission portal
11. Personalized recommendations based on user behavior
12. Community ratings and reviews
13. Style quiz for onboarding
14. Influencer curation pages ("Curated by @username")

---

## Design Direction
- Clean, modern, Pinterest-meets-SSENSE aesthetic
- Bright, airy backgrounds with bold product photography
- Masonry/grid layouts for visual browsing
- Smooth animations and transitions
- Mobile-first responsive design
- Accent colors for category tags and CTAs

---

## Technical Implementation

### Data Structure (localStorage/Supabase)
- **Brands**: name, logo, banner, bio, social links, aesthetic tags, website URL, affiliate link
- **Products**: name, images, price, brand_id, category, tags, affiliate URL, sizes
- **Categories/Tags**: aesthetic tags, style categories, price tiers
- **Users**: email, saved brands, wishlisted products, preferences
- **Editorial**: blog posts, brand spotlights, trend articles

### Pages & Routes
- `/` — Homepage
- `/explore` — Browse/filter all brands & products
- `/brand/:slug` — Brand profile
- `/product/:id` — Product detail
- `/blog` — Editorial section
- `/blog/:slug` — Article page
- `/wishlist` — User's saved items
- `/submit` — Brand submission (Phase 2)

### Key Components
- Masonry product grid with lazy loading
- Multi-faceted filter sidebar
- Brand card and product card components
- Affiliate link tracking wrapper
- Search with fuzzy matching
- Newsletter form
- Mobile navigation with bottom tab bar

### Initial Data
- Seed with 15-20 curated brands and 50+ products using mock/sample data to demonstrate the platform
