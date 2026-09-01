# Sanity Webhook Revalidation Plan

## Goal

Refresh published Sanity content on the public Next.js site without manually redeploying after every Project or Journal update.

Use a signed Sanity webhook and Next.js tag-based cache revalidation. The site remains static and fast between updates while published changes refresh only affected routes.

Expose small, site-wide content through a hydrated React context so shared client components can read it without repeated client-side requests.

## Existing Integration

- Sanity queries are defined in `lib/sanity/queries.ts`.
- Content is loaded through `sanityFetch` from `lib/sanity/live.ts`.
- The root layout renders `SanityLive`.
- A root-level React provider has not been added yet.
- Project category pages are currently static and use one query per category.
- There are no `app/api/` route handlers yet.

## Cache Tag Contract

Use these tags consistently on all relevant Sanity fetches.

| Content type | Listing tags | Detail tag |
| --- | --- | --- |
| Project | `project`, `project-category:{category}` | `project:{slug}` |
| Journal | `journal` | `journal:{slug}` |

Examples:

- Updating the commercial project `bar-saint-bruno` invalidates `project`, `project:bar-saint-bruno`, and `project-category:commercial`.
- Updating the journal post `material-notes` invalidates `journal` and `journal:material-notes`.

## Implementation Steps

### 1. Define the shared context payload

Create a small shared-content payload for values used across multiple client components. Do not put all Project or Journal documents into React context: that would increase the initial JavaScript payload, duplicate route data, and make cache invalidation less precise.

Initial content should be limited to global information such as site settings, navigation, and social links:

```ts
type SanitySiteContent = {
  siteSettings: {
    title?: string;
    navigation?: Array<{ label: string; href: string }>;
    instagramUrl?: string;
    tiktokUrl?: string;
  } | null;
};
```

Add a `SITE_SETTINGS_QUERY` in `lib/sanity/queries.ts` and use a `site-settings` cache tag for its fetch. Define an empty fallback payload so the site can render before a corresponding Sanity document exists.

### 2. Add a root-level React provider

Create a client component at `context/sanity-content-provider.tsx`:

```text
"use client"
```

The component should:

1. Create `SanityContentContext` with `createContext`.
2. Accept `initialContent` supplied by the root layout.
3. Initialize provider state from `initialContent` with `useState`.
4. Expose content plus a controlled `setContent` or `refreshContent` method through a `useSanityContent()` hook.
5. Throw a clear error when `useSanityContent()` is used outside the provider.

Do not store read tokens in the provider or issue authenticated Sanity API requests from the browser. The provider must receive only public, published content.

### 3. Fetch shared content in the root layout

Keep `app/layout.tsx` as a Server Component. Fetch site settings there with `sanityFetch` and tag the request with `site-settings`:

```ts
const { data: siteSettings } = await sanityFetch({
  query: SITE_SETTINGS_QUERY,
  tags: ["site-settings"],
});
```

Wrap the existing application shell with the provider:

```tsx
<body>
  <SanityContentProvider initialContent={{ siteSettings }}>
    <SiteHeader />
    <main>{children}</main>
    <SiteFooter />
  </SanityContentProvider>
  <SanityLive />
</body>
```

This fulfills the site-load requirement without moving content fetching into the browser: the content is fetched on the initial server render, serialized into the provider, and immediately available to any client component after hydration.

### 4. Consume context only in shared client UI

Update client components such as `components/site-header.tsx` to read global values from `useSanityContent()` with a local fallback to `lib/site.ts` until the `siteSettings` document is populated.

Keep project grids, Project detail pages, Journal listings, and Journal detail pages fetching their own route-specific content in Server Components. React context must not become the source of truth for route data.

### 5. Confirm tagged `sanityFetch` support

Confirm the installed `next-sanity` version supports `tags` in `sanityFetch` options. If it does not, add a server-only helper around `client.fetch()` that accepts Next.js cache tags.

Expected pattern:

```ts
const { data: projects } = await sanityFetch({
  query: PROJECTS_BY_CATEGORY_QUERY,
  params: { category: "commercial" },
  tags: ["project", "project-category:commercial"],
});
```

### 6. Add tags to existing page fetches

Update only the data-loading calls, not the GROQ query definitions.

| Route | Required tags |
| --- | --- |
| `/portfolio/residential` | `project`, `project-category:residential` |
| `/portfolio/commercial` | `project`, `project-category:commercial` |
| `/portfolio/academic` | `project`, `project-category:academic` |
| `/portfolio/project/[slug]` | `project`, `project:{slug}` |
| `/journal` | `journal` |
| `/journal/[slug]` | `journal`, `journal:{slug}` |

