import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "work-this-body",
    short_name: "work-this-body",
    description: "Guided mobility and strength with an interval timer and a live motion guide.",
    start_url: "./",
    scope: "./",
    display: "standalone",
    background_color: "#070908",
    theme_color: "#070908",
    icons: [
      {
        src: "./icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "./icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
