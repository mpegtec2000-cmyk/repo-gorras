import { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = site.url;

  const privateRoutes = ["/admin/", "/api/", "/login/", "/checkout/", "/pedido/"];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: privateRoutes,
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: privateRoutes,
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: privateRoutes,
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: privateRoutes,
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow: privateRoutes,
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: privateRoutes,
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: privateRoutes,
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: privateRoutes,
      },
      {
        userAgent: "Applebot",
        allow: "/",
        disallow: privateRoutes,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

