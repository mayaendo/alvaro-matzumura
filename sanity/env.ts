// Public identifiers (not secrets: the project ID is in every image URL).
// Env vars override them, e.g. to point a preview at another dataset.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "pdexi3h0";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = "2026-10-01";

export const sanityConfigured = projectId !== "";
