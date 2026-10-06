"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Search, Plus, Minus, Check, AlertTriangle, TrendingUp } from "lucide-react";
import { Product, displayImages } from "@/lib/products";
import styles from "./Inventory.module.css";

export default function InventoryClient({ initialProducts }: { initialProducts: Product[] }) {
  const [query, setQuery] = useState("");
  // Local state for rapid adjustments before saving
  const [inventory, setInventory] = useState<{ [id: string]: { stock: number, sold: number } }>(
    initialProducts.reduce((acc, p) => ({ ...acc, [p.id]: { stock: p.stock, sold: p.sold } }), {})
  );

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((p) => {
      return (p.name + " " + p.brand + " " + p.slug).toLowerCase().includes(query.toLowerCase());
    });
  }, [initialProducts, query]);

  const handleAdjustStock = (id: string, delta: number) => {
    setInventory(prev => {
      const current = prev[id];
      const newStock = Math.max(0, current.stock + delta);
      return { ...prev, [id]: { ...current, stock: newStock } };
    });
  };

  const handleRegisterSale = (id: string) => {
    setInventory(prev => {
      const current = prev[id];
      if (current.stock <= 0) return prev;
      return { ...prev, [id]: { stock: current.stock - 1, sold: current.sold + 1 } };
    });
  };

  const handleSave = (id: string) => {
    // Aquí se llamaría a la API: /api/admin/products con el ID y los nuevos valores de stock y sold
    alert(`Guardado stock de producto ${id} en BD local/Supabase`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Control de Inventario Rápido</h2>
          <p className={styles.subtitle}>Ajusta el stock o registra ventas directas desde esta vista.</p>
        </div>
      </div>

      <div className={styles.filtersBar}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por marca o modelo..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.grid}>
        {filteredProducts.map(p => {
          const state = inventory[p.id];
          const img = displayImages(p)[0];
          const hasChanged = state.stock !== p.stock || state.sold !== p.sold;

          return (
            <div key={p.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <Image src={img.src} alt={img.alt} width={50} height={50} className={styles.img} />
                <div className={styles.info}>
                  <p className={styles.brand}>{p.brand}</p>
                  <p className={styles.name}>{p.name}</p>
                </div>
              </div>

              <div className={styles.statsRow}>
                <div className={styles.statBox}>
                  <p className={styles.statLabel}>Vendidos</p>
                  <p className={styles.statVal}>{state.sold}</p>
                </div>
                <div className={styles.statBox}>
                  <p className={styles.statLabel}>Stock Disp.</p>
                  <p className={`${styles.statVal} ${state.stock === 0 ? styles.valAlert : ""}`}>
                    {state.stock}
                  </p>
                </div>
              </div>

              <div className={styles.actions}>
                <div className={styles.adjustGroup}>
                  <button onClick={() => handleAdjustStock(p.id, -1)} className={styles.adjustBtn} disabled={state.stock === 0}>
                    <Minus size={14} />
                  </button>
                  <span className={styles.adjustLabel}>Stock</span>
                  <button onClick={() => handleAdjustStock(p.id, 1)} className={styles.adjustBtn}>
                    <Plus size={14} />
                  </button>
                </div>

                <button 
                  onClick={() => handleRegisterSale(p.id)} 
                  className={styles.saleBtn}
                  disabled={state.stock === 0}
                >
                  <TrendingUp size={14} /> Venta
                </button>
              </div>

              {hasChanged && (
                <button onClick={() => handleSave(p.id)} className={styles.saveBtn}>
                  <Check size={14} /> Guardar Cambios
                </button>
              )}
              {state.stock === 0 && !hasChanged && (
                <div className={styles.alertMsg}>
                  <AlertTriangle size={14} /> Agotado
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
