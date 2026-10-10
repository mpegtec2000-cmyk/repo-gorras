import fs from "fs/promises";
import path from "path";
import { Product } from "./products";
import catalogData from "./catalog-data.json";
import { supabase, getServiceSupabase } from "./supabase";

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
    clicks: Number(row.clicks ?? 0),
    isNew: Boolean(row.is_new ?? row.isNew),
    isFeatured: Boolean(row.is_featured ?? row.isFeatured),
    isActive: Boolean(row.is_active ?? row.isActive ?? true),
    description: row.description || "",
    specs: row.specs || [],
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
    updatedAt: row.updated_at || row.updatedAt,
  };
}

export function mapToDb(p: Product): Record<string, any> {
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
    clicks: Number(p.clicks ?? 0),
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
  // 1. Intentar leer desde Supabase con cliente de servicio (bypassa RLS)
  try {
    const sb = getServiceSupabase();
    const { data, error } = await sb
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && Array.isArray(data) && data.length > 0) {
      cachedProducts = data.map(mapFromDb);
      return cachedProducts;
    }
  } catch (e) {
    console.warn("Aviso: Supabase getProducts falló, utilizando catálogo local:", e);
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

  // Guardar localmente
  await Promise.all([
    fs.writeFile(LIB_CATALOG_PATH, jsonStr, "utf-8").catch(() => {}),
    fs.writeFile(DATA_CATALOG_PATH, jsonStr, "utf-8").catch(() => {}),
  ]);

  // Sincronizar en Supabase de forma garantizada y esperada
  try {
    const sb = getServiceSupabase();
    const { error } = await sb.from("products").upsert(mapToDb(result));
    if (error) {
      console.error("Error al guardar producto en Supabase:", error);
    } else {
      console.log(`[Supabase] Producto guardado exitosamente: ${result.name} (Stock: ${result.stock})`);
    }
  } catch (err) {
    console.error("Excepción al guardar en Supabase:", err);
  }

  return result;
}

export async function updateProductPartial(id: string, updates: Partial<Product>): Promise<Product | null> {
  const products = await getProducts();
  const index = products.findIndex((p) => p.id === id || p.slug === id);
  if (index === -1) return null;

  products[index] = { ...products[index], ...updates };
  cachedProducts = products;
  const jsonStr = JSON.stringify(products, null, 2);

  // Actualizar archivos locales
  await Promise.all([
    fs.writeFile(LIB_CATALOG_PATH, jsonStr, "utf-8").catch(() => {}),
    fs.writeFile(DATA_CATALOG_PATH, jsonStr, "utf-8").catch(() => {}),
  ]);

  // Actualizar en Supabase garantizado
  try {
    const sb = getServiceSupabase();
    const dbData = mapToDb(products[index]);
    const { error } = await sb.from("products").upsert(dbData);
    if (error) {
      console.error(`Error al actualizar stock/datos en Supabase para ${id}:`, error);
    } else {
      console.log(`[Supabase] Producto ${id} actualizado con éxito. Stock: ${products[index].stock}, Vendidos: ${products[index].sold}`);
    }
  } catch (err) {
    console.error(`Excepción al actualizar en Supabase para ${id}:`, err);
  }

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

  try {
    const sb = getServiceSupabase();
    const { error } = await sb.from("products").delete().eq("id", id);
    if (error) {
      console.error(`Error al eliminar producto ${id} en Supabase:`, error);
    } else {
      console.log(`[Supabase] Producto ${id} eliminado con éxito`);
    }
  } catch (err) {
    console.error(`Excepción al eliminar en Supabase para ${id}:`, err);
  }

  return true;
}

export async function syncCatalogToDatabase(): Promise<{ count: number; error?: string }> {
  try {
    const products = cachedProducts && cachedProducts.length > 0 ? cachedProducts : (catalogData as Product[]);
    const sb = getServiceSupabase();
    const payload = products.map(mapToDb);

    // Upsert masivo
    const { error } = await sb.from("products").upsert(payload);
    if (error) {
      return { count: 0, error: error.message };
    }
    return { count: products.length };
  } catch (err: any) {
    return { count: 0, error: err.message };
  }
}
