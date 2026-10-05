/**
 * Catálogo de productos (maqueta).
 * La forma de `Product` replica la futura tabla `products` de Supabase,
 * así en la fase 2 solo se reemplaza el origen de datos.
 */

export type CategorySlug = "snapback" | "trucker" | "curva" | "dad-hat" | "fitted" | "gorros";

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  image: string;
}

export interface ProductImage {
  src: string;
  alt: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  /** Título optimizado para Google: [Tipo] + [Material/Color] - [Diseño] */
  seoTitle: string;
  category: CategorySlug;
  price: number;
  compareAtPrice?: number;
  color: { name: string; hex: string };
  sizes: string[];
  images: ProductImage[];
  stock: number;
  isNew?: boolean;
  isFeatured?: boolean;
  description: string;
  specs: { label: string; value: string }[];
  createdAt: string;
}

export const categories: Category[] = [
  {
    slug: "curva",
    name: "Curvas",
    description: "Jockeys de visera curva, estructurados y con bordados en relieve.",
    image: "/products/cap-black-thorns.webp",
  },
  {
    slug: "snapback",
    name: "Snapback",
    description: "Visera plana y cierre snap ajustable. El clásico del streetwear.",
    image: "/products/cap-black-snapback.webp",
  },
  {
    slug: "trucker",
    name: "Trucker",
    description: "Frente estructurado y malla trasera para máxima ventilación.",
    image: "/products/cap-black-trucker-red.webp",
  },
  {
    slug: "dad-hat",
    name: "Dad Hat",
    description: "Perfil bajo, algodón lavado y ajuste relajado.",
    image: "/products/cap-cream-dad.webp",
  },
  {
    slug: "fitted",
    name: "Fitted",
    description: "Talla cerrada, corona alta y lana premium.",
    image: "/products/cap-grey-fitted.webp",
  },
  {
    slug: "gorros",
    name: "Gorros",
    description: "Beanies de punto acanalado para el frío de la ciudad.",
    image: "/products/beanie-black-spm.webp",
  },
];

const ADJUSTABLE = ["Única · Ajustable"];

