import React from "react";
import { getProducts } from "@/lib/catalog";
import FlujoClient from "./FlujoClient";

export const metadata = {
  title: "Flujo & Analítica | SaaS Admin",
};

export default async function FlujoPage() {
  const products = await getProducts();
  return <FlujoClient initialProducts={products} />;
}
