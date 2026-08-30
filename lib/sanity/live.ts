import { defineLive } from "next-sanity/live";

import { client } from "./client";

export const { sanityFetch, SanityLive } = defineLive({
  client: client.withConfig({ apiVersion: "2026-08-30" }),
  serverToken: process.env.SANITY_API_READ_TOKEN,
  browserToken: process.env.SANITY_API_READ_TOKEN,
  // Dataset is public; without a token only published content is fetched.
  ...(!process.env.SANITY_API_READ_TOKEN && {
    serverToken: false,
    browserToken: false,
  }),
});
