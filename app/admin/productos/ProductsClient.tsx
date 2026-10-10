"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, Plus, Filter, Download, Edit, Trash2, RefreshCw } from "lucide-react";
import { Product, formatCLP, displayImages } from "@/lib/products";
import styles from "./Products.module.css";

export default function ProductsClient({ initialProducts }: { initialProducts: Product[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [productsList, setProductsList] = useState(initialProducts);
  const [syncing, setSyncing] = useState(false);

  const filteredProducts = useMemo(() => {
    return productsList.filter((p) => {
      const matchQuery = (p.name + " " + p.brand + " " + p.slug).toLowerCase().includes(query.toLowerCase());
      const matchStatus = 
        statusFilter === "all" ? true :
        statusFilter === "active" ? p.isActive :
        statusFilter === "inactive" ? !p.isActive :
        statusFilter === "low_stock" ? (p.stock > 0 && p.stock <= 2) :
        statusFilter === "out_of_stock" ? p.stock === 0 : true;
      
      return matchQuery && matchStatus;
    });
  }, [productsList, query, statusFilter]);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,Marca,Modelo,Precio,Stock,Vendidos,Estado\n"
      + filteredProducts.map(p => 
          `${p.id},"${p.brand}","${p.name}",${p.price},${p.stock},${p.sold},${p.isActive ? 'Activo' : 'Inactivo'}`
        ).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "spm_productos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSyncDatabase = async () => {
    try {
      setSyncing(true);
      const res = await fetch("/api/admin/sync", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        alert("✅ " + data.message);
        router.refresh();
      } else {
        alert("❌ Error: " + (data.error || "No se pudo sincronizar"));
      }
    } catch (e: any) {
      alert("❌ Error de red: " + e.message);
    } finally {
      setSyncing(false);
    }
  };

  const handleQuickStock = async (id: string, delta: number) => {
    const target = productsList.find((p) => p.id === id);
    if (!target) return;
    const newStock = Math.max(0, target.stock + delta);
    if (newStock === target.stock) return;

    // Optimistic UI update
    setProductsList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: newStock } : p))
    );

    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, stock: newStock }),
      });
      const data = await res.json();
      if (!data.success) {
        alert("Error al actualizar stock: " + (data.error || ""));
        // Revertir
        setProductsList((prev) =>
          prev.map((p) => (p.id === id ? { ...p, stock: target.stock } : p))
        );
      }
    } catch (err: any) {
      alert("Error de conexión: " + err.message);
      setProductsList((prev) =>
        prev.map((p) => (p.id === id ? { ...p, stock: target.stock } : p))
      );
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/productos/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Seguro que deseas eliminar este producto del catálogo oficial?")) {
      try {
        const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
        const data = await res.json();
        if (data.success) {
          setProductsList(prev => prev.filter(p => p.id !== id));
          if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("catalog-updated"));
          }
        } else {
          alert("Error al eliminar el producto");
        }
      } catch (err: any) {
        alert("Error de conexión: " + err.message);
      }
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setProductsList(prev => prev.map(p => p.id === id ? { ...p, isActive: !currentStatus } : p));
      }
    } catch (e: any) {
      console.error(e);
    }
  };

  const handleNew = () => {
    router.push(`/admin/productos/nuevo`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Catálogo de Productos ({filteredProducts.length})</h2>
        <div className={styles.actions}>
          <button className={styles.exportBtn} onClick={handleSyncDatabase} disabled={syncing} title="Sincronizar todo con Supabase">
            <RefreshCw size={16} className={syncing ? "animate-spin" : ""} /> {syncing ? "Sincronizando..." : "Sincronizar Supabase"}
          </button>
          <button className={styles.exportBtn} onClick={handleExport}>
            <Download size={16} /> Exportar CSV
          </button>
          <button className={styles.addBtn} onClick={handleNew}>
            <Plus size={16} /> Nuevo Producto
          </button>
        </div>
      </div>

      <div className={styles.filtersBar}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar producto por nombre, marca o ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.filterBox}>
          <Filter size={18} className={styles.filterIcon} />
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activos en tienda</option>
            <option value="inactive">Ocultos</option>
            <option value="low_stock">Stock bajo (1-2)</option>
            <option value="out_of_stock">Agotados (0)</option>
          </select>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Marca</th>
              <th>Precio</th>
              <th>Inventario</th>
              <th>Estado</th>
              <th className={styles.textRight}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.emptyState}>No se encontraron productos.</td>
              </tr>
            ) : (
              filteredProducts.map((p) => {
                const img = displayImages(p)[0];
                return (
                  <tr key={p.id}>
                    <td>
                      <div className={styles.productCell}>
                        <Image src={img.src} alt={img.alt} width={40} height={40} className={styles.productImg} />
                        <div>
                          <p className={styles.productName}>{p.name}</p>
                          <p className={styles.productId}>{p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td>{p.brand}</td>
                    <td>{formatCLP(p.price)}</td>
                    <td>
                      <div className={styles.stockInfo}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                          <button
                            onClick={() => handleQuickStock(p.id, -1)}
                            disabled={p.stock <= 0}
                            title="Disminuir stock (-1)"
                            type="button"
                            style={{
                              border: "1px solid #cbd5e1",
                              borderRadius: "4px",
                              backgroundColor: "#ffffff",
                              cursor: p.stock <= 0 ? "not-allowed" : "pointer",
                              padding: "2px 6px",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              color: "#475569",
                              lineHeight: 1,
                            }}
                          >
                            -
                          </button>
                          <span className={`${styles.stockBadge} ${p.stock === 0 ? styles.stockNone : p.stock <= 2 ? styles.stockLow : styles.stockOk}`}>
                            {p.stock} un.
                          </span>
                          <button
                            onClick={() => handleQuickStock(p.id, 1)}
                            title="Aumentar stock (+1)"
                            type="button"
                            style={{
                              border: "1px solid #cbd5e1",
                              borderRadius: "4px",
                              backgroundColor: "#ffffff",
                              cursor: "pointer",
                              padding: "2px 6px",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              color: "#475569",
                              lineHeight: 1,
                            }}
                          >
                            +
                          </button>
                        </div>
                        <span className={styles.soldText}>{p.sold} vendidos</span>
                      </div>
                    </td>
                    <td>
                      <span 
                        onClick={() => handleToggleStatus(p.id, p.isActive)}
                        style={{ cursor: "pointer", userSelect: "none" }}
                        title="Clic para cambiar visibilidad en tienda"
                        className={`${styles.statusBadge} ${p.isActive ? styles.statusActive : styles.statusInactive}`}
                      >
                        {p.isActive ? "Activo" : "Oculto"}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button className={styles.iconBtn} title="Editar" onClick={() => handleEdit(p.id)}>
                          <Edit size={16} />
                        </button>
                        <button className={`${styles.iconBtn} ${styles.dangerBtn}`} title="Eliminar" onClick={() => handleDelete(p.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
