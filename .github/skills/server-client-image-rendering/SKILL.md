---
name: server-client-image-rendering
description: "Use when fixing broken image icons, missing remote images, Sanity image URLs, Next.js Image failures, hydration differences, or server-versus-client rendering issues in this repository."
---

# Server-Client Image Rendering

Use this workflow when an image renders as a broken icon, disappears after hydration, or works in one page but not another.

## Root-Cause Checklist

1. Identify the exact `src` value in the browser and in the server-rendered markup.
2. Confirm the source is a real URL, not a Sanity image object, undefined value, empty string, stale local filename, or client-only computed value.
3. Check whether the image URL is being constructed in a server component or in a client component.
4. Check `next.config.ts` for an allowed `remotePatterns` entry when using `next/image` with remote assets.
5. Check that the referenced local file exists under `public/` and that casing and extension match exactly.
6. Check the image query and generated types for nullable or missing `image.asset` values.

## Repository Pattern

For Sanity-backed images:

- Fetch and filter Sanity documents in the server route or server component.
- Build the URL with the shared `urlForImage()` helper on the server.
- Pass a plain, serializable `imageUrl` string plus metadata to the client component.
- Let the client component handle only interaction state and presentation.
- Use `next/image` with stable `width`/`height`, or a positioned `fill` image inside a wrapper with a stable aspect ratio.
- Use the existing image patterns in `components/project-grid.tsx` and `components/picks-board.tsx` as the baseline.

The verified page-level pattern is:

- Portfolio category pages fetch projects in the server page and pass the typed results to the server-rendered `ProjectGrid`.
- Picks fetch documents in the server page and pass them to the server-rendered `PicksBoard`, which resolves URLs before rendering `PickCard`.
- The project detail page resolves associated pick URLs on the server before passing plain preview props to the client `ProjectPicksCarousel`.
- Artwork filters valid assets and resolves URLs on the server before passing plain preview props to its client motion carousel.

Keep these boundaries equivalent. A client component may own interaction state, but it should not be responsible for turning a Sanity image object into a URL or for repairing a missing image after hydration.

Example server shaping:

```tsx
const items = documents
  .filter((document) => document.image?.asset)
  .map((document) => ({
    id: document._id,
    title: document.title,
    imageUrl: urlForImage(document.image).width(1600).url(),
  }));

return <ClientGallery items={items} />;
```

Do not pass a Sanity image object to a client component when URL construction can happen on the server. Do not construct a URL from browser-only state unless the image genuinely depends on an interaction.

## Client Component Rules

- Define a small prop type containing stable strings and metadata rather than importing a large generated Sanity document shape unnecessarily.
- Never render `src=""`; filter invalid documents before rendering or render an intentional fallback.
- Keep the initial client render deterministic so it matches the server output.
- Do not use a client effect to repair an image URL that should have been available during server rendering.
- When using animated image components, animate opacity and transform only; keep the `src` stable during the animation.

## Local Asset Rules

- Verify every local `src` against `public/` before changing component logic.
- Prefer an existing asset with the exact filename rather than adding a duplicate.
- Treat extension and casing as significant: `/artworkMoneyShot.jpeg` is not `/artwork.jpeg`.
- Keep `next/image` remote configuration limited to the domains actually used by the app.

## Validation

After the smallest fix:

1. Run `get_errors` for every changed TypeScript file.
2. Run `npm run lint`.
3. Run `npm run build` to catch server/client serialization, image configuration, and hydration issues.
4. Confirm every Sanity image guard checks `image?.asset` before URL generation or `next/image` rendering.
5. Open the affected route and inspect the rendered `img` source and browser console for hydration warnings.
6. Check approximately 375px, 768px, and 1440px widths for clipping and layout shifts.
7. Test both populated and empty/null-image data paths.

Report unrelated lint warnings separately. Do not repair unrelated components while diagnosing the image boundary unless they block validation.
