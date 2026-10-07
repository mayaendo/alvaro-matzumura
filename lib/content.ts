import type { StaticImageData } from "next/image";
import photo01 from "@/public/img/photo-01.jpg";

export const site = {
  name: "Alvaro Matzumura",
  description: "Alvaro Matzumura — photo & motion. Fotografía y video.",
};

export const nav = [
  { href: "/photo", label: "photo" },
  { href: "/motion", label: "motion" },
] as const;

export const homeVideo = {
  src: "/video/home.mp4",
  poster: "/img/posters/home.jpg",
};

/**
 * Photo mosaic: 13 frames in a masonry, same rhythm of portrait and
 * landscape ratios as the reference gallery. An empty frame (`image: null`)
 * keeps its `ratio`; to fill it, import the file
 * (`import photo02 from "@/public/img/photo-02.jpg"`) and set `image` + `alt`.
 * A filled frame takes its ratio from the image itself.
 */
export type Photo = {
  image: StaticImageData | null;
  alt: string;
  /** width / height, used while the frame is empty */
  ratio: [number, number];
};

const PORTRAIT_35MM: [number, number] = [152, 225];
const PORTRAIT: [number, number] = [2, 3];
const LANDSCAPE: [number, number] = [3, 2];

const empty = (ratio: [number, number]): Photo => ({ image: null, alt: "", ratio });

export const photos: Photo[] = [
  empty(PORTRAIT_35MM),
  {
    image: photo01,
    alt: "Puesto callejero cubierto con cortinas de plástico transparente",
    ratio: LANDSCAPE,
  },
  empty(PORTRAIT_35MM),
  empty(LANDSCAPE),
  empty(LANDSCAPE),
  empty(PORTRAIT_35MM),
  empty(PORTRAIT),
  empty(LANDSCAPE),
  empty(LANDSCAPE),
  empty(LANDSCAPE),
  empty(PORTRAIT),
  empty(LANDSCAPE),
  empty(PORTRAIT),
];

export type MotionProject = {
  title: string;
  description: string;
  src: string;
  poster: string;
  /** Full-length cut on Vimeo, played in a popup (the number in vimeo.com/…). */
  vimeoId?: string;
};

// The original reuses the "la caminata" description for all three projects.
export const motionProjects: MotionProject[] = [
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
