"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Boxes,
  Tag,
  Settings,
  Search,
  UploadCloud,
  Edit2,
  Trash2,
  ExternalLink,
  Download,
  RefreshCw,
  X,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Store,
  FileSpreadsheet,
} from "lucide-react";
import { Product, formatCLP, displayImages, hasImages } from "@/lib/products";
import styles from "./admin.module.css";

const BRAND_OPTIONS = [
  { slug: "cash-only", name: "Cash Only" },
  { slug: "dreamer-hats", name: "Dreamer Hats" },
  { slug: "icon-hats", name: "Icon Hats" },
  { slug: "rebel-hats", name: "Rebel Hats" },
  { slug: "inedit", name: "Inédit" },
  { slug: "fame-club", name: "Fame Club" },
  { slug: "thirty-one", name: "Thirty One · 31 Hats" },
  { slug: "anymore", name: "Anymore" },
  { slug: "barbas-hats", name: "Barbas Hats" },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "inventory" | "brands" | "settings">("dashboard");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [seedStatus, setSeedStatus] = useState<string | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (e) {
      console.error("Error fetching admin products", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Sync / Seed Supabase button
  const handleSeedDatabase = async () => {
    setSeedStatus("Sincronizando los 45 productos a Supabase...");
    try {
      const res = await fetch("/api/admin/seed", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setSeedStatus(`¡Sincronización exitosa! ${data.seededCount} productos actualizados.`);
        fetchProducts();
      } else {
        setSeedStatus(`Error: ${data.error}`);
      }
    } catch (e: any) {
      setSeedStatus(`Error: ${e.message}`);
    }
    setTimeout(() => setSeedStatus(null), 5000);
  };

  // Metrics
  const stats = useMemo(() => {
    const totalCount = products.length;
    const initialStockTotal = products.reduce((acc, p) => acc + (p.initialStock || 0), 0);
    const soldTotal = products.reduce((acc, p) => acc + (p.sold || 0), 0);
    const currentStockTotal = products.reduce((acc, p) => acc + (p.stock || 0), 0);
    const totalInventoryValue = products.reduce((acc, p) => acc + p.price * p.stock, 0);

    const brandsMap = new Map<string, { count: number; sold: number; stock: number }>();
    for (const p of products) {
      const existing = brandsMap.get(p.brand) || { count: 0, sold: 0, stock: 0 };
      existing.count += 1;
      existing.sold += p.sold || 0;
      existing.stock += p.stock || 0;
      brandsMap.set(p.brand, existing);
    }

    return {
      totalCount,
      initialStockTotal,
      soldTotal,
      currentStockTotal,
      totalInventoryValue,
      brandsCount: brandsMap.size,
      brandsMap: Array.from(brandsMap.entries()),
    };
  }, [products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase());
      const matchBrand = !selectedBrand || p.brandSlug === selectedBrand;
      return matchSearch && matchBrand;
    });
  }, [products, search, selectedBrand]);

  // Open Edit Modal
  const handleOpenAdd = () => {
    setEditingProduct({
      id: `spm-${Date.now().toString(36)}`,
      name: "",
      brand: "Cash Only",
      brandSlug: "cash-only",
      price: 70000,
      initialStock: 1,
      sold: 0,
      stock: 1,
      isActive: true,
      images: [],
      seoTitle: "",
      seoDescription: "",
      description: "",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct({ ...p });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  // Image Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;
    setUploading(true);
    setUploadMessage("Optimizando imagen WebP & generando etiquetas Google SEO...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("alt", editingProduct.name || "Gorra Streetwear");
    formData.append("brand", editingProduct.brand || "SPM");

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        const currentImgs = editingProduct.images || [];
        setEditingProduct({
          ...editingProduct,
          images: [data.image, ...currentImgs],
        });
        setUploadMessage("¡Imagen WebP subida y vinculada!");
      } else {
        setUploadMessage(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setUploadMessage(`Error subiendo imagen: ${err.message}`);
    } finally {
      setUploading(false);
      setTimeout(() => setUploadMessage(null), 4000);
    }
  };

  // Save Modal Form
  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name) return;

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct),
      });
      const data = await res.json();
      if (data.success) {
        fetchProducts();
        setModalOpen(false);
      } else {
        alert(`Error guardando producto: ${data.error}`);
      }
    } catch (err: any) {
      alert(`Error de red: ${err.message}`);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["ID", "Marca", "Modelo/Color", "Stock Inicial", "Vendidas", "Stock Actual", "Precio CLP", "Estado SEO"];
    const rows = products.map((p) => [
      p.id,
      `"${p.brand}"`,
      `"${p.name}"`,
      p.initialStock,
      p.sold,
      p.stock,
      p.price,
      p.seoTitle ? "Optimizado" : "Pendiente",
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `catalogo_spm_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.adminLayout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.brandLogo}>
            <div className={styles.avatar} style={{ background: "#0f172a" }}>
              S
            </div>
            <div className={styles.brandText}>
              <span className={styles.brandTitle}>SPM STORE</span>
              <span className={styles.brandBadge}>SaaS Admin v2.0</span>
            </div>
          </div>
        </div>

        <nav className={styles.nav}>
          <span className={styles.navSectionTitle}>MENÚ PRINCIPAL</span>
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`${styles.navItem} ${activeTab === "dashboard" ? styles.activeNavItem : ""}`}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`${styles.navItem} ${activeTab === "products" ? styles.activeNavItem : ""}`}
          >
            <Package size={18} />
            <span>Productos ({products.length})</span>
          </button>

          <button onClick={handleOpenAdd} className={styles.navItem}>
            <PlusCircle size={18} />
            <span>Subir Producto / SEO</span>
          </button>

          <button
            onClick={() => setActiveTab("inventory")}
            className={`${styles.navItem} ${activeTab === "inventory" ? styles.activeNavItem : ""}`}
          >
            <Boxes size={18} />
            <span>Stock & Ventas</span>
          </button>

          <button
            onClick={() => setActiveTab("brands")}
            className={`${styles.navItem} ${activeTab === "brands" ? styles.activeNavItem : ""}`}
          >
            <Tag size={18} />
            <span>Marcas ({stats.brandsCount})</span>
          </button>

          <span className={styles.navSectionTitle} style={{ marginTop: "1rem" }}>
            SISTEMA
          </span>
          <button
            onClick={() => setActiveTab("settings")}
            className={`${styles.navItem} ${activeTab === "settings" ? styles.activeNavItem : ""}`}
          >
            <Settings size={18} />
            <span>Base de Datos Supabase</span>
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userCard}>
            <div className={styles.avatar}>A</div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>Administrador</span>
              <span className={styles.userRole}>admin@spmstore.cl</span>
            </div>
          </div>
          <div style={{ marginTop: "0.75rem", textAlign: "center" }}>
            <Link
              href="/"
              target="_blank"
              style={{ fontSize: "0.75rem", color: "#64748b", textDecoration: "underline", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
            >
              <Store size={14} /> Ver Tienda en Vivo
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        {/* Top Header */}
        <header className={styles.topBar}>
          <div>
            <h1 className={styles.pageHeaderTitle}>
              {activeTab === "dashboard" && "Dashboard General"}
              {activeTab === "products" && "Gestión de Productos"}
              {activeTab === "inventory" && "Inventario & Control de Stock"}
              {activeTab === "brands" && "Marcas y Colecciones"}
              {activeTab === "settings" && "Configuración de Base de Datos"}
            </h1>
            <p className={styles.pageHeaderSub}>
              Planilla oficial de 45 productos • 9 marcas • Normas Google SEO WebP
            </p>
          </div>

          <div className={styles.headerActions}>
            <button onClick={handleExportCSV} className={styles.btnSecondary} title="Descargar datos en CSV">
              <Download size={16} /> Exportar CSV
            </button>
            <button onClick={handleSeedDatabase} className={styles.btnSecondary} title="Sincronizar cambios a Supabase">
              <RefreshCw size={16} /> Sincronizar Supabase
            </button>
            <button onClick={handleOpenAdd} className={styles.btnPrimary}>
              <PlusCircle size={18} /> Nuevo Producto
            </button>
          </div>
        </header>

        {seedStatus && (
          <div style={{ marginBottom: "1.5rem", padding: "0.85rem 1.25rem", borderRadius: "12px", background: "#eff6ff", border: "1px solid #bfdbfe", color: "#1e40af", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Sparkles size={18} /> {seedStatus}
          </div>
        )}

        {/* Quick Stats Grid */}
        <section className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>TOTAL PRODUCTOS</span>
              <div className={styles.statIconWrapper}>
                <Package size={20} />
              </div>
            </div>
            <span className={styles.statVal}>{stats.totalCount}</span>
            <span style={{ fontSize: "0.725rem", color: "#10b981", fontWeight: 700 }}>45 catálogo real</span>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>STOCK ACTUAL</span>
              <div className={styles.statIconWrapper}>
                <Boxes size={20} />
              </div>
            </div>
            <span className={styles.statVal}>{stats.currentStockTotal}</span>
            <span style={{ fontSize: "0.725rem", color: "#64748b" }}>de {stats.initialStockTotal} iniciales</span>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>UNIDADES VENDIDAS</span>
              <div className={styles.statIconWrapper}>
                <TrendingUp size={20} />
              </div>
            </div>
            <span className={styles.statVal} style={{ color: "#059669" }}>
              {stats.soldTotal}
            </span>
            <span style={{ fontSize: "0.725rem", color: "#059669", fontWeight: 700 }}>Registradas</span>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>VALOR CATÁLOGO</span>
              <div className={styles.statIconWrapper}>
                <Tag size={20} />
              </div>
            </div>
            <span className={styles.statVal}>{formatCLP(stats.totalInventoryValue)}</span>
            <span style={{ fontSize: "0.725rem", color: "#64748b" }}>@ $70.000 c/u</span>
          </div>
        </section>

        {/* Middle Section: Chart + Brand summary */}
        {activeTab === "dashboard" && (
          <div className={styles.middleGrid}>
            {/* Chart Reference Card */}
            <div className={styles.chartCard}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <h3 className={styles.cardHeaderTitle}>Estadísticas de Stock y Ventas por Marca</h3>
                  <p className={styles.cardHeaderSub}>Comparativa de unidades vendidas vs disponible actual</p>
                </div>
              </div>

              {/* Custom SVG Bar Chart */}
              <div className={styles.chartBox}>
                {stats.brandsMap.slice(0, 7).map(([brandName, data]) => {
                  const maxVal = 10;
                  const stockH = Math.min(100, (data.stock / maxVal) * 100);
                  const soldH = Math.min(100, (data.sold / maxVal) * 100);
                  return (
                    <div key={brandName} className={styles.barCol}>
                      <div className={styles.barGroup}>
                        <div className={styles.barPrimary} style={{ height: `${stockH}%` }} title={`Stock disponible: ${data.stock}`} />
                        <div className={styles.barSecondary} style={{ height: `${soldH}%` }} title={`Vendidas: ${data.sold}`} />
                      </div>
                      <span className={styles.barLabel}>{brandName.split(" ")[0]}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: "1.5rem", marginTop: "1rem", fontSize: "0.75rem", color: "#64748b" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: "#0f172a" }} /> Stock Disponible
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: "#e2e8f0" }} /> Vendidas
                </span>
              </div>
            </div>

            {/* Brands Status */}
            <div className={styles.sideCard}>
              <h3 className={styles.cardHeaderTitle}>Resumen por Marcas</h3>
              <p className={styles.cardHeaderSub}>9 marcas oficiales registradas</p>

              <div className={styles.brandList}>
                {stats.brandsMap.slice(0, 5).map(([brandName, data]) => (
                  <div key={brandName} className={styles.brandRow}>
                    <div className={styles.brandInfo}>
                      <div className={styles.brandIcon}>{brandName.slice(0, 2).toUpperCase()}</div>
                      <div>
                        <div className={styles.brandName}>{brandName}</div>
                        <div className={styles.brandStock}>{data.count} modelos</div>
                      </div>
                    </div>
                    <span className={styles.pillBadge}>{data.stock} en stock</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Manage Products Data Table */}
        <div className={styles.tableCard}>
          <div className={styles.tableHeaderBar}>
            <div>
              <h2 className={styles.cardHeaderTitle}>Catálogo de Productos ({filteredProducts.length})</h2>
              <p className={styles.cardHeaderSub}>Lista completa de productos con imágenes WebP y Google SEO</p>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <div className={styles.searchBox}>
                <Search size={16} color="#64748b" />
                <input
                  type="text"
                  placeholder="Buscar por modelo, marca..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={styles.searchInput}
                />
              </div>

              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                style={{ padding: "0.55rem 0.9rem", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "0.85rem", background: "#ffffff", outline: "none" }}
              >
                <option value="">Todas las Marcas</option>
                {BRAND_OPTIONS.map((b) => (
                  <option key={b.slug} value={b.slug}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>PRODUCTO / MARCA</th>
                  <th>INICIAL</th>
                  <th>VENDIDAS</th>
                  <th>STOCK ACTUAL</th>
                  <th>PRECIO CLP</th>
                  <th>IMAGEN & SEO</th>
                  <th style={{ textAlign: "right" }}>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => {
                  const imgs = displayImages(p);
                  const isAvailable = p.stock > 0;
                  const hasCustomImg = hasImages(p);

                  return (
                    <tr key={p.id}>
                      <td>
                        <div className={styles.productCell}>
                          <Image
                            src={imgs[0].src}
                            alt={p.name}
                            width={44}
                            height={44}
                            className={styles.productThumb}
                          />
                          <div className={styles.productMeta}>
                            <span className={styles.productTitle}>{p.name}</span>
                            <span className={styles.productSub}>{p.brand}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontWeight: 600 }}>{p.initialStock}</td>
                      <td style={{ color: p.sold > 0 ? "#059669" : "#64748b", fontWeight: 700 }}>
                        {p.sold}
                      </td>
                      <td>
                        {isAvailable ? (
                          <span className={`${styles.statusTag} ${styles.statusActive}`}>
                            <CheckCircle size={12} /> {p.stock} dispon.
                          </span>
                        ) : (
                          <span className={`${styles.statusTag} ${styles.statusSoldOut}`}>
                            <AlertTriangle size={12} /> Agotado (0)
                          </span>
                        )}
                      </td>
                      <td style={{ fontWeight: 800 }}>{formatCLP(p.price)}</td>
                      <td>
                        {hasCustomImg ? (
                          <span className={`${styles.statusTag} ${styles.statusActive}`}>
                            <CheckCircle size={12} /> WebP Listo
                          </span>
                        ) : (
                          <span className={`${styles.statusTag} ${styles.statusWarning}`}>
                            <UploadCloud size={12} /> Placeholder
                          </span>
                        )}
                      </td>
                      <td>
                        <div className={styles.actionsCell} style={{ justifyContent: "flex-end" }}>
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className={styles.iconBtn}
                            title="Editar datos, subir foto WebP y configurar SEO"
                          >
                            <Edit2 size={16} />
                          </button>
                          <Link
                            href={`/producto/${p.slug}`}
                            target="_blank"
                            className={styles.iconBtn}
                            title="Ver producto en la tienda en vivo"
                          >
                            <ExternalLink size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                            title="Eliminar producto"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal: Editar / Crear Producto + Cargar Imagen WebP SEO */}
      {modalOpen && editingProduct && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <div>
                <h3 className={styles.modalTitle}>
                  {editingProduct.id ? `Editar: ${editingProduct.name}` : "Nuevo Producto"}
                </h3>
                <p style={{ fontSize: "0.8rem", color: "#64748b" }}>
                  Carga imágenes WebP con norma Google SEO y ajusta el inventario
                </p>
              </div>
              <button onClick={() => setModalOpen(false)} className={styles.iconBtn}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveModal}>
              <div className={styles.formGrid}>
                {/* File Upload WebP */}
                <div className={styles.formGroupFull}>
                  <label className={styles.label}>IMAGEN DEL PRODUCTO (WEBP / GOOGLE SEO)</label>
                  <label className={styles.dropzone}>
                    <UploadCloud size={32} color="#6366f1" style={{ margin: "0 auto 0.5rem" }} />
                    <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#0f172a" }}>
                      Selecciona una imagen de tu equipo
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.25rem" }}>
                      Conversión automática a WebP ultraligero y etiqueta ALT descriptiva
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      style={{ display: "none" }}
                      disabled={uploading}
                    />
                  </label>

                  {uploadMessage && (
                    <div style={{ fontSize: "0.8rem", color: "#4f46e5", fontWeight: 600, marginTop: "0.4rem" }}>
                      {uploadMessage}
                    </div>
                  )}

                  {/* Thumbnail Previews */}
                  {editingProduct.images && editingProduct.images.length > 0 && (
                    <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem" }}>
                      {editingProduct.images.map((img, idx) => (
                        <div key={idx} style={{ position: "relative" }}>
                          <Image
                            src={img.src}
                            alt={img.alt}
                            width={70}
                            height={70}
                            style={{ borderRadius: "10px", objectFit: "cover", border: "1px solid #cbd5e1" }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>MARCA</label>
                  <select
                    className={styles.select}
                    value={editingProduct.brandSlug || "cash-only"}
                    onChange={(e) => {
                      const selected = BRAND_OPTIONS.find((b) => b.slug === e.target.value);
                      setEditingProduct({
                        ...editingProduct,
                        brandSlug: e.target.value,
                        brand: selected?.name || "Cash Only",
                      });
                    }}
                  >
                    {BRAND_OPTIONS.map((b) => (
                      <option key={b.slug} value={b.slug}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>MODELO / COLOR (NOMBRE)</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={editingProduct.name || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>STOCK INICIAL</label>
                  <input
                    type="number"
                    className={styles.input}
                    value={editingProduct.initialStock ?? 1}
                    onChange={(e) => setEditingProduct({ ...editingProduct, initialStock: Number(e.target.value) })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>UNIDADES VENDIDAS</label>
                  <input
                    type="number"
                    className={styles.input}
                    value={editingProduct.sold ?? 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sold: Number(e.target.value) })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>STOCK ACTUAL DISPONIBLE</label>
                  <input
                    type="number"
                    className={styles.input}
                    value={editingProduct.stock ?? 1}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>PRECIO (CLP)</label>
                  <input
                    type="number"
                    className={styles.input}
                    value={editingProduct.price || 70000}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                  />
                </div>

                <div className={styles.formGroupFull}>
                  <label className={styles.label}>
                    TÍTULO GOOGLE SEO (MAX 60 CARACTERES)
                  </label>
                  <input
                    type="text"
                    className={styles.input}
                    value={editingProduct.seoTitle || ""}
                    placeholder={`Jockey ${editingProduct.brand || "SPM"} ${editingProduct.name || ""}`}
                    onChange={(e) => setEditingProduct({ ...editingProduct, seoTitle: e.target.value })}
                  />
                </div>

                <div className={styles.formGroupFull}>
                  <label className={styles.label}>
                    META DESCRIPCIÓN GOOGLE (MAX 160 CARACTERES)
                  </label>
                  <textarea
                    rows={2}
                    className={styles.textarea}
                    value={editingProduct.seoDescription || ""}
                    placeholder={`Gorra ${editingProduct.brand || ""} original streetwear...`}
                    onChange={(e) => setEditingProduct({ ...editingProduct, seoDescription: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button type="button" onClick={() => setModalOpen(false)} className={styles.btnSecondary}>
                  Cancelar
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
