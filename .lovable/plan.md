## Goal
Transform the DRIPWAY homepage into a bold, shoppable fashion-magazine experience built around the selected **Editorial magazine cover** direction.

## Visual direction
- Lock the chosen charcoal-and-ember palette: `#1a1a1a`, `#2d2d2d`, `#4a4a4a`, `#e85d3a`, expressed through semantic theme tokens.
- Use **Libre Baskerville** for commanding editorial headlines and **IBM Plex Sans** for navigation, prices, labels, and supporting text.
- Use broken-grid composition, oversized type, dramatic image crops, thin editorial rules, and restrained issue-style metadata.
- Keep the presentation dark, raw, and fashion-led rather than glossy or conventionally ecommerce.

## Homepage cover
- Replace the current small 3D-card hero with one dominant, full-bleed fashion image drawn from DRIPWAY’s existing brand and lookbook assets.
- Make **DRIPWAY** an oversized magazine masthead across the first viewport.
- Add sparse issue-style details and one short fashion-culture statement without cluttering the image.
- Keep the cover immediately shoppable with clear links to the featured product and Collections.
- Preserve automatic product rotation, but express it through large editorial image changes rather than floating cards.
- Keep the next section visible at the bottom edge so the page clearly continues.

## Editorial shopping flow
- Turn Trending into a broken magazine spread: one or two dominant product stories supported by smaller product tiles instead of a uniform masonry wall.
- Restyle the featured-brand area as a full-width editorial chapter with larger photography and stronger brand typography.
- Present New Drops as bold image-led brand stories while preserving the newest-four default and existing “More brands” control.
- Restyle category links, recently viewed, newsletter, and Instagram areas to fit the same print system without changing their behavior.

## Interaction and mobile
- Use restrained cover-line and image-reveal motion, subtle crop movement, and crisp hover states.
- Respect reduced-motion settings.
- Recompose the cover and broken grids for phone screens so text never obscures the subject or controls.
- Keep product, brand, collection, wishlist, currency, and newsletter behavior unchanged.

## Technical details
- Update homepage presentation components and shared semantic design tokens only; no database or scraper changes.
- Load the selected fonts through the document head rather than CSS imports.
- Replace hardcoded visual colors in touched homepage components with semantic tokens and button variants.
- Reuse existing DRIPWAY media; do not introduce forbidden brands Apollo Originals, Christopher Noir, or VeroBottega.
- Verify the completed homepage at desktop and mobile sizes, including image loading, navigation, section continuity, and reduced-motion behavior.
