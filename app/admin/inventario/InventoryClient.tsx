"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Search, Plus, Minus, Check, AlertTriangle, TrendingUp, Loader2 } from "lucide-react";
import { Product, displayImages } from "@/lib/products";
import styles from "./Inventory.module.css";

export default function InventoryClient({ initialProducts }: { initialProducts: Product[] }) {
  const [query, setQuery] = useState("");
  const [savedProducts, setSavedProducts] = useState<Product[]>(initialProducts);
  const [inventory, setInventory] = useState<{ [id: string]: { stock: number; sold: number } }>(
    initialProducts.reduce((acc, p) => ({ ...acc, [p.id]: { stock: p.stock, sold: p.sold } }), {})
  );
  const [savingId, setSavingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return savedProducts.filter((p) => {
      return (p.name + " " + p.brand + " " + p.slug).toLowerCase().includes(query.toLowerCase());
    });
  }, [savedProducts, query]);

  const handleAdjustStock = (id: string, delta: number) => {
    setInventory((prev) => {
      const current = prev[id] || { stock: 0, sold: 0 };
      const newStock = Math.max(0, current.stock + delta);
      return { ...prev, [id]: { ...current, stock: newStock } };
    });
  };

  const handleRegisterSale = (id: string) => {
    setInventory((prev) => {
      const current = prev[id] || { stock: 0, sold: 0 };
      if (current.stock <= 0) return prev;
      return { ...prev, [id]: { stock: current.stock - 1, sold: current.sold + 1 } };
    });
  };

  const handleSave = async (id: string) => {
    const state = inventory[id];
    if (!state) return;

    try {
      setSavingId(id);
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          stock: state.stock,
          sold: state.sold,
        }),
      });

      const data = await res.json();
      if (data.success && data.product) {
        setSavedProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, stock: state.stock, sold: state.sold } : p))
        );
        setSuccessId(id);
        setTimeout(() => setSuccessId(null), 2500);
      } else {
        alert("Error al actualizar stock: " + (data.error || "Desconocido"));
      }
    } catch (err: any) {
      alert("Error de conexión: " + err.message);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Control de Inventario ({filteredProducts.length} Gorras)</h2>
          <p className={styles.subtitle}>
            Ajusta el stock o registra ventas directas vinculadas automáticamente con la tienda.
          </p>
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
        {filteredProducts.map((p) => {
          const state = inventory[p.id] || { stock: p.stock, sold: p.sold };
          const img = displayImages(p)[0];
          const hasChanged = state.stock !== p.stock || state.sold !== p.sold;
          const isSaving = savingId === p.id;
          const isSuccess = successId === p.id;

          return (
            <div key={p.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <Image src={img.src} alt={img.alt || p.name} width={50} height={50} className={styles.img} />
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
                  <button
                    onClick={() => handleAdjustStock(p.id, -1)}
                    className={styles.adjustBtn}
                    disabled={state.stock === 0}
                    type="button"
                  >
                    <Minus size={14} />
                  </button>
                  <span className={styles.adjustLabel}>Stock</span>
                  <button
                    onClick={() => handleAdjustStock(p.id, 1)}
                    className={styles.adjustBtn}
                    type="button"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  onClick={() => handleRegisterSale(p.id)}
                  className={styles.saleBtn}
                  disabled={state.stock === 0}
                  type="button"
                >
                  <TrendingUp size={14} /> Venta
                </button>
              </div>

              {hasChanged && (
                <button
                  onClick={() => handleSave(p.id)}
                  disabled={isSaving}
                  className={styles.saveBtn}
                  type="button"
                >
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  {isSaving ? "Guardando..." : "Guardar en Tienda"}
                </button>
              )}

              {isSuccess && (
                <div style={{ color: "#10b981", fontSize: "0.8rem", fontWeight: 700, marginTop: "0.5rem", textAlign: "center" }}>
                  ✓ Stock actualizado en catálogo
                </div>
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
