/**
 * One-off: upload the bundled media and create the Inicio / Fotos / Motion
 * documents, so the Studio starts with the current site content.
 * Existing documents are left untouched.
 *
 *   npx sanity exec scripts/seed-sanity.ts --with-user-token
 */
import { createReadStream } from "node:fs";
import { basename } from "node:path";
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-10-01" });

// Mirrors the bundled content in lib/content.ts.
const DESCRIPTION =
  "A cinematic portrait of movement, landscape, and everyday life in Ayaviri, Puno. A visual exploration of the journey through the Andean landscape, created for Baika.";

const photos = [
  {
    file: "public/img/photo-01.jpg",
    alt: "Puesto callejero cubierto con cortinas de plástico transparente",
  },
];

const projects = [
  { slug: "la-caminata", title: "la caminata", vimeo: "https://vimeo.com/1154904862" },
  { slug: "tokyo", title: "tokyo" },
  { slug: "almaura", title: "almaura" },
];

async function upload(kind: "image" | "file", path: string) {
  console.log(`  ↑ ${path}`);
  const asset = await client.assets.upload(kind, createReadStream(path), {
    filename: basename(path),
  });
  return { _type: kind, asset: { _type: "reference", _ref: asset._id } };
}

async function seed(id: string, build: () => Promise<Record<string, unknown>>) {
  if (await client.getDocument(id)) {
    console.log(`= ${id}: already exists, skipped`);
    return;
  }
  console.log(`+ ${id}`);
  await client.create({ _id: id, _type: id, ...(await build()) });
}

await seed("home", async () => ({
  video: await upload("file", "public/video/home.mp4"),
  poster: await upload("image", "public/img/posters/home.jpg"),
}));

await seed("photos", async () => ({
  items: await Promise.all(
    photos.map(async ({ file, alt }, i) => ({
      _key: `photo-${i}`,
      ...(await upload("image", file)),
      alt,
    })),
  ),
}));

await seed("motion", async () => ({
  projects: await Promise.all(
    projects.map(async ({ slug, title, vimeo }, i) => ({
      _key: `project-${i}`,
      _type: "project",
      title,
      description: DESCRIPTION,
      clip: await upload("file", `public/video/${slug}.mp4`),
      poster: await upload("image", `public/img/posters/${slug}.jpg`),
      ...(vimeo && { vimeo }),
    })),
  ),
}));

console.log("Done.");