### 7. Add the signed revalidation route

Create `app/api/revalidate/sanity/route.ts`.

The route handler must:

1. Support `POST` only.
2. Require `SANITY_REVALIDATE_SECRET` at runtime.
3. Validate the webhook signature with `parseBody` from `next-sanity/webhook`.
4. Request Sanity's CDN delay option by passing `true` to `parseBody`.
5. Accept only `project` and `journal` document types.
6. Construct allowed tags from the validated payload instead of accepting arbitrary tags.
7. Call `revalidateTag(tag, "max")` for each tag.
8. Return a JSON response listing invalidated tags.

Extend the accepted payload type with the site settings document:

```ts
type SanityWebhookPayload = {
  _type: "project" | "journal" | "siteSettings";
  slug?: string;
  category?: "residential" | "commercial" | "academic";
};
```

Tag construction:

```ts
function getTags(payload: SanityWebhookPayload) {
  if (payload._type === "siteSettings") {
    return ["site-settings"];
  }

  if (payload._type === "journal") {
    return ["journal", ...(payload.slug ? [`journal:${payload.slug}`] : [])];
  }

  return [
    "project",
    ...(payload.slug ? [`project:${payload.slug}`] : []),
    ...(payload.category ? [`project-category:${payload.category}`] : []),
  ];
}
```

The route should return `401` for an invalid signature, `400` for an unsupported or malformed payload, and `500` only for server configuration or unexpected failures.

### 8. Generate and store the shared secret

Generate a high-entropy secret locally:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Add it to `.env.local`:

```env
SANITY_REVALIDATE_SECRET=generated-value
```

Add the identical value to the production deployment environment. For Vercel, configure it for both Production and Preview if preview deployments should receive content updates.

Never commit the secret or prefix it with `NEXT_PUBLIC_`.

### 9. Configure the Sanity webhook

In Sanity Manage, create a webhook with these settings:

| Setting | Value |
| --- | --- |
| URL | `https://your-public-domain.com/api/revalidate/sanity` |
| Secret | Same value as `SANITY_REVALIDATE_SECRET` |
| Trigger | Published document create/update/delete events |
| Include drafts | Disabled |
| Filter | `_type in ["project", "journal", "siteSettings"]` |
| Projection | `{_type, "slug": slug.current, category}` |

The production webhook must point only to the deployed public site. Use a separate temporary webhook and a secure tunnel URL for local testing.

### 10. Test locally

1. Start the Next.js app with `npm run dev`.
2. Expose it through a secure HTTPS tunnel.
3. Configure a temporary Sanity webhook with the tunnel URL.
4. Publish an update to a Project cover image.
5. Verify the appropriate category grid updates.
6. Publish a Journal update and verify both its list and detail route update.
7. Publish an update to site settings and verify the header or footer receives the revised shared content after the root layout is re-rendered.
8. Submit an invalidly signed request and verify the endpoint returns `401`.
9. Confirm logs and response bodies never contain the shared secret.

### 11. Test in production

1. Deploy the route and tagged fetches once.
2. Add `SANITY_REVALIDATE_SECRET` to the deployment host.
3. Configure the production Sanity webhook.
4. Publish a Project cover-image update.
5. Confirm the webhook delivery log records a `200` response.
6. Check the matching category route in a private browser window.
7. Publish a Journal change and check its listing and detail route.
8. Publish a site-settings change and confirm the header or footer updates.
9. Confirm changes appear without deploying the public website again.

## Security Requirements

- The webhook must validate the Sanity signature before revalidating any tag.
- Do not revalidate arbitrary client-supplied paths or tags.
- Store `SANITY_REVALIDATE_SECRET` only in `.env.local`, the deployment host's secret store, and Sanity's webhook configuration.
- Keep `SANITY_API_READ_TOKEN` server-only if it is added later for draft mode or visual editing.
- Keep the React context payload public and intentionally small. Do not put unpublished documents, tokens, or full content collections in it.

## Notes

- No Sanity read token is required to revalidate publicly readable published content.
- The existing `useCdn: true` setting is appropriate for runtime performance. Delayed webhook-body verification prevents stale CDN content from being re-cached immediately after a publish.
- The provider is initialized with server-fetched data on the first request. It does not need a browser `useEffect` fetch to meet the site-load requirement; avoiding that extra request prevents a flash of stale or empty shared content.
- Future `generateStaticParams()` for project and journal routes will remain compatible with this revalidation plan.
