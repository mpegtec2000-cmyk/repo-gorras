/**
 * Catálogo real SPM — importado desde PRODUCTOS/BASE DE DATOS.xlsx
 * Columnas: Marca | Modelo/color | stock inicial | vendidas | stock actual | PRECIO
 *
 * Se usa como semilla: la primera vez que existe la tabla `products` en Supabase
 * (vacía) estos registros se insertan automáticamente; mientras no exista, la
 * tienda y el panel trabajan sobre `data/catalog.json` generado desde aquí.
 */
import {
  type Product,
  DEFAULT_SIZES,
  buildSeoDescription,
  buildSeoTitle,
  slugify,
} from "./products";

export const BRAND_NAMES: Record<string, string> = {
  "cash-only": "Cash Only",
  "dreamer-hats": "Dreamer Hats",
  "icon-hats": "Icon Hats",
  "rebel-hats": "Rebel Hats",
  inedit: "Inédit",
  "fame-club": "Fame Club",
  "thirty-one": "Thirty One · 31 Hats",
  anymore: "Anymore",
  "barbas-hats": "Barbas Hats",
};

const C = {
  negro: { name: "Negro", hex: "#0b0b0b" },
  marino: { name: "Azul marino", hex: "#1c2541" },
  celeste: { name: "Celeste", hex: "#9cc9e3" },
  militar: { name: "Verde militar", hex: "#4b5320" },
  rosa: { name: "Rosado", hex: "#e8a6b8" },
  cafe: { name: "Café", hex: "#6b4a33" },
  negroGris: { name: "Negro / Gris", hex: "#2b2b2b" },
  petroleo: { name: "Verde petróleo", hex: "#1f4f4f" },
  rojoNegro: { name: "Rojo / Negro", hex: "#a4161a" },
};

type Row = [brandSlug: string, model: string, color: { name: string; hex: string }, initial: number, sold: number, stock: number, price?: number];

