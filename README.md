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

The Sanity project (`pdexi3h0`, dataset `production`) is set in
`sanity/env.ts`. While a section has not been created in the Studio, the site
renders the bundled fallback in `lib/content.ts` with the media in `public/`.

- **Fotos** — the mosaic always shows at least 13 frames; photos fill the first
  slots and the rest stay as empty frames (`FRAME_RATIOS` in `lib/content.ts`).
- **Motion** — each project has a short looping clip (uploaded to Sanity) and
  an optional Vimeo link for the full cut, which opens in a popup.

## Sanity setup

Done once; kept here for reference.

- Studio origins allowed (CORS, with credentials): `http://localhost:3000`,
  `http://localhost:3005`, `https://alvaro-matzumura.vercel.app`. Add any new
  domain with `npx sanity cors add https://<domain> --credentials`.
- Initial content was uploaded with
  `npx sanity exec scripts/seed-sanity.ts --with-user-token` (it skips
  sections that already exist).
- Editors are invited in sanity.io/manage → Members (role **Editor**).

## Deploy

Vercel, no extra configuration.

Local builds skip Turbopack's disk cache (`next.config.ts`): on the exFAT
drive this project lives on, macOS `._*` files corrupt it.
