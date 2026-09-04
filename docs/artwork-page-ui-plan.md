# Artwork Page UI Plan

## Goal

Replace the Artwork page placeholder with a responsive, Sanity-backed artwork viewer. The page should present artwork as a horizontal snapping carousel, make the centered item visually dominant, allow direct navigation by clicking neighboring items, and open the centered artwork in an accessible full-screen inspection modal.

## Current Repository State

- `app/artwork/page.tsx` already calls `sanityFetch` with `ARTWORK_QUERY`, but currently discards the returned data and renders `PagePlaceholder`.
- `lib/sanity/queries.ts` defines `ARTWORK_QUERY` as an array ordered by `date desc, _createdAt desc`, returning `_id`, `title`, `image`, and `date`.
- `sanity.types.ts` exposes the generated `ARTWORK_QUERY_RESULT` type. Artwork images may be null, and image metadata includes optional `alt` and `caption` values.
- `lib/sanity/image.ts` exposes `urlForImage(source)` and should remain the only image URL construction path.
- `package.json` does not currently include `framer-motion`. Add it as a runtime dependency and use it as the primary animation and carousel interaction layer.
- Theme tokens are defined in `app/theme.css`. The page must use the existing semantic tokens and Tailwind mappings rather than introducing page-specific colors.

## Implementation Role and Required Research

The implementing agent must act as both an expert React web developer and a Framer Motion expert.

Before changing application code, the agent must research the current, installed-compatible Framer Motion guidance and API behavior for:

- The package/import path appropriate for this Next.js and React version.
- Client-component boundaries and any SSR/hydration considerations when using motion components.
- Gesture handling for click/tap interactions and how it coexists with horizontal drag gestures.
- `AnimatePresence` or the current recommended equivalent for mounting/unmounting the lightbox.
- Motion values, drag constraints, or layout animations suitable for a centered carousel.
- Reduced-motion support through `useReducedMotion` or the current recommended API.
- Keyboard accessibility and focus-management implications of motion-driven controls.

Use the researched API rather than relying on older Framer Motion examples. Record any version-specific decision in the implementation PR or code comments only where the choice is not self-evident.

## Proposed Structure

### Server route: `app/artwork/page.tsx`

1. Keep the existing `Metadata` export.
2. Await `sanityFetch` once and destructure its `data` result.
3. Pass the typed artwork array to a new client component, for example `ArtworkCarousel` in `components/artwork-carousel.tsx`.
4. Remove the `PagePlaceholder` import and render the page heading plus carousel directly.
5. Keep the Sanity tag `artwork` so live updates and revalidation continue to target this page.

The server component should remain responsible for fetching and shaping initial data. The client component should own only interaction state: the active index, scroll synchronization, modal state, and focus restoration.

### Client component: `components/artwork-carousel.tsx`

Use a `"use client"` component with the generated `ARTWORK_QUERY_RESULT[number]` item shape (or an equivalent explicit prop type). Filter out documents without a usable image before rendering so an incomplete Studio document cannot create a blank slide. Use Framer Motion components and motion values for the carousel transitions, active-item emphasis, gestures, and lightbox presence animation.

Recommended responsibilities:

- Keep a ref to the carousel viewport and an array/ref callback for slide elements where needed by the chosen Framer Motion architecture.
- Track `activeIndex` in React state.
- Track the last focused trigger and `isLightboxOpen` for modal behavior.
- Implement carousel movement with Framer Motion drag/gesture or motion-value controls, based on the research pass. The selected approach must keep one item centered, clamp movement to the available artwork range, and settle to the nearest item after a drag or programmatic navigation.
- Derive visual state from `activeIndex`: active slides use full opacity and a modest scale increase; all other slides use reduced opacity and a smaller scale. Animate these values with Framer Motion rather than CSS transitions driven by scroll state.
- Clicking an inactive slide uses the chosen Framer Motion navigation mechanism to animate that item into the center and does not open the modal.
- Clicking the active slide opens the lightbox for that artwork.
- Add previous/next icon buttons if they improve desktop and keyboard navigation. They should use existing icon conventions (`lucide-react`), have accessible labels, and be disabled at the ends.

## Carousel Layout and Motion

- The viewport should span the available content width while preserving the site’s existing max-width and horizontal padding conventions.
- Use a Framer Motion-driven horizontal track with stable slide positions and a clear center coordinate. Do not make CSS scroll snapping plus scroll-event-derived React state the primary carousel mechanism.
- Use stable slide sizing with responsive constraints: one dominant slide on narrow screens, with neighboring slides partially visible as a navigation cue; progressively more side preview space at larger widths without allowing the artwork to become too small to inspect.
- Use `aspect-ratio` or a fixed responsive height wrapper so images do not cause layout shifts. Use `next/image` with `fill`, `object-contain`, and an accurate `sizes` value.
- Apply Framer Motion `animate`/variants or motion-value transforms to `opacity` and `scale`, with the active item slightly larger. Keep the scale difference restrained so the centered artwork remains the clear focus without overlapping adjacent slides.
- Respect `prefers-reduced-motion` through the researched Framer Motion API: reduce or disable drag settling, opacity/scale transitions, and lightbox entrance/exit animation as appropriate while preserving functionality.
- Avoid adding decorative gradients, shadows, or new colors. The artwork and the existing warm neutral theme should carry the visual emphasis.

