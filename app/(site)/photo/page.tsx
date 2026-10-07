import { pageMetadata } from "@/lib/metadata";
import { PhotoMosaic } from "@/components/photo-mosaic";
import { toFrames } from "@/lib/content";
import { getPhotos } from "@/lib/sanity";

export const metadata = pageMetadata("/photo", "photo");

export default async function PhotoPage() {
  const photos = await getPhotos();
  return (
    <section
      aria-labelledby="photo-title"
      className="px-[5vw] pt-6 pb-[16vw] md:px-[4vw] md:pt-10 md:pb-[12vw]"
    >
      <h1 id="photo-title" className="sr-only">
        photo
      </h1>
      <PhotoMosaic frames={toFrames(photos)} />
    </section>
  );
}
