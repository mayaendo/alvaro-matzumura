import { AutoplayVideo } from "@/components/autoplay-video";
import { site } from "@/lib/content";
import { getHome } from "@/lib/sanity";

export default async function Home() {
  const homeVideo = await getHome();
  return (
    <section aria-label={site.name} className="pt-6 pb-24 md:pt-8 md:pb-[193px]">
      <h1 className="sr-only">{site.name}</h1>
      <div className="aspect-[4/3] w-full overflow-hidden bg-[#fafdff] sm:aspect-video md:aspect-[16/5]">
        <AutoplayVideo
          src={homeVideo.src}
          poster={homeVideo.poster}
          className="size-full object-cover"
        />
      </div>
    </section>
  );
}
