import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CalcVerse — Every calculator, one app",
    short_name: "CalcVerse",
    description:
      "Finance, health, math, and everyday calculators in one fast, friendly app. No sign-up required.",
    start_url: "/",
    display: "standalone",
    background_color: "#fafafa",
    theme_color: "#6366f1",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
