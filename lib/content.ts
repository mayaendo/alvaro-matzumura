import photo01 from "@/public/img/photo-01.jpg";

export const site = {
  name: "Alvaro Matzumura",
  description: "Alvaro Matzumura — photo & motion. Fotografía y video.",
};

export const nav = [
  { href: "/photo", label: "photo" },
  { href: "/motion", label: "motion" },
] as const;

/*
 * Content types shared by Sanity (lib/sanity.ts) and the bundled fallback
 * below, which the site uses until the Sanity project is connected.
 */

export type HomeVideo = { src: string; poster?: string };

/** Structurally compatible with a static image import. */
export type ImageSource = {
  src: string;
  width: number;
  height: number;
  blurDataURL?: string;
};

export type Photo = { image: ImageSource; alt: string };

/** A slot in the mosaic: a photo, or an empty frame of a given ratio. */
export type Frame = { image: ImageSource | null; alt: string; ratio: [number, number] };

const PORTRAIT_35MM: [number, number] = [152, 225];
const PORTRAIT: [number, number] = [2, 3];
const LANDSCAPE: [number, number] = [3, 2];

/**
 * The mosaic always shows at least 13 frames, with the same rhythm of
 * portrait and landscape ratios as the reference gallery. Photos fill the
 * first slots in order; the rest stay as empty frames.
 */
const FRAME_RATIOS = [
  PORTRAIT_35MM, LANDSCAPE, PORTRAIT_35MM, LANDSCAPE, LANDSCAPE, PORTRAIT_35MM,
  PORTRAIT, LANDSCAPE, LANDSCAPE, LANDSCAPE, PORTRAIT, LANDSCAPE, PORTRAIT,
];

export function toFrames(photos: Photo[]): Frame[] {
  const filled: Frame[] = photos.map(({ image, alt }) => ({
    image,
    alt,
    ratio: [image.width, image.height],
  }));
  const empty: Frame[] = FRAME_RATIOS.slice(photos.length).map((ratio) => ({
    image: null,
    alt: "",
    ratio,
  }));
  return [...filled, ...empty];
}

export const fallbackHome: HomeVideo = {
  src: "/video/home.mp4",
  poster: "/img/posters/home.jpg",
};

export const fallbackPhotos: Photo[] = [
  { image: photo01, alt: "Puesto callejero cubierto con cortinas de plástico transparente" },
];

export type MotionProject = {
  title: string;
  description: string;
  src: string;
  poster?: string;
  /** Full-length cut on Vimeo, played in a popup (the number in vimeo.com/…). */
  vimeoId?: string;
};

// The original reuses the "la caminata" description for all three projects.
export const fallbackMotion: MotionProject[] = [
  {
    title: "la caminata",
    description:
      "A cinematic portrait of movement, landscape, and everyday life in Ayaviri, Puno. A visual exploration of the journey through the Andean landscape, created for Baika.",
    src: "/video/la-caminata.mp4",
    poster: "/img/posters/la-caminata.jpg",
    vimeoId: "1154904862",
  },
  {
    title: "tokyo",
    description:
      "A cinematic portrait of movement, landscape, and everyday life in Ayaviri, Puno. A visual exploration of the journey through the Andean landscape, created for Baika.",
    src: "/video/tokyo.mp4",
    poster: "/img/posters/tokyo.jpg",
  },
  {
    title: "almaura",
    description:
      "A cinematic portrait of movement, landscape, and everyday life in Ayaviri, Puno. A visual exploration of the journey through the Andean landscape, created for Baika.",
    src: "/video/almaura.mp4",
    poster: "/img/posters/almaura.jpg",
  },
];
