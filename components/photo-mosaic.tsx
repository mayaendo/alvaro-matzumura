"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Photo } from "@/lib/content";

/**
 * Tile placement. Mobile: two columns, each tile sized by its own aspect
 * ratio. Desktop: a 6×4 editorial grid whose rows share the container height.
 */
const layout = [
  "col-span-2 aspect-[3/2] md:col-span-4 md:row-span-2",
  "aspect-[3/4] md:col-span-2 md:row-span-2",
  "aspect-[3/4] md:col-span-2 md:row-span-2",
  "col-span-2 aspect-[2/1] md:col-span-4",
  "aspect-square md:col-span-2",
  "aspect-square md:col-span-2",
].map((c) => `${c} md:aspect-auto`);

const frame = (i: number) => String(i + 1).padStart(2, "0");

export function PhotoMosaic({ photos }: { photos: Photo[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const filled = useMemo(
    () => photos.flatMap((p, i) => (p.image ? [i] : [])),
    [photos],
  );

  const open = (i: number) => {
    setActive(i);
    dialogRef.current?.showModal();
  };

  const step = useCallback(
    (dir: 1 | -1) =>
      setActive((cur) => {
        if (cur === null) return cur;
        const pos = filled.indexOf(cur);
        return filled[(pos + dir + filled.length) % filled.length];
      }),
    [filled],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    dialog.addEventListener("keydown", onKey);
    return () => dialog.removeEventListener("keydown", onKey);
  }, [step]);

  const current = active === null ? null : photos[active];

  return (
    <>
      <ul className="mosaic grid grid-cols-2 gap-3 md:aspect-[978/891] md:grid-cols-6 md:grid-rows-4 md:gap-[17px]">
        {photos.map((photo, i) => (
          <li
            key={i}
            className={`tile relative ${layout[i % layout.length]}`}
            style={{ animationDelay: `${i * 90}ms` }}
          >
            {photo.image ? (
              <button
                type="button"
                onClick={() => open(i)}
                aria-label={`Ampliar foto ${frame(i)}`}
                className="tile-surface block size-full cursor-zoom-in overflow-hidden rounded-[4px] bg-neutral-100"
              >
                <Image
                  src={photo.image}
                  alt={photo.alt}
                  placeholder="blur"
                  sizes="(min-width: 768px) 650px, 100vw"
                  preload={i === 0}
                  className="size-full object-cover"
                />
              </button>
            ) : (
              <div
                aria-hidden="true"
                className="tile-surface size-full rounded-[4px] bg-neutral-100"
              />
            )}
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute bottom-2 left-2.5 text-[11px] tabular-nums tracking-wide ${
                photo.image ? "text-white mix-blend-difference" : "text-neutral-400"
              }`}
            >
              {frame(i)}
            </span>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        onClose={() => setActive(null)}
        onClick={(e) => e.target === e.currentTarget && dialogRef.current?.close()}
        aria-label="Foto ampliada"
        className="lightbox m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-5 backdrop:bg-black/86"
      >
        {current?.image && active !== null && (
          <div
            className="pointer-events-none flex h-full flex-col items-center justify-center gap-3"
          >
            <Image
              key={active}
              src={current.image}
              alt={current.alt}
              placeholder="blur"
              sizes="(min-width: 1240px) 1200px, 100vw"
              className="pointer-events-auto h-auto max-h-[calc(100dvh-5rem)] w-auto max-w-[min(100%,1200px)] object-contain"
            />
            <div className="pointer-events-auto flex items-center gap-6 text-sm text-white tabular-nums">
              {filled.length > 1 && (
                <button type="button" onClick={() => step(-1)} className="hover:opacity-60">
                  prev
                </button>
              )}
              <span>
                {frame(active)} / {frame(photos.length - 1)}
              </span>
              {filled.length > 1 && (
                <button type="button" onClick={() => step(1)} className="hover:opacity-60">
                  next
                </button>
              )}
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="hover:opacity-60"
                autoFocus
              >
                close
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
