import React from "react";
import { getProducts } from "@/lib/catalog";
import ProductsClient from "./ProductsClient";

export const metadata = {
  title: "Catálogo de Productos | SaaS Admin",
};

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <ProductsClient initialProducts={products} />
  );
}
