import { site } from "@/lib/site";
import { Product } from "@/lib/products";

function getAbsoluteImageUrl(src?: string): string {
  if (!src) return `${site.url}/products/placeholder-cap.png`;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  return `${site.url}${src.startsWith("/") ? src : `/${src}`}`;
}

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
    areaServed: {
      "@type": "Country",
      name: "Chile",
    },
    paymentAccepted: [
      "Webpay Plus",
      "Redcompra",
      "Tarjetas de Crédito",
      "Tarjetas de Débito",
      "Flow",
      "Transferencia Bancaria",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${site.url}/tienda?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ProductJsonLd({ product }: { product: Product }) {
  const images = (product.images || []).map((img) => getAbsoluteImageUrl(img.src));
  if (images.length === 0) {
    images.push(`${site.url}/products/placeholder-cap.png`);
  }

  const isFreeShipping = product.price >= site.freeShippingFrom;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.seoTitle || `${product.brand} - ${product.name}`,
    image: images,
    description: product.seoDescription || product.description,
    sku: product.id,
    mpn: product.id,
    brand: {
      "@type": "Brand",
      name: product.brand || site.shortName,
    },
    category: "Ropa y Accesorios > Gorras y Jockeys",
    offers: {
      "@type": "Offer",
      url: `${site.url}/producto/${product.slug}`,
      priceCurrency: site.currency,
      price: product.price,
      priceValidUntil: "2027-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: site.name,
        url: site.url,
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "CL",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 30,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: isFreeShipping ? "0" : "3990",
          currency: site.currency,
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "CL",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 1,
            unitCode: "d",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 3,
            unitCode: "d",
          },
        },
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ProductBreadcrumbJsonLd({ product }: { product: Product }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: site.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tienda",
        item: `${site.url}/tienda`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.brand || "Marcas",
        item: `${site.url}/tienda?marca=${product.brandSlug || ""}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: product.name,
        item: `${site.url}/producto/${product.slug}`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FaqJsonLd({
  items,
}: {
  items: { q: string; a: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

