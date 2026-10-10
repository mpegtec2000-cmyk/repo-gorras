import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SPM Store - Gorras Streetwear Chile",
    short_name: "SPM Store",
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      {
        src: "/brand/spm-logo-black.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/brand/spm-logo-black.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