## Artwork Metadata

- Use the Sanity title as the visible label when present; provide a neutral fallback such as `Untitled artwork` when absent.
- Use `image.alt` for `next/image` when available. If the image has no alt text, use the title fallback, and ensure decorative behavior is not incorrectly implied for artwork that is the primary content.
- Display the date only when present and format it consistently in the existing locale/style. Avoid rendering an empty date element.
- Preserve an optional caption in the lightbox if the Sanity image provides one.
- Build image URLs through `urlForImage(artwork.image)` and request an appropriate width/quality for the current context. The lightbox may request a larger image than the carousel.

## Inspection Mode / Lightbox

Implement a client-side full-screen dialog, either with an existing local primitive or a small semantic dialog implementation if no suitable primitive exists. Use Framer Motion presence and focus-safe entrance/exit animation after validating the correct API in the research pass.

Required behavior:

- Open only when the currently focused center slide is clicked.
- Render the selected artwork at a larger size with `object-contain`, title, date, and optional caption.
- Use a theme-token surface/background and a visible border or focus treatment from the existing tokens; do not invent a modal palette.
- Provide a clearly labeled close button with a familiar close icon.
- Close on Escape and, if included, backdrop click. Do not close when clicking the artwork itself.
- Trap focus while open, return focus to the slide that opened the dialog, and prevent the page behind the modal from scrolling.
- Mark the dialog with an accessible name, and make every interactive control keyboard reachable.
- Support previous/next artwork navigation within the lightbox if it can be added without duplicating carousel state. Keep the active carousel index synchronized when changing the selected item.

## Empty and Failure States

- If Sanity returns no usable artwork, render an intentional empty state using the existing page typography and semantic muted tokens instead of an empty carousel.
- If all returned documents lack images, use the same empty-state path and make the issue clear enough for Studio authors without exposing implementation details.
- Keep the page render stable while the client component hydrates; the initial active slide should be index zero.

## Theme and Accessibility Constraints

- Use `bg-background`, `text-foreground`, `text-foreground-muted`, `border-border`, `bg-surface`, `text-primary-foreground`, and related mapped tokens from `app/theme.css` as appropriate.
- Do not add one-off hex values, gradients, large shadows, or rounded card treatments. Existing geometry tokens prefer near-square corners.
- Keep type within the established IBM Plex Sans/Mono system loaded by `app/layout.tsx`; do not add a new font or viewport-scaled type.
- Provide visible focus styles using the existing ring token.
- Use semantic headings, a labeled carousel region, and meaningful button labels. Do not rely on opacity or color alone to communicate the active item; include an active state in accessible text or selection semantics where appropriate.
- Ensure touch targets are approximately 44 by 44 CSS pixels where practical.

## Suggested File Changes

1. Modify `app/artwork/page.tsx` to pass `sanityFetch(...).data` into the client UI and remove the placeholder.
2. Add `components/artwork-carousel.tsx` for the scroll-snap carousel, active-item state, click navigation, and lightbox orchestration.
3. Update `package.json` and the lockfile by installing the compatible `framer-motion` dependency through the repository package manager.
4. Add a small scoped style block or update `app/globals.css` only if layout styles cannot be expressed cleanly with existing utilities. Prefer component-local class names or existing utilities and keep any new CSS token-based.
5. Do not modify the Sanity query unless the implementation proves that an additional projected field is needed. The current query already supplies the artwork data required by the brief.
6. Do not modify `sanity.types.ts` manually; regenerate it only if the query changes and the repository has an established generation command.

## Validation Checklist

### Functional

- Run `npm run lint`.
- Run `npm run build` to verify the server/client boundary, generated Sanity query types, and Next.js route compilation.
- Verify the installed Framer Motion package resolves correctly in the Next.js production build and produces no hydration warnings.
- With populated Sanity artwork data, confirm the newest dated document is the first slide.
- Confirm the center slide is opaque and scaled up, while side slides are dimmed and smaller.
- Drag or click navigation to move a side slide smoothly into the center and verify it becomes active without opening the lightbox.
- Click the active center slide and verify the full-screen dialog opens with the correct image and metadata.
- Confirm Escape, close control, focus restoration, and background scroll locking.
- Confirm the empty state when the query returns no documents or documents without images.

### Responsive and accessibility review

Check approximately 375px, 768px, and 1440px widths. Verify there is no horizontal page overflow outside the intended carousel, no clipped titles or controls, stable image dimensions, visible neighboring slides, and no overlap between metadata and controls. Test keyboard-only navigation, screen-reader labels, focus visibility, and reduced-motion behavior.

## Definition of Done

The Artwork route renders real Sanity artwork instead of `PagePlaceholder`; the Framer Motion carousel settles each artwork into center focus; active/inactive visual states are obvious and token-compliant; inactive and active click behavior is distinct; the lightbox supports detailed inspection accessibly; incomplete data has a deliberate fallback; the agent completed the required Framer Motion research first; and lint/build plus the responsive/accessibility checks pass.