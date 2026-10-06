import { Product } from "./products";
import catalogData from "./catalog-data.json";

export async function getProducts(): Promise<Product[]> {
  return catalogData as Product[];
}

export async function getProduct(id: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.id === id) || null;
}

export async function saveProduct(product: Product): Promise<void> {
  // En este prototipo se trabaja solo en lectura de local
  // En futuro se guardará en Supabase
  console.log('Saved product', product.id);
}

export async function deleteProduct(id: string): Promise<void> {
  console.log('Deleted product', id);
}
