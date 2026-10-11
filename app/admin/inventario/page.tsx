import React from "react";
import { getProducts } from "@/lib/catalog";
import InventoryClient from "./InventoryClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Gestión de Inventario | SaaS Admin",
};

export default async function InventoryPage() {
  const products = await getProducts();
  return <InventoryClient initialProducts={products} />;
}