export const products: Product[] = [
  {
    id: "spm-001",
    slug: "jockey-curvo-thorns-heart-negro",
    name: "Thorns Heart Curva",
    seoTitle: "Jockey Curvo Negro Gamuza - Bordado Espinas y Corazón Rojo",
    category: "curva",
    price: 34990,
    color: { name: "Negro", hex: "#0a0a0a" },
    sizes: ADJUSTABLE,
    images: [
      { src: "/products/cap-black-thorns.webp", alt: "Jockey curvo negro SPM con bordado de espinas y corazón rojo, vista frontal" },
      { src: "/hero/mobile/fondo-3-1080.webp", alt: "Modelo usando jockey curvo negro Thorns Heart de SPM frente a muro de ladrillo" },
      { src: "/hero/mobile/fondo-6-1080.webp", alt: "Jockey Thorns Heart negro de SPM en uso, vista lateral" },
      { src: "/hero/mobile/fondo-5-1080.webp", alt: "Modelo con jockey curvo negro de espinas y corazones rojos al aire libre" },
    ],
    stock: 12,
    isNew: true,
    isFeatured: true,
    description:
      "El modelo insignia de SPM. Gamuza negra con espinas bordadas tono sobre tono que recorren toda la corona y un corazón rojo en relieve. Estructura de 5 paneles y visera curva pre-moldeada.",
    specs: [
      { label: "Material", value: "Gamuza sintética premium" },
      { label: "Visera", value: "Curva pre-moldeada" },
      { label: "Bordado", value: "3D espinas + corazón rojo" },
      { label: "Cierre", value: "Snap ajustable" },
      { label: "Paneles", value: "5 paneles estructurados" },
    ],
    createdAt: "2026-09-28",
  },
  {
    id: "spm-002",
    slug: "snapback-silver-star-negro",
    name: "Silver Star Snapback",
    seoTitle: "Snapback Negro Gamuza - Estrellas Plateadas Bordadas y Strass",
    category: "snapback",
    price: 36990,
    color: { name: "Negro", hex: "#0a0a0a" },
    sizes: ADJUSTABLE,
    images: [
      { src: "/products/cap-black-snapback.webp", alt: "Snapback negro SPM con estrellas plateadas bordadas, vista tres cuartos" },
      { src: "/hero/mobile/fondo-2-1080.webp", alt: "Modelo usando gorra negra Silver Star de SPM sobre fondo amarillo" },
      { src: "/hero/mobile/fondo-1-1080.webp", alt: "Colección Silver Star y Thorns Heart de SPM en estudio" },
    ],
    stock: 8,
    isNew: true,
    isFeatured: true,
    description:
      "Snapback de visera plana en gamuza negra con ornamentos de estrella en hilo metálico plateado y microperforaciones con strass. Un statement piece para cualquier fit.",
    specs: [
      { label: "Material", value: "Gamuza + parches de cuero sintético" },
      { label: "Visera", value: "Plana" },
      { label: "Bordado", value: "Hilo metálico plateado" },
      { label: "Cierre", value: "Snapback plástico" },
      { label: "Paneles", value: "6 paneles estructurados" },
    ],
    createdAt: "2026-09-25",
  },
  {
    id: "spm-003",
    slug: "trucker-barbed-heart-negro-rojo",
    name: "Barbed Heart Trucker",
    seoTitle: "Gorra Trucker Negra Malla - Corazón Rojo Alambre de Púas",
    category: "trucker",
    price: 29990,
    color: { name: "Negro / Rojo", hex: "#0a0a0a" },
    sizes: ADJUSTABLE,
    images: [
      { src: "/products/cap-black-trucker-red.webp", alt: "Gorra trucker negra SPM con corazón rojo de alambre de púas bordado" },
      { src: "/hero/mobile/fondo-4-1080.webp", alt: "Grupo usando gorras SPM bajo un puente en la ciudad" },
    ],
    stock: 15,
    isFeatured: true,
    description:
      "Trucker clásica con frente estructurado y malla trasera transpirable. Corazón de alambre de púas bordado en rojo con efecto desgastado.",
    specs: [
      { label: "Material", value: "Algodón + malla poliéster" },
      { label: "Visera", value: "Curva" },
      { label: "Bordado", value: "Rojo efecto distressed" },
      { label: "Cierre", value: "Snapback plástico" },
      { label: "Paneles", value: "5 paneles" },
    ],
    createdAt: "2026-09-10",
  },
  {
    id: "spm-004",
    slug: "snapback-thorns-blanco",
    name: "Thorns Snapback White",
    seoTitle: "Snapback Blanco - Bordado Espinas Negras Visera Plana",
    category: "snapback",
    price: 34990,
    color: { name: "Blanco", hex: "#f5f5f5" },
    sizes: ADJUSTABLE,
    images: [{ src: "/products/cap-white-snapback.webp", alt: "Snapback blanco SPM con espinas negras bordadas en los paneles frontales" }],
    stock: 10,
    isNew: true,
    description:
      "La versión inversa del clásico Thorns: corona blanca con espinas negras bordadas y visera plana. Contraste puro blanco y negro.",
    specs: [
      { label: "Material", value: "Twill de algodón" },
      { label: "Visera", value: "Plana" },
      { label: "Bordado", value: "Espinas negras 3D" },
      { label: "Cierre", value: "Snapback plástico" },
      { label: "Paneles", value: "6 paneles estructurados" },
    ],
    createdAt: "2026-09-30",
  },
  {
    id: "spm-005",
    slug: "trucker-star-foam-blanco",
    name: "Star Foam Trucker",
    seoTitle: "Gorra Trucker Blanca y Negra - Estrella Bordada Frente Foam",
    category: "trucker",
    price: 27990,
    color: { name: "Blanco / Negro", hex: "#f5f5f5" },
    sizes: ADJUSTABLE,
    images: [{ src: "/products/cap-white-trucker.webp", alt: "Gorra trucker blanca con malla negra y estrella bordada SPM" }],
    stock: 20,
    description:
      "Frente de foam blanco con estrella bordada en negro y malla trasera negra. Ligera, fresca y lista para el verano.",
    specs: [
      { label: "Material", value: "Foam + malla poliéster" },
      { label: "Visera", value: "Plana" },
      { label: "Bordado", value: "Estrella negra" },
      { label: "Cierre", value: "Snapback plástico" },
      { label: "Paneles", value: "5 paneles" },
    ],
    createdAt: "2026-08-20",
  },
  {
    id: "spm-006",
    slug: "dad-hat-cross-washed-crema",
    name: "Cross Washed Dad Hat",
    seoTitle: "Dad Hat Crema Algodón Lavado - Cruz Gótica Bordada",
    category: "dad-hat",
    price: 24990,
    compareAtPrice: 29990,
    color: { name: "Crema", hex: "#ece4d4" },
    sizes: ADJUSTABLE,
    images: [{ src: "/products/cap-cream-dad.webp", alt: "Dad hat color crema de algodón lavado con cruz gótica negra bordada" }],
    stock: 6,
    description:
      "Perfil bajo sin estructura, algodón lavado de tacto suave y cruz gótica bordada en negro. Correa trasera con hebilla metálica.",
    specs: [
      { label: "Material", value: "100% algodón lavado" },
      { label: "Visera", value: "Curva" },
      { label: "Bordado", value: "Cruz gótica negra" },
      { label: "Cierre", value: "Correa con hebilla metálica" },
      { label: "Paneles", value: "6 paneles sin estructura" },
    ],
    createdAt: "2026-07-15",
  },
  {
    id: "spm-007",
    slug: "fitted-flame-wool-gris",
    name: "Flame Wool Fitted",
    seoTitle: "Gorra Fitted Gris Carbón Lana - Llamas Góticas Bordadas",
    category: "fitted",
    price: 39990,
    color: { name: "Gris carbón", hex: "#3a3a3a" },
    sizes: ["7", "7 1/8", "7 1/4", "7 3/8", "7 1/2", "7 5/8"],
    images: [{ src: "/products/cap-grey-fitted.webp", alt: "Gorra fitted gris carbón de lana con llamas góticas bordadas en el costado" }],
    stock: 0,
    description:
      "Fitted de corona alta en mezcla de lana gris carbón, visera plana negra y llamas góticas bordadas en el panel lateral.",
    specs: [
      { label: "Material", value: "Mezcla de lana" },
      { label: "Visera", value: "Plana" },
      { label: "Bordado", value: "Llamas laterales" },
      { label: "Cierre", value: "Talla cerrada (fitted)" },
      { label: "Paneles", value: "6 paneles, corona alta" },
    ],
    createdAt: "2026-06-01",
  },
  {
    id: "spm-008",
    slug: "gorro-rib-knit-spm-negro",
    name: "Rib Knit Beanie",
    seoTitle: "Gorro Beanie Negro Punto Acanalado - Etiqueta SPM",
    category: "gorros",
    price: 19990,
    color: { name: "Negro", hex: "#0a0a0a" },
    sizes: ["Única"],
    images: [{ src: "/products/beanie-black-spm.webp", alt: "Gorro beanie negro de punto acanalado con etiqueta blanca SPM" }],
    stock: 25,
    description:
      "Beanie de punto acanalado con doblez y etiqueta tejida SPM. Abrigador, elástico y fácil de combinar.",
    specs: [
      { label: "Material", value: "Acrílico suave" },
      { label: "Tejido", value: "Punto acanalado" },
      { label: "Detalle", value: "Etiqueta tejida SPM" },
      { label: "Talla", value: "Única" },
    ],
    createdAt: "2026-05-10",
  },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const clp = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
export const formatCLP = (value: number) => clp.format(value);

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);

export const getProductBySlug = (slug: string) => products.find((p) => p.slug === slug);

export const getFeatured = () => products.filter((p) => p.isFeatured);

export const getNewArrivals = (limit = 4) =>
  [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit);

export const getRelated = (product: Product, limit = 4) =>
  [
    ...products.filter((p) => p.id !== product.id && p.category === product.category),
    ...products.filter((p) => p.id !== product.id && p.category !== product.category),
  ].slice(0, limit);

export type SortKey = "destacados" | "nuevos" | "precio-asc" | "precio-desc";

export interface ProductFilters {
  categoria?: string;
  q?: string;
  orden?: SortKey;
  stock?: boolean;
}

const normalize = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export function filterProducts(list: Product[], { categoria, q, orden = "destacados", stock }: ProductFilters) {
  let out = [...list];
  if (categoria) out = out.filter((p) => p.category === categoria);
  if (stock) out = out.filter((p) => p.stock > 0);
  if (q) {
    const term = normalize(q);
    out = out.filter((p) => normalize(`${p.name} ${p.seoTitle} ${p.category} ${p.color.name}`).includes(term));
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
      out.sort((a, b) => Number(!!b.isFeatured) - Number(!!a.isFeatured) || b.stock - a.stock);
  }
  return out;
}
