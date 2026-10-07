"use client";

import { useCallback, useEffect, useRef } from "react";

const FADE_MS = 220;

/**
 * Shared behavior for the `.lightbox` <dialog>s: open as a modal, close with
 * a fade (Esc, backdrop click or the close button). `onKey` receives other
 * key presses while the dialog is open; `onClosed` runs once it has closed.
 */
export function useLightbox({
  onKey,
  onClosed,
}: { onKey?: (e: KeyboardEvent) => void; onClosed?: () => void } = {}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = useCallback(() => dialogRef.current?.showModal(), []);

  const close = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog?.open || dialog.dataset.closing !== undefined) return;
    dialog.dataset.closing = "";
    setTimeout(() => {
      dialog.close();
      delete dialog.dataset.closing;
      onClosed?.();
    }, FADE_MS);
  }, [onClosed]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else {
        onKey?.(e);
      }
    };
    dialog.addEventListener("keydown", handler);
    return () => dialog.removeEventListener("keydown", handler);
  }, [close, onKey]);

  return { dialogRef, open, close };
}

export const lightboxButton =
  "absolute text-white opacity-55 transition-opacity duration-200 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none";
