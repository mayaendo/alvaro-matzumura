"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Photo } from "@/lib/content";
import { lightboxButton as btn, useLightbox } from "./use-lightbox";

/** Height relative to width, from the image itself or the empty frame's ratio. */
const relHeight = ({ image, ratio }: Photo) =>
  image ? image.height / image.width : ratio[1] / ratio[0];

/**
 * Masonry: walk the photos in order and drop each one into the currently
 * shortest column, so columns stay balanced while reading order is kept.
 */
function toColumns(photos: Photo[], n: number) {
  const heights = new Array<number>(n).fill(0);
  const cols = Array.from({ length: n }, () => [] as number[]);
  photos.forEach((photo, i) => {
    const shortest = heights.indexOf(Math.min(...heights));
    cols[shortest].push(i);
    heights[shortest] += relHeight(photo);
  });
  return cols;
}

export function PhotoMosaic({ photos }: { photos: Photo[] }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [swapping, setSwapping] = useState(false);

  const desktop = useMemo(() => toColumns(photos, 4), [photos]);
  const mobile = useMemo(() => toColumns(photos, 2), [photos]);
  const filled = useMemo(
    () => photos.flatMap((p, i) => (p.image ? [i] : [])),
    [photos],
  );

  // Scroll reveal: frames entering together fade in as a short cascade.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries
          .filter((e) => e.isIntersecting)
          .forEach((e, k) => {
            const el = e.target as HTMLElement;
            el.style.setProperty("--reveal-delay", `${k * 70}ms`);
            el.dataset.shown = "";
            observer.unobserve(el);
          });
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    grid.querySelectorAll(".tile-media").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

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
    const [w, h] = photo.image ? [photo.image.width, photo.image.height] : photo.ratio;
    return (
      <div key={i} className="tile" style={{ aspectRatio: `${w} / ${h}` }}>
        {photo.image ? (
          <button
            type="button"
            onClick={() => open(i)}
            aria-label={`Ver foto ${i + 1}`}
            className="tile-media block size-full cursor-pointer"
          >
            <Image
              src={photo.image}
              alt={photo.alt}
              sizes="(min-width: 768px) 23vw, 46vw"
              className="size-full object-cover"
            />
          </button>
        ) : (
          <div aria-hidden="true" className="tile-media size-full bg-neutral-100" />
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
              src={current.image}
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
