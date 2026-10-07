import { cacheLife, cacheTag } from "next/cache";
import { createClient, defineQuery } from "next-sanity";
import { apiVersion, dataset, projectId, sanityConfigured } from "@/sanity/env";
import {
  fallbackHome,
  fallbackMotion,
  fallbackPhotos,
  type HomeVideo,
  type MotionProject,
  type Photo,
} from "./content";

const client = sanityConfigured
  ? createClient({ projectId, dataset, apiVersion, useCdn: true, perspective: "published" })
  : null;

/**
 * Fetch a section from Sanity. Results are cached and refreshed in the
 * background every minute, so published edits show up without a redeploy.
 */
async function fetchDoc(query: string): Promise<unknown> {
  "use cache";
  cacheLife("minutes");
  cacheTag("sanity");
  return client ? client.fetch(query) : null;
}

/**
 * Map a section's document, or use the bundled content until the project
 * is connected or the section has been created in the Studio.
 */
async function section<Doc, T>(query: string, fallback: T, map: (doc: Doc) => T): Promise<T> {
  const doc = (await fetchDoc(query)) as Doc | null;
  return doc ? map(doc) : fallback;
}

/** Smaller poster from Sanity's image CDN. */
const posterUrl = (url?: string | null) => (url ? `${url}?w=1600&fm=jpg&q=75` : undefined);

const vimeoIdFrom = (url?: string | null) => url?.match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1];

const HOME_QUERY = defineQuery(`*[_id == "home"][0]{
  "src": video.asset->url,
  "poster": poster.asset->url
}`);

export function getHome(): Promise<HomeVideo> {
  return section(HOME_QUERY, fallbackHome, (doc: { src?: string; poster?: string }) =>
    doc.src ? { src: doc.src, poster: posterUrl(doc.poster) } : fallbackHome,
  );
}

const PHOTOS_QUERY = defineQuery(`*[_id == "photos"][0]{
  "items": items[defined(asset)]{
    alt,
    "src": asset->url,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height,
    "lqip": asset->metadata.lqip
  }
}`);

type PhotoRow = { alt?: string; src: string; width: number; height: number; lqip?: string };

export function getPhotos(): Promise<Photo[]> {
  return section(PHOTOS_QUERY, fallbackPhotos, (doc: { items?: PhotoRow[] }) =>
    (doc.items ?? []).map(({ alt, src, width, height, lqip }) => ({
      alt: alt ?? "",
      image: { src, width, height, blurDataURL: lqip },
    })),
  );
}

const MOTION_QUERY = defineQuery(`*[_id == "motion"][0]{
  "projects": projects[defined(clip.asset)]{
    title,
    description,
    "src": clip.asset->url,
    "poster": poster.asset->url,
    vimeo
  }
}`);

type ProjectRow = {
  title: string;
  description?: string;
  src: string;
  poster?: string;
  vimeo?: string;
};

export function getMotion(): Promise<MotionProject[]> {
  return section(MOTION_QUERY, fallbackMotion, (doc: { projects?: ProjectRow[] }) =>
    (doc.projects ?? []).map(({ title, description, src, poster, vimeo }) => ({
      title,
      description: description ?? "",
      src,
      poster: posterUrl(poster),
      vimeoId: vimeoIdFrom(vimeo),
    })),
  );
}
