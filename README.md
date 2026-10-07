# Alvaro Matzumura

Portfolio site (Next.js App Router + Tailwind) with an embedded Sanity Studio
at `/studio`, so the content can be edited without touching code.

```bash
npm install
npm run dev
```

## Content

Content comes from Sanity: three fixed sections, **Inicio**, **Fotos** and
**Motion**, edited at `/studio` (`sanity/schemas.ts`). Published changes reach
the site within about a minute (pages are cached with `cacheLife("minutes")`
in `lib/sanity.ts`); no redeploy needed.

Until `NEXT_PUBLIC_SANITY_PROJECT_ID` is set, or while a section has not been
created in the Studio, the site renders the bundled fallback in
`lib/content.ts` with the media in `public/`.

- **Fotos** — the mosaic always shows at least 13 frames; photos fill the first
  slots and the rest stay as empty frames (`FRAME_RATIOS` in `lib/content.ts`).
- **Motion** — each project has a short looping clip (uploaded to Sanity) and
  an optional Vimeo link for the full cut, which opens in a popup.

## Connecting Sanity (one time)

1. `npx sanity login`, then create the project:
   `npx sanity projects create "Alvaro Matzumura"` (or in sanity.io/manage).
2. Add to `.env.local` and to the Vercel project's environment variables:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=<project id>
   NEXT_PUBLIC_SANITY_DATASET=production
   ```
3. Create the dataset and allow the Studio's origins:
   ```bash
   npx sanity dataset create production --visibility public
   npx sanity cors add http://localhost:3000 --credentials
   npx sanity cors add https://<production domain> --credentials
   ```
4. Copy the current content into Sanity:
   `npx sanity exec scripts/seed-sanity.ts --with-user-token`
5. Invite the editor (Members → Invite, role **Editor**) in sanity.io/manage.

## Deploy

Vercel, no extra configuration besides the two env vars above.

Local builds skip Turbopack's disk cache (`next.config.ts`): on the exFAT
drive this project lives on, macOS `._*` files corrupt it.
