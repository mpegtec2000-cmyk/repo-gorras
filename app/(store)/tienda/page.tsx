import React, { Suspense } from "react";
import type { Metadata } from "next";
import ShopClient from "./ShopClient";
import { getProducts } from "@/lib/catalog";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tienda Oficial & Catálogo de Gorras Streetwear",
  description:
    "Explora todo el catálogo de gorras SPM Streetwear en Chile: Cash Only, Dreamer Hats, Rebel Hats, Inédit, Thirty One, Barbas Hats y más.",
  alternates: {
    canonical: `${site.url}/tienda`,
  },
  openGraph: {
    title: `Tienda Oficial de Gorras Streetwear | ${site.name}`,
    description:
      "Catálogo completo de gorras snapback, trucker y strapback en Chile. Envíos gratis sobre $50.000 CLP.",
    url: `${site.url}/tienda`,
    siteName: site.name,
    locale: site.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Tienda Oficial de Gorras Streetwear | ${site.name}`,
    description:
      "Catálogo completo de gorras snapback, trucker y strapback en Chile.",
  },
};

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <Suspense fallback={<div style={{ padding: "8rem 2rem", textAlign: "center", color: "#fff" }}>Cargando tienda...</div>}>
      <ShopClient initialProducts={products} />
    </Suspense>
  );
}
