## Fix: Card Sizing Consistency + Image Loading Layout Shift

### Problem
1. Item/category cards render at inconsistent sizes across the menu (categories row and meal cards).
2. On page load, cards visibly shrink/resize as images finish loading — this is a layout shift (CLS) issue, not a "download" issue. The images likely aren't preloaded and the containers don't have reserved space.

### Requirements

**1. Fixed, consistent card dimensions**
- Define a single fixed size (width + height) per card type using CSS variables, e.g.:
```css
  :root {
    --category-card-size: 120px;
    --meal-card-width: 320px;
    --meal-card-image-height: 260px;
  }
```
- Apply these as fixed `width`/`height` (not `min-width`/`max-width`, not content-based `auto`) to every card container of the same type, so all category icons and all meal cards are pixel-identical regardless of content length (e.g. Arabic text length varies — text must truncate/wrap inside the fixed box, never resize it).
- Image containers inside cards must use `aspect-ratio` (e.g. `aspect-ratio: 1/1` for category icons, `aspect-ratio: 4/3` for meal photos) combined with `object-fit: cover`, so the image always fills a pre-reserved box instead of dictating box size.

**2. Eliminate the shrink-on-load / layout shift**
- Reserve space for every image BEFORE it loads: every `<img>` must have explicit `width` and `height` attributes (or a wrapping div with the fixed `aspect-ratio` above) so the browser allocates the final layout space immediately, before the image bytes arrive.
- Add `loading="eager"` and `fetchpriority="high"` to above-the-fold images (category icons, first row of meal cards). Only images below the fold should use `loading="lazy"`.
- Preload the critical above-the-fold images in `<head>`:
```html
  <link rel="preload" as="image" href="/path/to/category-icon-1.png">
```
- If using React/Next.js, use `next/image` with explicit `width`/`height` and `priority` for above-the-fold images — never unstyled `<img>` with no dimensions.
- Do NOT change card size based on image load state (no conditional classes like `.loaded { width: auto }`). The card's size must be identical in its loading skeleton state and its loaded state — literally the same CSS box, only the content inside changes.

**3. Loading skeleton (optional but recommended)**
- Show a skeleton/placeholder (solid color or blurred low-res placeholder) inside the fixed-size box until the real image loads, using CSS `background-color` + a fade-in transition on the `<img>` once `onLoad` fires. This avoids blank flashes without ever changing the container's dimensions.

### Acceptance criteria
- [ ] All category icon cards are identical size (icon + label), no visual difference in width/height across the row.
- [ ] All meal cards are identical size regardless of Arabic text length (title truncates/wraps, card doesn't grow).
- [ ] On a hard refresh with throttled network (Chrome DevTools "Slow 3G"), card layout does not shift at all — CLS score should be ~0 (verify in Lighthouse).
- [ ] Cards must render at final size on first paint, not resize once images finish loading.