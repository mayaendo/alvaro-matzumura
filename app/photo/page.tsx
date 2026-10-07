import { pageMetadata } from "@/lib/metadata";
import { PhotoMosaic } from "@/components/photo-mosaic";
import { photos } from "@/lib/content";

export const metadata = pageMetadata("/photo", "photo");

export default function PhotoPage() {
  return (
    <section
      aria-labelledby="photo-title"
      className="mx-auto w-full max-w-[978px] px-5 py-10 md:py-24 lg:px-0"
    >
      <h1 id="photo-title" className="sr-only">
        photo
      </h1>
      <PhotoMosaic photos={photos} />
    </section>
  );
}
