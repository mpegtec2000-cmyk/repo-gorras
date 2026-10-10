import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
  },
  async redirects() {
    return [
      {
        source: "/producto",
        destination: "/tienda",
        permanent: true,
      },
      {
        source: "/productos",
        destination: "/tienda",
        permanent: true,
      },
      {
        source: "/catalogo",
        destination: "/tienda",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
