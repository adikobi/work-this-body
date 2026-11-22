import type { MetadataRoute } from "next";

export const dynamic = "force-static";

// Lets people install the app to a phone or tablet home screen and open it full-screen.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "work-this-body",
    short_name: "work-this-body",
    description: "Guided mobility and strength with an interval timer and a live motion guide.",
    start_url: "./",
    display: "standalone",
    background_color: "#070908",
    theme_color: "#070908",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
