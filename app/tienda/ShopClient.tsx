"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, X, Filter } from "lucide-react";
import ProductCard from "@/app/components/ProductCard";
import {
  Product,
  filterProducts,
  getBrands,
  SortKey,
} from "@/lib/products";
import styles from "./ShopClient.module.css";

interface ShopClientProps {
  initialProducts: Product[];
}

export default function ShopClient({ initialProducts }: ShopClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedBrand = searchParams.get("marca") || "";
  const initialQuery = searchParams.get("q") || "";
  const initialSort = (searchParams.get("orden") as SortKey) || "destacados";

  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState<SortKey>(initialSort);
  const [onlyInStock, setOnlyInStock] = useState(false);

  const brands = useMemo(() => getBrands(initialProducts), [initialProducts]);

  const filteredProducts = useMemo(() => {
    return filterProducts(initialProducts, {
      marca: selectedBrand,
      q: query,
      orden: sort,
      stock: onlyInStock,
    });
  }, [initialProducts, selectedBrand, query, sort, onlyInStock]);

  const handleBrandSelect = (brandSlug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (brandSlug) {
      params.set("marca", brandSlug);
    } else {
      params.delete("marca");
    }
    router.push(`/tienda?${params.toString()}`);
  };

  const handleSortChange = (newSort: SortKey) => {
    setSort(newSort);
    const params = new URLSearchParams(searchParams.toString());
    params.set("orden", newSort);
    router.push(`/tienda?${params.toString()}`);
  };

  const clearAllFilters = () => {
    setQuery("");
    setOnlyInStock(false);
    setSort("destacados");
    router.push("/tienda");
  };

  return (
    <div className={styles.shopContainer}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className="container">
          <span className={styles.breadcrumb}>INICIO / TIENDA</span>
          <h1 className={styles.title}>CATÁLOGO SPM STREETWEAR</h1>
          <p className={styles.subtitle}>
            Gorras estructuradas, bordados 3D y marcas originales. Envíos a todo Chile.
          </p>
        </div>
      </div>

      <div className="container">
        {/* Top Control Bar */}
        <div className={styles.controlBar}>
          {/* Search Input */}
          <div className={styles.searchWrapper}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar por marca, modelo o color..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={styles.searchInput}
            />
            {query && (
              <button onClick={() => setQuery("")} className={styles.clearSearchBtn}>
                <X size={16} />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className={styles.sortWrapper}>
            <label htmlFor="sort-select" className={styles.sortLabel}>ORDENAR POR:</label>
            <select
              id="sort-select"
              value={sort}
              onChange={(e) => handleSortChange(e.target.value as SortKey)}
              className={styles.sortSelect}
            >
              <option value="destacados">Destacados SPM</option>
              <option value="nuevos">Más Nuevos</option>
              <option value="precio-asc">Precio: Menor a Mayor</option>
              <option value="precio-desc">Precio: Mayor a Menor</option>
            </select>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className={styles.shopLayout}>
          {/* Sidebar Filters */}
          <aside className={styles.sidebar}>
            <div className={styles.filterGroup}>
              <h3 className={styles.filterTitle}>MARCAS</h3>
              <ul className={styles.categoryList}>
                <li>
                  <button
                    onClick={() => handleBrandSelect("")}
                    className={`${styles.categoryBtn} ${!selectedBrand ? styles.activeCat : ""}`}
                  >
                    <span>Todas las Marcas</span>
                    <span className={styles.catCount}>{initialProducts.length}</span>
                  </button>
                </li>
                {brands.map((b) => {
                  const isActive = selectedBrand === b.slug;
                  return (
                    <li key={b.slug}>
                      <button
                        onClick={() => handleBrandSelect(b.slug)}
                        className={`${styles.categoryBtn} ${isActive ? styles.activeCat : ""}`}
                      >
                        <span>{b.name}</span>
                        <span className={styles.catCount}>{b.count}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className={styles.filterGroup}>
              <h3 className={styles.filterTitle}>DISPONIBILIDAD</h3>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className={styles.checkbox}
                />
                <span>Solo productos en stock</span>
              </label>
            </div>

            {(selectedBrand || query || onlyInStock) && (
              <button onClick={clearAllFilters} className={styles.clearAllBtn}>
                LIMPIAR FILTROS
              </button>
            )}
          </aside>

          {/* Product Grid */}
          <div className={styles.gridContainer}>
            <div className={styles.resultsInfo}>
              <span>Mostrando {filteredProducts.length} productos</span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className={styles.noResults}>
                <p className={styles.noResultsTitle}>NO SE ENCONTRARON PRODUCTOS</p>
                <p className={styles.noResultsDesc}>
                  Intenta cambiar tus términos de búsqueda o filtros.
                </p>
                <button onClick={clearAllFilters} className={styles.resetBtn}>
                  VER TODO EL CATÁLOGO
                </button>
              </div>
            ) : (
              <div className={styles.productGrid}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
