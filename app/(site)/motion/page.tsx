import { pageMetadata } from "@/lib/metadata";
import { AutoplayVideo } from "@/components/autoplay-video";
import { VimeoPopup } from "@/components/vimeo-popup";
import type { MotionProject } from "@/lib/content";
import { getMotion } from "@/lib/sanity";

export const metadata = pageMetadata("/motion", "motion");

const fade = "transition-opacity duration-400 ease-out";

function Project({ title, description, src, poster, vimeoId }: MotionProject) {
  const body = (
    <>
      <div className="relative aspect-video w-full overflow-hidden bg-[#fafdff] md:aspect-[16/5]">
        <AutoplayVideo src={src} poster={poster} className="size-full object-cover" />
        <div
          aria-hidden="true"
          className={`absolute inset-0 hidden bg-black/55 opacity-0 overlay:block ${fade} group-hover:opacity-100 group-has-focus-visible:opacity-100`}
        />
      </div>
      <div
        className={`px-5 pt-3 overlay:absolute overlay:inset-0 overlay:p-0 overlay:text-white overlay:opacity-0 ${fade} group-hover:opacity-100 group-has-focus-visible:opacity-100`}
      >
        <h2 className="font-display text-[22px] leading-none tracking-[-0.05em] overlay:absolute overlay:top-1/2 overlay:left-[18.4%] overlay:-translate-y-1/2 overlay:text-[30px]">
          {title}
        </h2>
        <p className="mt-2 max-w-[520px] text-sm leading-[1.45] text-balance text-neutral-600 overlay:absolute overlay:top-1/2 overlay:right-[6.7%] overlay:mt-0 overlay:w-[43%] overlay:-translate-y-1/2 overlay:text-white">
          {description}
        </p>
      </div>
    </>
  );

  return (
    <article
      className={`group relative ${vimeoId ? "has-focus-visible:outline-1 has-focus-visible:outline-offset-4" : ""}`}
    >
      {body}
      {vimeoId && <VimeoPopup vimeoId={vimeoId} title={title} />}
    </article>
  );
}

export default async function MotionPage() {
  const projects = await getMotion();
  return (
    <section aria-label="motion" className="flex flex-col gap-12 pt-6 pb-24 md:gap-[90px] md:pt-[39px] md:pb-[167px]">
      <h1 className="sr-only">motion</h1>
      {projects.map((project, i) => (
        <Project key={`${i}-${project.title}`} {...project} />
      ))}
    </section>
  );
}
