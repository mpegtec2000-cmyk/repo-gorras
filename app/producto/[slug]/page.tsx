import React from "react";
import { notFound } from "next/navigation";
import Metadata from "next";
import ProductDetailClient from "./ProductDetailClient";
import { getProductBySlug, products, getRelated } from "@/lib/products";
import { ProductJsonLd } from "@/app/components/JsonLd";
import { site } from "@/lib/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: "Producto no encontrado" };
  }

  return {
    title: product.seoTitle,
    description: product.description,
    openGraph: {
      title: `${product.name} | ${site.name}`,
      description: product.description,
      images: [
        {
          url: `${site.url}${product.images[0].src}`,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = getRelated(product, 4);

  return (
    <>
      <ProductJsonLd product={product} />
      <ProductDetailClient product={product} related={related} />
    </>
  );
}
