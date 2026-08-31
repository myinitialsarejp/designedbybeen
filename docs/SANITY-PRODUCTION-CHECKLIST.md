# Sanity Production Checklist

Complete this checklist after deploying the website code that adds `/api/revalidate/sanity`.

## Secrets and Deployment Host

- [ ] Generate a webhook secret:

  ```powershell
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

- [ ] Add the secret to local development in `.env.local`:

  ```env
  SANITY_REVALIDATE_SECRET=generated-value
  ```

- [ ] Add the same `SANITY_REVALIDATE_SECRET` value to the public site's production environment variables.
- [ ] Add the secret to preview environment variables if preview deployments should receive Sanity updates.
- [ ] Confirm `SANITY_REVALIDATE_SECRET` is not committed and is not named with a `NEXT_PUBLIC_` prefix.
- [ ] Deploy the website so `https://your-domain.com/api/revalidate/sanity` is publicly available.

## Sanity Webhook

In Sanity Manage, open the project that provides content for this website and create a webhook.

- [ ] Set the webhook URL to `https://your-domain.com/api/revalidate/sanity`.
- [ ] Set the webhook secret to the exact `SANITY_REVALIDATE_SECRET` value stored by the deployment host.
- [ ] Enable published document create, update, and delete events.
- [ ] Disable draft events.
- [ ] Add this filter:

  ```groq
  _type in ["project", "journal", "siteSettings"]
  ```

- [ ] Add this projection:

  ```groq
  {_type, "slug": slug.current, category}
  ```

- [ ] Save the webhook and keep its delivery log available during verification.

## Site Settings Content Type

The website safely falls back to its local configuration until a `siteSettings` document is available. To manage the shared site title through Sanity, add this schema to the separate Sanity Studio project.

- [ ] Create a `siteSettings` document type with these fields:
  - `title` (string)
  - `instagramUrl` (URL)
  - `tiktokUrl` (URL)
- [ ] Deploy the Studio schema.
- [ ] Create and publish one `siteSettings` document.
- [ ] Publish a title change and verify the website header updates without a website redeploy.

## Local Verification

- [ ] Run `npm run dev`.
- [ ] Expose the local app through a secure HTTPS tunnel.
- [ ] Create a temporary Sanity webhook using the tunnel URL and the same local secret.
- [ ] Publish a Project cover-image update.
- [ ] Confirm the appropriate Portfolio category grid displays the new image.
- [ ] Publish a Journal update and confirm its listing and detail routes refresh.
- [ ] Send an invalidly signed request and confirm the route responds with `401`.

## Production Verification

- [ ] Publish a Project cover-image update in Sanity.
- [ ] Confirm the Sanity webhook delivery log reports `200`.
- [ ] Open the affected Portfolio category page in a private browser window.
- [ ] Confirm the updated cover image appears without redeploying the website.
- [ ] Publish a Journal update and confirm both its listing and detail page refresh.
- [ ] Confirm site-settings changes update the header after publication.
- [ ] Check hosting logs for unexpected webhook errors.
