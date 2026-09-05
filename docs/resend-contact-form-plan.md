# Resend Contact Form Integration Plan

Wire [Resend](https://resend.com) into the contact form so that submissions send an email. A single Route Handler is the only server endpoint involved.

## Goals

- One route (`POST /api/contact`) that sends an email via Resend.
- The existing [`ContactForm`](../components/contact-form.tsx) posts to that route and reflects success/error/loading states to the user.
- Keep the current honeypot spam protection.
- Validate input on the server before sending.

## Assumptions

- `RESEND_API_KEY` already exists in `.env.local` (confirmed).
- Next.js 16 App Router; route handlers live under `app/api/**/route.ts` (matches the existing `app/api/revalidate/sanity/route.ts` convention).
- Node runtime (default) — the Resend SDK runs server-side only, so the API key is never exposed to the client.

## Steps

### 1. Add the dependency

- Install `resend` (official SDK).

### 2. Environment configuration

Add two configuration values (documented, read from `process.env`):

- `RESEND_API_KEY` — already present.
- `CONTACT_TO_EMAIL` — destination inbox that receives contact submissions.
- `CONTACT_FROM_EMAIL` — verified Resend sender (e.g. `Designed By Been <contact@yourdomain.com>`). Until a domain is verified, Resend's `onboarding@resend.dev` can be used for testing.

The route returns a clear 500 error if required env vars are missing (mirrors the pattern in the Sanity revalidate route).

### 3. Create the route handler — `app/api/contact/route.ts`

- `export async function POST(request: Request)`.
- Parse JSON body: `email`, `subject`, `message`, and honeypot `website`.
- Server-side validation:
  - Honeypot `website` present → respond `200` silently (pretend success, drop the message).
  - Required fields present, `email` well-formed, reasonable length limits.
  - On invalid input → `400` with a field-level error payload.
- Send via Resend:
  - `from`: `CONTACT_FROM_EMAIL`
  - `to`: `CONTACT_TO_EMAIL`
  - `replyTo`: submitter's `email`
  - `subject`: `Contact form: <subject>`
  - `text`/`html`: formatted message including the submitter's email.
- Map Resend errors to a `502`/`500` JSON response; success → `200 { ok: true }`.
- No caching (route handlers are uncached by default; `POST` is never cached).

### 4. Wire up `components/contact-form.tsx`

- Keep it a client component.
- Add local state: `status` (`idle | submitting | success | error`) and an error message.
- On submit: `preventDefault`, keep the honeypot early-return, build a JSON body, `fetch("/api/contact", { method: "POST" })`.
- UI feedback:
  - Disable the submit button while submitting; show "Sending…".
  - Show an accessible success message (`role="status"`) and reset the form on success.
  - Show an accessible error message (`role="alert"`) on failure.
- Preserve existing styling, labels, and accessibility.

### 5. Verify

- `npm run lint` and a type check/build to confirm no errors.
- Manual: submit the form, confirm the email arrives and UI states behave.

## Out of scope

- Rate limiting / CAPTCHA (honeypot only, as today).
- Storing submissions in a database.
- Multiple email routes or templates beyond the single contact email.

## Files changed

- `package.json` — add `resend`.
- `app/api/contact/route.ts` — new route handler (the one route).
- `components/contact-form.tsx` — submit to the route + status UI.
- `.env.local` — add `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` (values provided by the user).
