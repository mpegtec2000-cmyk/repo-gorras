import React from "react";
import { getOrders } from "@/lib/orders";
import { getProducts } from "@/lib/catalog";
import VentasClient from "./VentasClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Ventas y Órdenes | SaaS Admin",
};

export default async function VentasPage() {
  const orders = await getOrders();
  const products = await getProducts();
  
  return <VentasClient initialOrders={orders} products={products} />;
}
