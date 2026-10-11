import React from "react";
import { notFound } from "next/navigation";
import { getOrder } from "@/lib/orders";
import OrderDetailClient from "./OrderDetailClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Comprobante de Compra | SPM Streetwear",
  description: "Detalle y comprobante de compra oficial en SPM Streetwear.",
};

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string; token?: string }>;
}

export default async function OrderDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { status } = await searchParams;

  const order = await getOrder(id);

  if (!order) {
    notFound();
  }

  return <OrderDetailClient order={order} statusParam={status || null} />;
}
