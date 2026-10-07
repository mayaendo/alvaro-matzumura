import { pageMetadata } from "@/lib/metadata";
import { PhotoMosaic } from "@/components/photo-mosaic";
import { photos } from "@/lib/content";

export const metadata = pageMetadata("/photo", "photo");

export default function PhotoPage() {
  return (
    <section
      aria-labelledby="photo-title"
      className="px-[5vw] pt-6 pb-[16vw] md:px-[4vw] md:pt-10 md:pb-[12vw]"
    >
      <h1 id="photo-title" className="sr-only">
        photo
      </h1>
      <PhotoMosaic photos={photos} />
    </section>
  );
}
