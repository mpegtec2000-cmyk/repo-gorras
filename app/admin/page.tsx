import React from "react";
import { getProducts } from "@/lib/catalog";
import { getOrders } from "@/lib/orders";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Dashboard SaaS | SPM Streetwear",
};

export default async function AdminDashboard() {
  const [products, orders] = await Promise.all([getProducts(), getOrders()]);
  return <DashboardClient initialProducts={products} initialOrders={orders} />;
}
