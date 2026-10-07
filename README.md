# Alvaro Matzumura

Portfolio site (Next.js App Router + Tailwind), recreated from the Framer original.

```bash
npm install
npm run dev
```

## Content

Everything editable lives in `lib/content.ts`:

- **photo** — `photos` array. Each `null` image is an empty frame in the mosaic. Drop a file in `public/img/`, import it, and replace the `null`.
- **motion** — `motionProjects` (title, description, video, poster, optional link).
- **home** — `homeVideo`.

Videos live in `public/video/`, posters and images in `public/img/`.

## Deploy

Push to a Git repo and import it in Vercel; no configuration needed. `metadataBase` uses `VERCEL_PROJECT_PRODUCTION_URL` automatically.
