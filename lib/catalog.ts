import fs from "fs/promises";
import path from "path";
import { Product } from "./products";
import catalogData from "./catalog-data.json";

let cachedProducts: Product[] = catalogData as Product[];

const LIB_CATALOG_PATH = path.join(process.cwd(), "lib", "catalog-data.json");
const DATA_CATALOG_PATH = path.join(process.cwd(), "data", "catalog.json");

export async function getProducts(): Promise<Product[]> {
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

  await Promise.all([
    fs.writeFile(LIB_CATALOG_PATH, jsonStr, "utf-8").catch((e) => console.error("Error writing lib catalog:", e)),
    fs.writeFile(DATA_CATALOG_PATH, jsonStr, "utf-8").catch((e) => console.error("Error writing data catalog:", e)),
  ]);

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
    fs.writeFile(LIB_CATALOG_PATH, jsonStr, "utf-8").catch((e) => console.error("Error writing lib catalog:", e)),
    fs.writeFile(DATA_CATALOG_PATH, jsonStr, "utf-8").catch((e) => console.error("Error writing data catalog:", e)),
  ]);

  return products[index];
}

export async function deleteProduct(id: string): Promise<boolean> {
  const products = await getProducts();
  const filtered = products.filter((p) => p.id !== id && p.slug !== id);
  if (filtered.length === products.length) return false;

  cachedProducts = filtered;
  const jsonStr = JSON.stringify(filtered, null, 2);

  await Promise.all([
    fs.writeFile(LIB_CATALOG_PATH, jsonStr, "utf-8").catch((e) => console.error("Error writing lib catalog:", e)),
    fs.writeFile(DATA_CATALOG_PATH, jsonStr, "utf-8").catch((e) => console.error("Error writing data catalog:", e)),
  ]);

  return true;
}
