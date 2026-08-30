---
description: "Use when creating or modifying website pages, React components, layouts, Tailwind styles, or UI behavior. Covers responsive design, accessibility, and mobile/desktop validation."
applyTo: "**/*.{ts,tsx,css}"
---
# Responsive UI Guardrails

- Build mobile-first: write the narrow-screen layout as the base, then use Tailwind `sm:`, `md:`, `lg:`, and `xl:` modifiers only when the design needs more space.
- Use fluid page containers such as `mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8`; do not rely on fixed viewport-width layouts.
- Prevent overflow: constrain grids, long text, media, and controls with responsive sizing, wrapping, and `min-w-0` where flex or grid children contain text.
- Use responsive grid or flex layouts that collapse intentionally, for example `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`.
- Give controls stable, touch-friendly dimensions. Interactive targets should be at least 44 by 44 CSS pixels when practical.
- Use semantic HTML and preserve keyboard access, visible focus states, labels, and sufficient color contrast. Do not convey information by color alone.
- Use shadcn UI components and the semantic theme tokens in `app/theme.css` before creating custom controls or one-off colors.
- Make images responsive. Use `next/image` with `sizes`; for responsive media, prefer a fixed-aspect-ratio wrapper with `fill` and `object-cover` over hardcoded desktop dimensions.
- Do not scale type with viewport width. Use the shared type scale, readable line heights, and responsive layout changes instead.
- Design navigation for small screens from the start. Do not compress desktop navigation into a narrow viewport; use an accessible disclosure, Sheet, or Drawer at smaller breakpoints.
- Before completing a UI change, review it at approximately 375px, 768px, and 1440px wide. Check for clipping, overlap, horizontal scrolling, unreadable text, inaccessible controls, and layout shifts.
