"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, X, Filter } from "lucide-react";
import ProductCard from "@/app/components/ProductCard";
import {
  products as allProducts,
  categories,
  filterProducts,
  SortKey,
  CategorySlug,
} from "@/lib/products";
import styles from "./ShopClient.module.css";

export default function ShopClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedCategory = searchParams.get("categoria") || "";
  const initialQuery = searchParams.get("q") || "";
  const initialSort = (searchParams.get("orden") as SortKey) || "destacados";

  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState<SortKey>(initialSort);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return filterProducts(allProducts, {
      categoria: selectedCategory,
      q: query,
      orden: sort,
      stock: onlyInStock,
    });
  }, [selectedCategory, query, sort, onlyInStock]);

  const handleCategorySelect = (catSlug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (catSlug) {
      params.set("categoria", catSlug);
    } else {
      params.delete("categoria");
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
            Gorras estructuradas, telas pesadas y detalles metálicos. Envíos a todo Chile.
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
              placeholder="Buscar gorra, modelo o color..."
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

          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className={styles.mobileFilterToggle}
          >
            <Filter size={18} />
            <span>FILTROS</span>
          </button>
        </div>

        {/* Main Content Layout */}
        <div className={styles.shopLayout}>
          {/* Sidebar Filters (Desktop) */}
          <aside className={styles.sidebar}>
            <div className={styles.filterGroup}>
              <h3 className={styles.filterTitle}>CATEGORÍAS</h3>
              <ul className={styles.categoryList}>
                <li>
                  <button
                    onClick={() => handleCategorySelect("")}
                    className={`${styles.categoryBtn} ${!selectedCategory ? styles.activeCat : ""}`}
                  >
                    <span>Todas las Gorras</span>
                    <span className={styles.catCount}>{allProducts.length}</span>
                  </button>
                </li>
                {categories.map((cat) => {
                  const count = allProducts.filter((p) => p.category === cat.slug).length;
                  const isActive = selectedCategory === cat.slug;
                  return (
                    <li key={cat.slug}>
                      <button
                        onClick={() => handleCategorySelect(cat.slug)}
                        className={`${styles.categoryBtn} ${isActive ? styles.activeCat : ""}`}
                      >
                        <span>{cat.name}</span>
                        <span className={styles.catCount}>{count}</span>
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

            {(selectedCategory || query || onlyInStock) && (
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
