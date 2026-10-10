import React from "react";
import ProductEditorClient from "../ProductEditorClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Nuevo Producto | SaaS Admin",
};

export default function NewProductPage() {
  return <ProductEditorClient product={null} />;
}

