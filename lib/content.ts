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
 * Photo mosaic. A `null` image renders an empty frame, mirroring the
 * unfilled tiles of the original Framer collage. Replace with a static
 * import (e.g. `import photo02 from "@/public/img/photo-02.jpg"`) to fill it.
 */
export type Photo = { image: StaticImageData | null; alt: string };

export const photos: Photo[] = [
  { image: photo01, alt: "Puesto callejero cubierto con cortinas de plástico transparente" },
  { image: null, alt: "" },
  { image: null, alt: "" },
  { image: null, alt: "" },
  { image: null, alt: "" },
  { image: null, alt: "" },
];

export type MotionProject = {
  title: string;
  description: string;
  src: string;
  poster: string;
  href?: string;
};

// The original reuses the "la caminata" description for all three projects.
export const motionProjects: MotionProject[] = [
  {
    title: "la caminata",
    description:
      "A cinematic portrait of movement, landscape, and everyday life in Ayaviri, Puno. A visual exploration of the journey through the Andean landscape, created for Baika.",
    src: "/video/la-caminata.mp4",
    poster: "/img/posters/la-caminata.jpg",
    href: "https://vimeo.com/1154904862",
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
