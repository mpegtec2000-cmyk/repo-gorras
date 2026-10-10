import React from "react";
import { getProduct } from "@/lib/catalog";
import ProductEditorClient from "../ProductEditorClient";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Editor de Producto | SaaS Admin",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductEditorPage({ params }: PageProps) {
  const { id } = await params;
  
  const product = id === "nuevo" ? null : await getProduct(id);
  
  if (id !== "nuevo" && !product) {
    notFound();
  }

  return (
    <ProductEditorClient product={product} />
  );
}

