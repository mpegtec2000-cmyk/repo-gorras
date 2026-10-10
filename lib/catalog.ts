import fs from "fs/promises";
import path from "path";
import { Product } from "./products";
import catalogData from "./catalog-data.json";
import { supabase } from "./supabase";

let cachedProducts: Product[] = catalogData as Product[];

const LIB_CATALOG_PATH = path.join(process.cwd(), "lib", "catalog-data.json");
const DATA_CATALOG_PATH = path.join(process.cwd(), "data", "catalog.json");

function mapFromDb(row: any): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    brandSlug: row.brand_slug || row.brandSlug || "",
    seoTitle: row.seo_title || row.seoTitle || "",
    seoDescription: row.seo_description || row.seoDescription || "",
    price: Number(row.price) || 0,
    compareAtPrice: row.compare_at_price != null ? Number(row.compare_at_price) : null,
    color: row.color || { name: "Negro", hex: "#0b0b0b" },
    sizes: row.sizes || ["Única · Ajustable"],
    images: row.images || [],
    initialStock: Number(row.initial_stock ?? row.initialStock ?? 1),
    sold: Number(row.sold ?? 0),
    stock: Number(row.stock ?? 1),
    isNew: Boolean(row.is_new ?? row.isNew),
    isFeatured: Boolean(row.is_featured ?? row.isFeatured),
    isActive: Boolean(row.is_active ?? row.isActive ?? true),
    description: row.description || "",
    specs: row.specs || [],
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
    updatedAt: row.updated_at || row.updatedAt,
  };
}

function mapToDb(p: Product): Record<string, any> {
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
    is_new: p.isNew,
    is_featured: p.isFeatured,
    is_active: p.isActive,
    description: p.description,
    specs: p.specs,
    created_at: p.createdAt,
    updated_at: new Date().toISOString(),
  };
}

export async function getProducts(): Promise<Product[]> {
  // 1. Intentar leer desde Supabase con timeout seguro
  try {
    const { data, error } = await Promise.race([
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      new Promise<any>((_, reject) => setTimeout(() => reject(new Error("Supabase timeout")), 1500))
    ]);

    if (!error && Array.isArray(data) && data.length > 0) {
      cachedProducts = data.map(mapFromDb);
      return cachedProducts;
    }
  } catch {
    // Si Supabase falla o tiene timeout, continúa a fallback local
  }

  // 2. Fallback a catálogo JSON local
  try {
    const raw = await fs.readFile(LIB_CATALOG_PATH, "utf-8");
    cachedProducts = JSON.parse(raw);
    return cachedProducts;
  } catch {
    return cachedProducts;
  }
}

export async function getProduct(idOrSlug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.slug === idOrSlug || p.id === idOrSlug) || null;
}

export async function saveProduct(product: Product): Promise<Product> {
  const products = await getProducts();
  const index = products.findIndex((p) => p.id === product.id || p.slug === product.slug);

  let result: Product;
  if (index >= 0) {
    products[index] = { ...products[index], ...product };
    result = products[index];
  } else {
    products.unshift(product);
    result = product;
  }

  cachedProducts = products;
  const jsonStr = JSON.stringify(products, null, 2);

  // Guardar local
  await Promise.all([
    fs.writeFile(LIB_CATALOG_PATH, jsonStr, "utf-8").catch(() => {}),
    fs.writeFile(DATA_CATALOG_PATH, jsonStr, "utf-8").catch(() => {}),
  ]);

  // Sincronizar en Supabase en segundo plano si está disponible
  void supabase.from("products").upsert(mapToDb(result));

  return result;
}

export async function updateProductPartial(id: string, updates: Partial<Product>): Promise<Product | null> {
  const products = await getProducts();
  const index = products.findIndex((p) => p.id === id || p.slug === id);
  if (index === -1) return null;

  products[index] = { ...products[index], ...updates };
  cachedProducts = products;
  const jsonStr = JSON.stringify(products, null, 2);

  await Promise.all([
    fs.writeFile(LIB_CATALOG_PATH, jsonStr, "utf-8").catch(() => {}),
    fs.writeFile(DATA_CATALOG_PATH, jsonStr, "utf-8").catch(() => {}),
  ]);

  // Sincronizar en Supabase
  void supabase.from("products").update(mapToDb(products[index])).eq("id", id);

  return products[index];
}

export async function deleteProduct(id: string): Promise<boolean> {
  const products = await getProducts();
  const filtered = products.filter((p) => p.id !== id && p.slug !== id);
  if (filtered.length === products.length) return false;

  cachedProducts = filtered;
  const jsonStr = JSON.stringify(filtered, null, 2);

  await Promise.all([
    fs.writeFile(LIB_CATALOG_PATH, jsonStr, "utf-8").catch(() => {}),
    fs.writeFile(DATA_CATALOG_PATH, jsonStr, "utf-8").catch(() => {}),
  ]);

  // Eliminar en Supabase
  void supabase.from("products").delete().eq("id", id);

  return true;
}
