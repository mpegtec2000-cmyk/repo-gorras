import React from "react";
import ProductEditorClient from "../[id]/ProductEditorClient";

export const metadata = {
  title: "Nuevo Producto | SaaS Admin",
};

export default function NewProductPage() {
  return <ProductEditorClient product={null} />;
}
