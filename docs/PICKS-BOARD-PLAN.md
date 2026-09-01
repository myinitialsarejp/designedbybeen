# Picks Board Implementation Plan

## Agent Behavior Instructions
Act like a senior level engineer with an eye for product design.  

When writing code, keep it as human-readable as possible.  Simplicity is king.  

Follow Responsive UI instructions found in this repo.

## Goal

Replace the Picks placeholder with a curated, Pinterest-style image board. Each Pick is a clickable image that opens its associated destination. A separate, accessible about control reveals the Pick title without navigating away.

The board should feel like a flat, editorial pinboard within the existing Warm Utilitarian Chic system: pale plaster page background, beige surfaces where needed, taupe 1px borders, Pantone `#572932` only for meaningful interaction/focus, and no shadows.

## Implemented Frontend Scope

- The public Picks page fetches and renders the existing `pick` document type using its confirmed `title`, `link`, and `image` fields.
- Every rendered Pick image is an external link to that Pick's `link` value. The separate Info Button opens details without navigating.
- The responsive CSS-column board, touch-friendly controlled Hover Card, and `pick` cache tag are implemented.
- The external Sanity Studio still needs optional Pick alt/caption fields and the webhook filter update before that editorial metadata and automatic production refresh are available.

## Design Decisions

- Use a CSS column layout for a masonry-like visual rhythm. It creates varied image heights without client-side measurement, JavaScript layout libraries, or layout shifts.
- Keep each Pick image as its own link. The title disclosure is a neighboring button, not an overlaying link, so keyboard and touch interactions remain unambiguous.
- Use shadcn `HoverCard` with the existing shadcn `Button` as its trigger. The Button uses `variant="outline"`, `size="icon"`, and Lucide's `Info` icon.
- The Hover Card contains the title and optional caption in a bordered `bg-popover` surface. It has no shadow and does not cover the Pick image.
- Use a small client component for each Pick's controlled Hover Card state. The page itself remains a Server Component and fetches content from Sanity.

## Content Model in Sanity

Use the existing `Pick` schema in the separate Sanity Studio project. Do not create a duplicate `pick` document type.

The existing schema has been inspected. It uses document type `pick` with `title`, `link`, and `image` fields. The frontend now uses `_createdAt` for ordering and the Pick title as temporary image alternative text because the current Pick schema has no dedicated alt or caption fields.

Confirm the existing schema supplies these concepts:

| Board requirement | Expected schema concept | Frontend use |
| --- | --- | --- |
| Label | Title or name | Hover Card title and accessible Button label |
| Image | Image or cover image | Clickable board image |
| Destination | URL, link, or source URL | External image link target |
| Ordering | Published date, date, or explicit order | Query sorting |
| Alternative text | Alt text or image description | `next/image` alternative text |
| Detail | Caption, description, or notes | Optional Hover Card body |

If the existing schema does not expose one of these required concepts, extend the existing `Pick` schema with the missing field rather than introducing another document type.

Preserve or add only the validation required for the board:

- Require the existing title, image, and destination fields before publication.
- Validate the existing destination field as an absolute `https` URL.
- Provide helper text for the existing image-alt field that asks for a meaningful visual description.

## Data Fetching and Revalidation

1. Add `PICKS_QUERY` in `lib/sanity/queries.ts`, using the confirmed schema fields and image dimensions for layout reservation:

   ```groq
   *[_type == "pick" && defined(link) && defined(image.asset)] | order(_createdAt desc){
     _id,
     title,
     link,
     image,
     "width": image.asset->metadata.dimensions.width,
     "height": image.asset->metadata.dimensions.height
   }
   ```

2. Update `app/picks/page.tsx` to call `sanityFetch` with:

   ```ts
   tags: ["pick"],
   stega: false,
   ```

3. Extend `app/api/revalidate/sanity/route.ts`:
   - Allow `_type: "pick"` in the webhook payload.
   - Return `["pick"]` for Pick events.

4. Extend the Sanity webhook filter:

   ```groq
   _type in ["project", "journal", "siteSettings", "pick"]
   ```

The existing webhook projection is sufficient because Picks only need the broad `pick` cache tag.

## Component Structure

Install shadcn Hover Card before implementation:

```powershell
npx shadcn@latest add hover-card
```

Create `components/picks-board.tsx` as a Server Component and `components/pick-card.tsx` as a small client component.

```text
app/picks/page.tsx
  -> PicksBoard (renders the responsive board)
      -> PickCard (owns one controlled Hover Card state)
```

### `PickCard` behavior

Props:

```ts
type PickCardProps = {
  id: string;
  title: string;
  image: SanityImageSource;
  url: string;
  alt: string;
  caption?: string | null;
};
```

Structure:

