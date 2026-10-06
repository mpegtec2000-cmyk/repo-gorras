import fs from "node:fs";
import path from "node:path";
import { Product } from "./products";
import { supabase } from "./supabase";

const LOCAL_CATALOG_PATH = path.resolve(process.cwd(), "data/catalog.json");

/** Lee catálogo local desde JSON */
function readLocalCatalog(): Product[] {
  try {
    if (fs.existsSync(LOCAL_CATALOG_PATH)) {
      const raw = fs.readFileSync(LOCAL_CATALOG_PATH, "utf8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Error leyendo catalog.json local:", err);
  }
  return [];
}

/** Escribe catálogo local en JSON */
function writeLocalCatalog(products: Product[]) {
  try {
    const dir = path.dirname(LOCAL_CATALOG_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(LOCAL_CATALOG_PATH, JSON.stringify(products, null, 2), "utf8");
  } catch (err) {
    console.error("Error escribiendo catalog.json local:", err);
  }
}

/** Mapea fila de Supabase a Product */
function mapRowToProduct(row: any): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    brandSlug: row.brand_slug,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    price: Number(row.price),
    compareAtPrice: row.compare_at_price ? Number(row.compare_at_price) : null,
    color: row.color || { name: "Negro", hex: "#0b0b0b" },
    sizes: row.sizes || ["Única · Ajustable"],
    images: row.images || [],
    initialStock: row.initial_stock ?? row.stock ?? 1,
    sold: row.sold ?? 0,
    stock: row.stock ?? 0,
    isNew: row.is_new ?? false,
    isFeatured: row.is_featured ?? false,
    isActive: row.is_active ?? true,
    description: row.description || "",
    specs: row.specs || [],
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at,
  };
}

/** Mapea Product a fila de Supabase */
function mapProductToRow(p: Product) {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    brand_slug: p.brandSlug,
    seo_title: p.seoTitle,
    seo_description: p.seoDescription,
    price: p.price,
    compare_at_price: p.compareAtPrice,
    color: p.color,
    sizes: p.sizes,
    images: p.images,
    initial_stock: p.initialStock,
    sold: p.sold,
    stock: p.stock,
    is_new: p.isNew ?? false,
    is_featured: p.isFeatured ?? false,
    is_active: p.isActive ?? true,
    description: p.description,
    specs: p.specs,
    updated_at: new Date().toISOString(),
  };
}

/** Obtiene todos los productos (Supabase con fallback a JSON local) */
export async function getAllProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase.from("products").select("*").order("id", { ascending: true });
    if (!error && data && data.length > 0) {
      return data.map(mapRowToProduct);
    }
  } catch (e) {
    // Fallback silencioso a local
  }
  return readLocalCatalog();
}

/** Obtiene producto por slug */
export async function getProductBySlugServer(slug: string): Promise<Product | null> {
  const all = await getAllProducts();
  return all.find((p) => p.slug === slug) || null;
}

/** Guarda o actualiza un producto */
export async function saveProduct(product: Product): Promise<Product> {
  const local = readLocalCatalog();
  const existingIdx = local.findIndex((p) => p.id === product.id);

  const updated: Product = {
    ...product,
    updatedAt: new Date().toISOString(),
  };

  if (existingIdx >= 0) {
    local[existingIdx] = updated;
  } else {
    local.unshift(updated);
  }
  writeLocalCatalog(local);

  // Intentar sincronizar con Supabase
  try {
    const row = mapProductToRow(updated);
    await supabase.from("products").upsert(row);
  } catch (e) {
    console.warn("Could not sync product to Supabase, saved locally:", e);
  }

  return updated;
}

/** Elimina un producto por ID */
export async function deleteProduct(id: string): Promise<boolean> {
  const local = readLocalCatalog().filter((p) => p.id !== id);
  writeLocalCatalog(local);

  try {
    await supabase.from("products").delete().eq("id", id);
  } catch (e) {
    // Ignore
  }
  return true;
}
