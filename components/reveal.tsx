"use client";

import { useEffect, useRef, type ComponentProps, type RefObject } from "react";

/**
 * Scroll reveal: `[data-reveal]` elements inside `ref` fade in as they enter
 * the viewport; ones entering together cascade (styles in globals.css).
 */
export function useReveal(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
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
    root.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ref]);
}

/** A container whose `[data-reveal]` descendants fade in on scroll. */
export function Reveal(props: ComponentProps<"div">) {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref);
  return <div ref={ref} {...props} />;
}
