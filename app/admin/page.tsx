import React from "react";
import { getProducts } from "@/lib/catalog";
import DashboardClient from "./DashboardClient";

export const metadata = {
  title: "Dashboard SaaS | SPM Streetwear",
};

export default async function AdminDashboard() {
  const products = await getProducts();
  return <DashboardClient initialProducts={products} />;
}
