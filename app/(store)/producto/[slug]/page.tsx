import React from "react";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";
import { getProduct, getProducts } from "@/lib/catalog";
import { getRelated, displayImages } from "@/lib/products";
import { ProductJsonLd, ProductBreadcrumbJsonLd } from "@/app/components/JsonLd";
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
  const primaryImg = imgs[0]?.src?.startsWith("http")
    ? imgs[0].src
    : `${site.url}${imgs[0]?.src || "/products/placeholder-cap.png"}`;

  const canonicalUrl = `${site.url}/producto/${product.slug}`;
  const title = `${product.seoTitle || `${product.brand} ${product.name}`} | ${site.shortName}`;
  const description = product.seoDescription || product.description;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: site.name,
      locale: site.locale,
      type: "website",
      images: [
        {
          url: primaryImg,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [primaryImg],
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
      <ProductBreadcrumbJsonLd product={product} />
      <ProductDetailClient product={product} related={related} />
    </>
  );
}