1. Outer `<article>` uses a 1px `border-border` and `bg-card`; it must have no shadow.
2. Create a `relative overflow-hidden` image frame. The image link fills this frame; it opens the external Pick URL with `target="_blank"` and `rel="noopener noreferrer"`.
3. Use `next/image` with an aspect ratio based on the image metadata when available. If dimensions are not queried initially, use the original dimensions in the generated Sanity URL and let the image determine height.
4. Add `HoverCard`, `HoverCardTrigger`, and `HoverCardContent` inside the image frame, as a sibling of the image link. The trigger must not be nested inside the external image link.
5. Overlay the trigger in the image frame's top-right corner with `absolute right-2 top-2 z-10`. Render it with `HoverCardTrigger asChild`; its child is a shadcn `Button` with `variant="outline"`, `size="icon"`, `className="size-11"`, and an `Info` icon from `lucide-react`.
6. Give the trigger an explicit state-aware label, for example `Show details for [title]` or `Hide details for [title]`.
7. Control the Hover Card's `open` and `onOpenChange` state inside `PickCard`. This allows hover and focus to work on desktop and tap/click to work reliably on touch screens.
8. Render the title and optional caption in `HoverCardContent` with `side="bottom"` and `align="end"`. It must use `border border-border bg-popover shadow-none`, a maximum readable width, and no radius greater than the theme maximum.
9. Do not use a hover-only disclosure. The Info Button must toggle the controlled state on click, and focus must make the content available to keyboard users.

Use the normal `Button` styles and theme tokens. Do not create a separate custom icon-button abstraction.

## Layout and Responsive Rules

Follow `.github/instructions/responsive-ui.instructions.md` throughout.

### Board container

Use the existing fluid page container:

```tsx
<section className="mx-auto w-full max-w-screen-2xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
```

### Mobile-first masonry grid

Use CSS columns rather than fixed-width tiles:

```tsx
<div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
```

Every Pick wrapper needs `mb-4 break-inside-avoid` so a card does not split between columns.

This produces:

- 1 column at narrow mobile widths
- 2 columns from 640px
- 3 columns from 1024px
- 4 columns from 1280px

Do not use JavaScript to calculate column count. The CSS layout is stable, performs well, and progressively adapts to the available width.

### Images

- Use `next/image` and provide a precise `sizes` value for the four column widths.
- Keep image wrappers `relative overflow-hidden`; do not give all images a uniform fixed aspect ratio, because varied height is central to the board concept.
- Use `object-cover` only when an explicit aspect ratio/crop is chosen. Otherwise preserve the source image's natural ratio.
- Add a defined image width/height or image metadata so the browser reserves space and avoids cumulative layout shift.
- Ensure all external URLs in Sanity image data are handled by `urlForImage()` and remain covered by the existing `cdn.sanity.io` remote image pattern.

### Touch, keyboard, and accessibility

- Keep the Hover Card trigger Button at least `size-11` (44px) even if the shadcn `icon` size is smaller by default.
- Provide visible `focus-visible:ring-2 focus-visible:ring-ring` styling. The existing Pantone ring token is the appropriate focus color.
- Use a real `<a>` for destinations and the shadcn Button for the Hover Card trigger; never use `onClick` on generic `div` elements.
- Configure the Hover Card with controlled state so the Info Button works on touch screens. Hover is an enhancement, not the only way to reveal text.
- Use an informative `alt` value from Sanity; fall back to the Pick title only if no descriptive alt text has been provided.
- Title and caption must wrap normally inside `HoverCardContent` with `min-w-0` as needed; do not truncate content.

## Empty and Error States

- If no Picks exist, render a concise empty state inside the existing page heading. Do not show placeholder tiles once the content-backed board is implemented.
- The empty state should direct editors through the CMS workflow only if that instruction is appropriate for the public site; otherwise use neutral copy such as `New picks will appear here.`
- If a Pick is missing image or URL despite schema validation, omit it from the query so the board does not render a broken interactive tile.

## Implementation Order

1. Inspect the existing `Pick` schema and note its exact document type and field names.
2. Add missing fields to that existing schema only when the board cannot use an equivalent existing field, then deploy the schema update if required.
3. Add the query using the confirmed field names and regenerate `sanity.types.ts` with Sanity TypeGen.
4. Extend the webhook route and Sanity webhook filter using the existing Pick document type name.
5. Add shadcn Hover Card, then create `PickCard` and `PicksBoard` components.
6. Replace the `PagePlaceholder` use in `app/picks/page.tsx` with a server-fetched board.
7. Add a few representative Picks with portrait, landscape, and square images.
8. Test disclosure controls, external links, and empty state.
9. Publish, confirm the webhook returns `200`, and verify a newly published Pick appears without a website redeploy.

## Validation Checklist

- [ ] `npm run build` succeeds.
- [ ] At 375px: one column, no horizontal scroll, Info Button remains a 44px target, and its Hover Card content fits within the viewport.
- [ ] At 768px: two columns with even gaps and no clipped content.
- [ ] At 1440px: three or four columns use the available width without excessive side whitespace.
- [ ] Keyboard: Tab reaches every image link and Info Button in a predictable order; Enter/Space opens and closes the Hover Card.
- [ ] Pointer: hover and pointer exit behave correctly on desktop; tap/click toggles the Hover Card on a touch device.
- [ ] Screen reader: image links announce their destination/context; Info Buttons announce that they reveal details for the corresponding Pick.
- [ ] Images reserve layout space and do not shift the board noticeably as they load.
- [ ] The board has no `shadow-*` classes and no radius greater than the theme's 4px maximum.
- [ ] A published Pick appears after the Sanity webhook succeeds, without a frontend redeploy.
