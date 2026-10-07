"use client";

import Image from "next/image";
import { useCallback, useMemo, useRef, useState } from "react";
import type { Frame, ImageSource } from "@/lib/content";
import { useReveal } from "./reveal";
import { lightboxButton as btn, useLightbox } from "./use-lightbox";

/** next/image props for a bundled or Sanity-hosted image. */
const imageProps = ({ src, width, height, blurDataURL }: ImageSource) => ({
  src,
  width,
  height,
  blurDataURL,
  placeholder: blurDataURL ? ("blur" as const) : ("empty" as const),
});

/**
 * Masonry: walk the photos in order and drop each one into the currently
 * shortest column, so columns stay balanced while reading order is kept.
 */
function toColumns(photos: Frame[], n: number) {
  const heights = new Array<number>(n).fill(0);
  const cols = Array.from({ length: n }, () => [] as number[]);
  photos.forEach((photo, i) => {
    const shortest = heights.indexOf(Math.min(...heights));
    cols[shortest].push(i);
    heights[shortest] += photo.ratio[1] / photo.ratio[0];
  });
  return cols;
}

export function PhotoMosaic({ frames: photos }: { frames: Frame[] }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [swapping, setSwapping] = useState(false);

  const desktop = useMemo(() => toColumns(photos, 4), [photos]);
  const mobile = useMemo(() => toColumns(photos, 2), [photos]);
  const filled = useMemo(
    () => photos.flatMap((p, i) => (p.image ? [i] : [])),
    [photos],
  );

  useReveal(gridRef);

  const step = useCallback(
    (dir: 1 | -1) => {
      setSwapping(true);
      setTimeout(() => {
        setActive((cur) => {
          if (cur === null) return cur;
          const pos = filled.indexOf(cur);
          return filled[(pos + dir + filled.length) % filled.length];
        });
        setSwapping(false);
      }, 180);
    },
    [filled],
  );

  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (filled.length < 2) return;
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    },
    [step, filled.length],
  );

  const onClosed = useCallback(() => setActive(null), []);
  const lightbox = useLightbox({ onKey, onClosed });
  const { dialogRef, close } = lightbox;

  const open = (i: number) => {
    setActive(i);
    lightbox.open();
  };

  const tile = (i: number) => {
    const photo = photos[i];
    const [w, h] = photo.ratio;
    return (
      <div key={i} className="tile" style={{ aspectRatio: `${w} / ${h}` }}>
        {photo.image ? (
          <button
            type="button"
            onClick={() => open(i)}
            aria-label={`Ver foto ${i + 1}`}
            data-reveal
            className="tile-media block size-full cursor-pointer"
          >
            <Image
              {...imageProps(photo.image)}
              alt={photo.alt}
              sizes="(min-width: 768px) 23vw, 46vw"
              className="size-full object-cover"
            />
          </button>
        ) : (
          <div aria-hidden="true" data-reveal className="tile-media size-full bg-neutral-100" />
        )}
      </div>
    );
  };

  const current = active === null ? null : photos[active];

  return (
    <>
      <div ref={gridRef}>
        {[
          { cols: desktop, className: "hidden md:flex" },
          { cols: mobile, className: "flex md:hidden" },
        ].map(({ cols, className }) => (
          <div key={cols.length} className={`masonry ${className}`}>
            {cols.map((col, c) => (
              <div key={c} className="masonry-col">
                {col.map(tile)}
              </div>
            ))}
          </div>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        onClick={close}
        aria-label="Foto ampliada"
        className="lightbox m-0 h-dvh max-h-none w-screen max-w-none cursor-zoom-out bg-transparent p-0"
      >
        {current?.image && (
          <div className="flex size-full items-center justify-center">
            <Image
              {...imageProps(current.image)}
              alt={current.alt}
              sizes="92vw"
              onClick={(e) => e.stopPropagation()}
              // As large as fits in 92vw × 92vh, keeping the photo's ratio.
              style={{
                width: `min(92vw, calc(92vh * ${current.image.width / current.image.height}))`,
              }}
              className={`h-auto cursor-default transition-opacity duration-180 select-none ${
                swapping ? "opacity-0" : "opacity-100"
              }`}
            />
          </div>
        )}
        {filled.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Foto anterior"
              onClick={(e) => (e.stopPropagation(), step(-1))}
              className={`${btn} top-1/2 left-5 -translate-y-1/2 p-3.5 text-[26px]`}
            >
              &#8592;
            </button>
            <button
              type="button"
              aria-label="Foto siguiente"
              onClick={(e) => (e.stopPropagation(), step(1))}
              className={`${btn} top-1/2 right-5 -translate-y-1/2 p-3.5 text-[26px]`}
            >
              &#8594;
            </button>
          </>
        )}
        <button
          type="button"
          aria-label="Cerrar"
          autoFocus
          onClick={(e) => (e.stopPropagation(), close())}
          className={`${btn} top-4 right-[22px] p-2 text-[30px] leading-none`}
        >
          &times;
        </button>
      </dialog>
    </>
  );
}
