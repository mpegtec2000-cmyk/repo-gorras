/**
 * Modelo de dominio del catálogo SPM.
 * Tipos + helpers puros (sin acceso a datos) para usarse tanto en servidor
 * como en componentes cliente. La fuente de datos vive en `lib/catalog.ts`.
 */

export interface ProductImage {
  src: string;
  alt: string;
}

export interface Product {
  id: string;
  slug: string;
  /** Nombre comercial visible (modelo / color) */
  name: string;
  /** Marca, ej. "Rebel Hats" */
  brand: string;
  brandSlug: string;
  /** Título optimizado para Google (<= 60 caracteres) */
  seoTitle: string;
  /** Meta description para Google (<= 160 caracteres) */
  seoDescription: string;
  price: number;
  compareAtPrice?: number | null;
  color: { name: string; hex: string };
  sizes: string[];
  images: ProductImage[];
  /** Stock inicial cargado */
  initialStock: number;
  /** Unidades vendidas */
  sold: number;
  /** Stock actual disponible */
  stock: number;
  isNew?: boolean;
  isFeatured?: boolean;
  /** Visible en la tienda */
  isActive: boolean;
  description: string;
  specs: { label: string; value: string }[];
  createdAt: string;
  updatedAt?: string;
}

export interface Brand {
  slug: string;
  name: string;
  count: number;
  inStock: number;
  sold: number;
}

export const PLACEHOLDER_IMAGE = "/products/placeholder-cap.png";
export const DEFAULT_SIZES = ["Única · Ajustable"];
export const SEO_TITLE_MAX = 60;
export const SEO_DESCRIPTION_MAX = 160;

/* ------------------------------------------------------------------ */
/* Formato / texto                                                     */
/* ------------------------------------------------------------------ */

const clp = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
export const formatCLP = (value: number) => clp.format(value);

export const normalize = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export const slugify = (s: string) =>
  normalize(s)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);

/** Recorta en límite de palabra sin superar `max` caracteres. */
export function truncateWords(text: string, max: number) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max + 1);
  const idx = cut.lastIndexOf(" ");
  return (idx > max * 0.6 ? cut.slice(0, idx) : clean.slice(0, max)).replace(/[\s,.;:–-]+$/, "");
}

export const buildSeoTitle = (brand: string, name: string) =>
  truncateWords(`Jockey ${brand} ${name}`, SEO_TITLE_MAX);

export const buildSeoDescription = (brand: string, name: string) =>
  truncateWords(
    `Jockey ${brand} ${name.toLowerCase()}. Gorra streetwear original de edición limitada. Compra en SPM Store con envíos a todo Chile.`,
    SEO_DESCRIPTION_MAX,
  );

/* ------------------------------------------------------------------ */
/* Imágenes                                                            */
/* ------------------------------------------------------------------ */

export const hasImages = (p: Product) => p.images.some((i) => i.src && i.src !== PLACEHOLDER_IMAGE);

/** Devuelve imágenes del producto o un placeholder con alt descriptivo. */
export function displayImages(p: Product): ProductImage[] {
  if (hasImages(p)) return p.images.filter((i) => i.src);
  return [{ src: PLACEHOLDER_IMAGE, alt: `${p.brand} ${p.name} — fotografía próximamente` }];
}

/* ------------------------------------------------------------------ */
/* Consultas sobre listas                                              */
/* ------------------------------------------------------------------ */

export function getBrands(list: Product[]): Brand[] {
  const map = new Map<string, Brand>();
  for (const p of list) {
    const b = map.get(p.brandSlug) ?? { slug: p.brandSlug, name: p.brand, count: 0, inStock: 0, sold: 0 };
    b.count += 1;
    b.inStock += p.stock;
    b.sold += p.sold;
    map.set(p.brandSlug, b);
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export const getNewArrivals = (list: Product[], limit = 4) =>
  [...list]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt) || Number(!!b.isNew) - Number(!!a.isNew) || b.stock - a.stock)
    .slice(0, limit);

/** Destacados manuales; si no hay suficientes, completa con los más vendidos con stock. */
export function getFeatured(list: Product[], limit = 8) {
  const featured = list.filter((p) => p.isFeatured && p.stock > 0);
  const rest = [...list]
    .filter((p) => !p.isFeatured && p.stock > 0)
    .sort((a, b) => b.sold - a.sold || b.stock - a.stock);
  return [...featured, ...rest].slice(0, limit);
}

export const getRelated = (list: Product[], product: Product, limit = 4) =>
  [
    ...list.filter((p) => p.id !== product.id && p.brandSlug === product.brandSlug),
    ...list.filter((p) => p.id !== product.id && p.brandSlug !== product.brandSlug),
  ].slice(0, limit);

export type SortKey = "destacados" | "nuevos" | "precio-asc" | "precio-desc";

export interface ProductFilters {
  marca?: string;
  q?: string;
  orden?: SortKey;
  stock?: boolean;
}

export function filterProducts(list: Product[], { marca, q, orden = "destacados", stock }: ProductFilters) {
  let out = [...list];
  if (marca) out = out.filter((p) => p.brandSlug === marca);
  if (stock) out = out.filter((p) => p.stock > 0);
  if (q) {
    const term = normalize(q);
    out = out.filter((p) => normalize(`${p.brand} ${p.name} ${p.seoTitle} ${p.color.name}`).includes(term));
  }
  switch (orden) {
    case "nuevos":
      out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      break;
    case "precio-asc":
      out.sort((a, b) => a.price - b.price);
      break;
    case "precio-desc":
      out.sort((a, b) => b.price - a.price);
      break;
    default:
      out.sort(
        (a, b) =>
          Number(b.stock > 0) - Number(a.stock > 0) ||
          Number(!!b.isFeatured) - Number(!!a.isFeatured) ||
          b.sold - a.sold ||
          b.stock - a.stock,
      );
  }
  return out;
}
