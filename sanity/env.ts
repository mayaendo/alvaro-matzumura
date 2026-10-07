// Public identifiers (not secrets). Set them in Vercel/.env.local once the
// Sanity project exists; until then the site renders the bundled content.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = "2026-10-01";

export const sanityConfigured = projectId !== "";
