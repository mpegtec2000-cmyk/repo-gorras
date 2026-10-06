import React, { Suspense } from "react";
import Metadata from "next";
import ShopClient from "./ShopClient";
import { getAllProducts } from "@/lib/catalog";

export const metadata = {
  title: "Tienda Oficial & Catálogo de Gorras Streetwear",
  description:
    "Explora todo el catálogo de gorras SPM Streetwear en Chile: Cash Only, Dreamer Hats, Rebel Hats, Inédit, Thirty One, Barbas Hats y más.",
};

export default async function ShopPage() {
  const products = await getAllProducts();

  return (
    <Suspense fallback={<div style={{ padding: "8rem 2rem", textAlign: "center", color: "#fff" }}>Cargando tienda...</div>}>
      <ShopClient initialProducts={products} />
    </Suspense>
  );
}
