import React, { Suspense } from "react";
import Metadata from "next";
import ShopClient from "./ShopClient";
import { site } from "@/lib/site";

export const metadata = {
  title: "Tienda Oficial & Catálogo de Gorras Streetwear",
  description:
    "Explora todo el catálogo de gorras SPM Streetwear en Chile. Snapbacks, truckers, dad hats, gorras curvas y fitted con bordados 3D.",
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div style={{ padding: "8rem 2rem", textAlign: "center", color: "#fff" }}>Cargando tienda...</div>}>
      <ShopClient />
    </Suspense>
  );
}
