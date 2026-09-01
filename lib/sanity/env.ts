export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  process.env.NEXT_SANITY_PROJECT_ID!;
export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  process.env.NEXT_SANITY_DATASET!;
export const apiVersion = "2026-08-30"; // keep hard-coded, update periodically
