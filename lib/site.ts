/**
 * Configuración central de la marca.
 * Edita aquí los datos de contacto / URL de producción.
 */
export const site = {
  name: "SPM Streetwear",
  shortName: "SPM",
  legalName: "SPM Store",
  tagline: "Streetwear / Accessories / More",
  description:
    "SPM® Streetwear: gorras y jockeys streetwear en Chile. Snapbacks, truckers, dad hats, fitted y gorros con bordados exclusivos. Drops limitados y envíos a todo Chile.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://spmstore.cl",
  locale: "es_CL",
  lang: "es-CL",
  currency: "CLP",
  country: "CL",
  instagram: "https://www.instagram.com/spm_store.cl/",
  instagramHandle: "@spm_store.cl",
  // TODO: completar cuando estén disponibles
  email: "contacto@spmstore.cl",
  whatsapp: "",
  freeShippingFrom: 50000,
  keywords: [
    "gorras streetwear",
    "gorras streetwear Chile",
    "jockeys Chile",
    "snapback Chile",
    "gorras trucker",
    "dad hat",
    "gorras bordadas",
    "gorros streetwear",
    "SPM store",
    "SPM streetwear",
  ],
} as const;

export const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/tienda", label: "Tienda" },
  { href: "/drops", label: "Drops" },
  { href: "/#colecciones", label: "Colecciones" },
  { href: "/#nosotros", label: "Nosotros" },
] as const;
