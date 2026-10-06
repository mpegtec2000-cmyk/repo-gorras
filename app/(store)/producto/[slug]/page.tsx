import React from "react";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";
import { getProduct, getProducts } from "@/lib/catalog";
import { getRelated, displayImages } from "@/lib/products";
import { ProductJsonLd } from "@/app/components/JsonLd";
import { site } from "@/lib/site";

export const revalidate = 0; // Dynamic rendering for catalog updates

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: "Producto no encontrado" };
  }

  const imgs = displayImages(product);

  return {
    title: product.seoTitle,
    description: product.seoDescription || product.description,
    openGraph: {
      title: `${product.brand} ${product.name} | ${site.name}`,
      description: product.description,
      images: [
        {
          url: imgs[0].src.startsWith("http") ? imgs[0].src : `${site.url}${imgs[0].src}`,
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
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const allProducts = await getProducts();
  const related = getRelated(allProducts, product, 4);

  return (
    <>
      <ProductJsonLd product={product} />
      <ProductDetailClient product={product} related={related} />
    </>
  );
}
