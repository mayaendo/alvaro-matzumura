import type { Metadata, Viewport } from "next";
import { connection } from "next/server";
import { NextStudio } from "next-sanity/studio";
import { Suspense } from "react";
import config from "@/sanity.config";

export const metadata: Metadata = {
  title: "Studio",
  referrer: "same-origin",
  robots: "noindex",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Any /studio/… path is a Studio client route, so render on request.
async function RequestTime() {
  await connection();
  return null;
}

export default function StudioPage() {
  return (
    <>
      <Suspense>
        <RequestTime />
      </Suspense>
      <NextStudio config={config} />
    </>
  );
}
