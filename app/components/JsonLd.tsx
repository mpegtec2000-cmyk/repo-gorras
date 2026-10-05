import { site } from "@/lib/site";
import { Product } from "@/lib/products";

export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    logo: `${site.url}/brand/spm-logo-black.png`,
    description: site.description,
    sameAs: [site.instagram],
    address: {
      "@type": "PostalAddress",
      addressCountry: site.country,
      addressLocality: "Santiago",
    },
    currenciesAccepted: site.currency,
    priceRange: "$$",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ProductJsonLd({ product }: { product: Product }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.seoTitle,
    image: product.images.map((img) => `${site.url}${img.src}`),
    description: product.description,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: site.shortName,
    },
    offers: {
      "@type": "Offer",
      url: `${site.url}/producto/${product.slug}`,
      priceCurrency: site.currency,
      price: product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