const ROWS: Row[] = [
  ["cash-only", "Negro flores azules", C.negro, 4, 0, 4],
  ["cash-only", "Celeste desgastado", C.celeste, 1, 1, 0],
  ["cash-only", "NY azul marino con perlas blancas", C.marino, 2, 2, 0],
  ["cash-only", "Negro cruces 3", C.negro, 1, 0, 1],
  ["cash-only", "Negro cruces plateadas 3", C.negro, 1, 0, 1],
  ["cash-only", "NYC azul marino", C.marino, 2, 0, 2],
  ["cash-only", "Negro Rockstar", C.negro, 1, 0, 1],
  ["dreamer-hats", "Verde militar letras japonesas", C.militar, 2, 1, 1],
  ["dreamer-hats", "Negro letras japonesas", C.negro, 2, 1, 1],
  ["dreamer-hats", "Negro con brillos y letras japonesas", C.negro, 1, 0, 1],
  ["icon-hats", "Negro con brillos Yankees", C.negro, 2, 1, 1],
  ["rebel-hats", "Rosada", C.rosa, 2, 1, 1],
  ["rebel-hats", "Café", C.cafe, 2, 0, 2],
  ["rebel-hats", "Negra R", C.negro, 4, 1, 3],
  ["rebel-hats", "Efecto spray demonio", C.negro, 2, 0, 2],
  ["rebel-hats", "Total black ángel bordado", C.negro, 2, 1, 1],
  ["inedit", "Negro y gris, bordado blanco y grafiti gris", C.negroGris, 2, 0, 2],
  ["inedit", "Lovers Club azul marino con corazón rojo", C.marino, 2, 2, 0],
  ["inedit", "Negra letras beige, efecto spray y visera desgastada", C.negro, 1, 0, 1],
  ["fame-club", "Estrella S celeste con brillos", C.celeste, 1, 0, 1],
  ["fame-club", "Estrella S rosa con brillos", C.rosa, 1, 0, 1],
  ["thirty-one", "Verde petróleo bordado multicolor", C.petroleo, 2, 0, 2],
  ["thirty-one", "Negra letras blancas Boyz", C.negro, 1, 0, 1],
  ["thirty-one", "Negra BB blanco y rojo", C.negro, 2, 0, 2],
  ["thirty-one", "Negra con M y piedras negras", C.negro, 2, 1, 1],
  ["thirty-one", "Negra NY piedras plateadas y corazones rosa", C.negro, 3, 0, 3],
  ["thirty-one", "Negra NY plateado con gris y brillos", C.negro, 1, 0, 1],
  ["thirty-one", "Negra LA rosada con corazón rojo y efecto spray", C.negro, 3, 0, 3],
  ["thirty-one", "Negra LA gris con tachas plateadas", C.negro, 1, 0, 1],
  ["thirty-one", "Negra B grande, piedras negras y detalles grises", C.negro, 1, 0, 1],
  ["thirty-one", "Negra parches rojos, blancos y negros con chapa", C.negro, 1, 0, 1],
  ["thirty-one", "Negra LA plateado con piedras de colores", C.negro, 1, 0, 1],
  ["thirty-one", "Negra Thirty verde con piedras plateadas", C.negro, 1, 0, 1],
  ["thirty-one", "Azul marino LA con piedras de colores", C.marino, 1, 0, 1],
  ["thirty-one", "Negra LA piedras blancas", C.negro, 1, 0, 1],
  ["thirty-one", "Negra Thirty con cruces plateadas en el borde", C.negro, 1, 0, 1],
  ["thirty-one", "Negra B plateada, letras negras y B brillante", C.negro, 1, 0, 1],
  ["thirty-one", "Negra B y corona, piedras negras y malla lateral", C.negro, 1, 0, 1],
  ["thirty-one", "Roja y negra Back Pack Boyz bordada", C.rojoNegro, 1, 0, 1],
  ["thirty-one", "Negra NY blanco con piedras tipo perla", C.negro, 1, 0, 1],
  ["anymore", "Negra letras plateadas, brillos y ángeles grises", C.negro, 2, 1, 1],
  ["barbas-hats", "Café con B rosa", C.cafe, 1, 0, 1],
  ["barbas-hats", "Negra Barbas con gato", C.negro, 1, 0, 1],
  ["barbas-hats", "Negra letras rojas 27 Tumbados Corridos", C.negro, 1, 0, 1],
  ["barbas-hats", "Negra con estrella y piedras negras", C.negro, 1, 0, 1],
];

/** Detalle original de la planilla (para no perder información al limpiar textos). */
const ORIGINAL_DETAIL: Record<number, string> = {
  18: "Negra, letras beige, efecto spray blanco y negro y visera desgastada",
  27: "Negra LA rosada con corazón rojo, efecto spray rosado, bordado lateral y visera negra",
  38: "Roja y negra Back Pack Boyz, bordados blancos y negros",
};

export function buildSeedProducts(): Product[] {
  const used = new Set<string>();
  return ROWS.map(([brandSlug, model, color, initialStock, sold, stock, price = 70000], i) => {
    const brand = BRAND_NAMES[brandSlug];
    let slug = slugify(`jockey ${brandSlug.replace(/-hats$/, "")} ${model}`);
    while (used.has(slug)) slug = `${slug}-${i + 1}`;
    used.add(slug);
    const detail = ORIGINAL_DETAIL[i] || model;
    return {
      id: `spm-${String(i + 1).padStart(3, "0")}`,
      slug,
      name: model,
      brand,
      brandSlug,
      seoTitle: buildSeoTitle(brand, model),
      seoDescription: buildSeoDescription(brand, model),
      price,
      compareAtPrice: null,
      color,
      sizes: DEFAULT_SIZES,
      images: [],
      initialStock,
      sold,
      stock,
      isNew: false,
      isFeatured: sold > 0 && stock > 0,
      isActive: true,
      description: `Jockey ${brand} — ${detail}. Modelo streetwear original de edición limitada, con ajuste trasero regulable. Disponible en SPM Store con envíos a todo Chile.`,
      specs: [
        { label: "Marca", value: brand },
        { label: "Modelo / color", value: detail },
        { label: "Talla", value: "Única · Ajustable" },
      ],
      createdAt: "2026-10-05T00:00:00.000Z",
    } satisfies Product;
  });
}
