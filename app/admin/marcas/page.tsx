import React from "react";
import { getBrands } from "@/lib/products";
import { getProducts as getAllProducts } from "@/lib/catalog";
import styles from "../ventas/Ventas.module.css"; // Reuse table styles

export const metadata = {
  title: "Marcas y Colecciones | SaaS Admin",
};

export default async function BrandsPage() {
  const products = await getAllProducts();
  const brands = getBrands(products);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Gestión de Marcas ({brands.length})</h2>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Marca</th>
              <th>Slug</th>
              <th>Productos Totales</th>
              <th>Stock Disponible</th>
              <th>Gorras Vendidas</th>
            </tr>
          </thead>
          <tbody>
            {brands.map(b => (
              <tr key={b.slug}>
                <td style={{ fontWeight: 600 }}>{b.name}</td>
                <td>{b.slug}</td>
                <td>{b.count} modelos</td>
                <td>{b.inStock} un.</td>
                <td>{b.sold} un.</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
