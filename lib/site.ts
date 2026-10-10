/**
 * Configuración central de la marca.
 * Edita aquí los datos de contacto / URL de producción.
 */
export const site = {
  name: "SPM Store",
  brandName: "SPM Streetwear",
  shortName: "SPM",
  legalName: "SPM Store Chile",
  tagline: "Streetwear / Accessories / More",
  description:
    "SPM Store (SPM Streetwear): tienda oficial de gorras y jockeys streetwear en Chile. Snapbacks, truckers, dad hats y gorros con bordados 3D exclusivos. Drops limitados y envíos a todo Chile.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://spm-store.cl",
  locale: "es_CL",
  lang: "es-CL",
  currency: "CLP",
  country: "CL",
  instagram: "https://www.instagram.com/spm_store.cl/",
  instagramHandle: "@spm_store.cl",
  // TODO: completar cuando estén disponibles
  email: "contacto@spm-store.cl",
  whatsapp: "",
  freeShippingFrom: 50000,
  keywords: [
    "SPM",
    "SPM store",
    "SPM store chile",
    "SPM streetwear",
    "tienda SPM",
    "gorras SPM",
    "gorras streetwear",
    "gorras streetwear Chile",
    "jockeys Chile",
    "snapback Chile",
    "gorras trucker",
    "dad hat",
    "gorras bordadas",
    "gorros streetwear",
    "31 hats Chile",
    "cash only Chile",
  ],
} as const;

export const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/tienda", label: "Tienda" },
  { href: "/drops", label: "Drops" },
  { href: "/#colecciones", label: "Colecciones" },
  { href: "/#nosotros", label: "Nosotros" },
] as const;
