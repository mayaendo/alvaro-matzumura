"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav, site } from "@/lib/content";

const linkClass =
  "transition-opacity duration-200 hover:opacity-50 focus-visible:opacity-50 focus-visible:outline-none";

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="flex h-16 items-start justify-between bg-white px-5 pt-5 md:h-20 md:p-[31px]">
      <Link
        href="/"
        className={linkClass}
        aria-current={pathname === "/" ? "page" : undefined}
      >
        {site.name.toLowerCase()}
      </Link>
      <nav aria-label="Principal">
        <ul className="flex gap-[26px]">
          {nav.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={linkClass}
                aria-current={pathname === href ? "page" : undefined}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
