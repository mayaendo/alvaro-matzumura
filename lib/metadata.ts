import type { Metadata } from "next";
import { site } from "@/lib/content";

const ogImage = { url: "/img/og.jpg", width: 1200, height: 630, alt: site.name };

/** Full metadata for a route; Next replaces (not merges) nested objects like `openGraph`. */
export function pageMetadata(path: string, title?: string): Metadata {
  const fullTitle = title ? `${title} — ${site.name}` : site.name;
  return {
    ...(title && { title }),
    description: site.description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: fullTitle,
      description: site.description,
      url: path,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: site.description,
      images: [ogImage.url],
    },
  };
}
