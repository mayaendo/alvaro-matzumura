"use client";

import { useCallback, useState } from "react";
import { lightboxButton, useLightbox } from "./use-lightbox";

type Props = { vimeoId: string; title: string };

/**
 * Invisible button stretched over its (relative) parent card; opens the
 * Vimeo cut in a lightbox. The player only exists while open, so closing
 * stops playback.
 */
export function VimeoPopup({ vimeoId, title }: Props) {
  const [playing, setPlaying] = useState(false);
  const onClosed = useCallback(() => setPlaying(false), []);
  const { dialogRef, open, close } = useLightbox({ onClosed });

  const src =
    `https://player.vimeo.com/video/${vimeoId}` +
    "?autoplay=1&dnt=1&title=0&byline=0&portrait=0";

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setPlaying(true);
          open();
        }}
        aria-label={`Ver ${title}`}
        className="absolute inset-0 z-10 cursor-pointer focus-visible:outline-none"
      />
      <dialog
        ref={dialogRef}
        onClick={close}
        aria-label={title}
        className="lightbox m-0 h-dvh max-h-none w-screen max-w-none cursor-zoom-out bg-transparent p-0"
      >
        <div className="flex size-full items-center justify-center">
          <div
            onClick={(e) => e.stopPropagation()}
            className="aspect-video w-[min(92vw,calc(92vh*16/9))] cursor-default bg-black"
          >
            {playing && (
              <iframe
                src={src}
                title={title}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="size-full"
              />
            )}
          </div>
        </div>
        <button
          type="button"
          aria-label="Cerrar"
          autoFocus
          onClick={(e) => (e.stopPropagation(), close())}
          className={`${lightboxButton} top-4 right-[22px] p-2 text-[30px] leading-none`}
        >
          &times;
        </button>
      </dialog>
    </>
  );
}
