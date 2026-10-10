"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Download, RefreshCw, Plus, Eye, MousePointerClick, Package, TrendingUp } from "lucide-react";
import { formatCLP } from "@/lib/products";
import { RealAnalyticsMetrics } from "@/lib/analytics-server";
import styles from "./Flujo.module.css";
import { useRouter } from "next/navigation";

export default function FlujoClient({ initialMetrics }: { initialMetrics: RealAnalyticsMetrics }) {
  const router = useRouter();
  const [metrics, setMetrics] = useState<RealAnalyticsMetrics>(initialMetrics);
  const [refreshing, setRefreshing] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Auto-refresco en vivo cada 10 segundos
  useEffect(() => {
    const fetchLatestMetrics = async () => {
      try {
        const res = await fetch("/api/admin/flujo");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.metrics) {
            setMetrics(data.metrics);
          }
        }
      } catch (err) {
        // Fallback silencioso
      }
    };

    const interval = setInterval(fetchLatestMetrics, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/admin/flujo");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.metrics) {
          setMetrics(data.metrics);
        }
      }
    } finally {
      setRefreshing(false);
    }
  };

  const handleSyncSupabase = async () => {
    try {
      setSyncing(true);
      const res = await fetch("/api/admin/sync", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        await handleManualRefresh();
        alert("✅ " + data.message);
      } else {
        alert("❌ Error al sincronizar con Supabase: " + (data.error || "Desconocido"));
      }
    } catch (e: any) {
      alert("❌ Error de conexión: " + e.message);
    } finally {
      setSyncing(false);
    }
  };

  const handleExportCSV = () => {
    const headers = "Ranking,Producto,Marca,Precio CLP,Stock,Visitas y Clics,Agregados a Bolsa,Unidades Vendidas,Conversion %\n";
    const rows = metrics.rankedProducts.map((p, index) => {
      const name = `"${p.name.replace(/"/g, '""')}"`;
      const brand = `"${p.brand}"`;
      return `${index + 1},${name},${brand},${p.price},${p.stock},${p.clicks},${p.addedToCart},${p.sold},${p.conversionRate}%`;
    }).join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `spm_analitica_flujo_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Porcentajes del embudo reales (basados 100% en visitas del sitio)
  const visits = metrics.siteVisits;
  const pViewsWidth = visits > 0 ? Math.min(100, Math.max(4, Math.round((metrics.productViews / visits) * 100))) : 0;
  const cartAddsWidth = visits > 0 ? Math.min(100, Math.max(4, Math.round((metrics.cartAdds / visits) * 100))) : 0;
  const purchasesWidth = visits > 0 ? Math.min(100, Math.max(4, Math.round((metrics.purchases / visits) * 100))) : 0;

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.pageTitle}>Flujo de Visitas & Analítica en Vivo</h1>
          <p className={styles.pageSubtitle}>
            Catálogo oficial de {metrics.rankedProducts.length} productos • {new Set(metrics.rankedProducts.map(p => p.brand)).size} marcas • Medición 100% Real
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.btnSecondary} onClick={handleExportCSV}>
            <Download size={16} /> Exportar CSV
          </button>
          <button className={styles.btnSecondary} onClick={handleManualRefresh} disabled={refreshing}>
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} /> {refreshing ? "Actualizando..." : "Actualizar"}
          </button>
          <button className={styles.btnSecondary} onClick={handleSyncSupabase} disabled={syncing}>
            <RefreshCw size={16} className={syncing ? "animate-spin" : ""} /> {syncing ? "Sincronizando..." : "Sincronizar Supabase"}
          </button>
          <button className={styles.btnPrimary} onClick={() => router.push('/admin/productos/nuevo')}>
            <Plus size={16} /> Nuevo Producto
          </button>
        </div>
      </div>

      <div className={styles.metricsGrid}>
        {/* VISITAS REALES DEL SITIO */}
        <div className={styles.metricCard}>
          <div className={styles.mcHeader}>
            <span>VISITAS DEL SITIO</span>
            <Eye size={16} className={styles.mcIcon} />
          </div>
          <div className={styles.mcValue}>{metrics.siteVisits.toLocaleString("es-CL")}</div>
          <div className={styles.mcFooter}>
            <span className={styles.liveBadge}>
              <span 
                className={styles.pulseDot} 
                style={{ backgroundColor: metrics.activeUsersNow > 0 ? "#10b981" : "#9ca3af" }}
              />
              {metrics.activeUsersNow} {metrics.activeUsersNow === 1 ? "activo ahora" : "activos ahora"}
            </span>
          </div>
        </div>

        {/* MÁS SELECCIONADO REAL */}
        <div className={styles.metricCard}>
          <div className={styles.mcHeader}>
            <span>MÁS SELECCIONADO</span>
            <MousePointerClick size={16} className={styles.mcIcon} />
          </div>
          <div className={styles.mcValueText}>
            {metrics.topProduct ? metrics.topProduct.name : "Sin interacción aún"}
          </div>
          <div className={styles.mcFooterText}>
            {metrics.topProduct ? `${metrics.topProduct.clicks} clics / vistas` : "0 clics registrados"}
          </div>
        </div>

        {/* STOCK DISPONIBLE REAL */}
        <div className={styles.metricCard}>
          <div className={styles.mcHeader}>
            <span>STOCK DISPONIBLE</span>
            <Package size={16} className={styles.mcIcon} />
          </div>
          <div className={styles.mcValue}>{metrics.currentStock}</div>
          <div className={styles.mcFooterText}>
            de {metrics.initialStock} iniciales
          </div>
        </div>

        {/* VENTAS REALES */}
        <div className={styles.metricCard}>
          <div className={styles.mcHeader}>
            <span>VENTAS REALIZADAS</span>
            <TrendingUp size={16} className={styles.mcIcon} />
          </div>
          <div className={styles.mcValueGreen}>{metrics.purchases}</div>
          <div className={styles.mcFooterTextGreen}>
            {formatCLP(metrics.totalRevenue)} generados
          </div>
        </div>
      </div>

      {/* EMBUDO DE CONVERSIÓN CON NÚMEROS Y BARRAS 100% REALES */}
      <div className={styles.funnelSection}>
        <div className={styles.funnelHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Embudo de Conversión y Flujo de Usuarios</h2>
            <p className={styles.sectionSubtitle}>Recorrido completo desde la visita inicial hasta la compra</p>
          </div>
          <span className={styles.liveBadgeLight}>
            <span className={styles.pulseDot}></span> Medición en Vivo
          </span>
        </div>

        <div className={styles.funnelSteps}>
          <div className={styles.step}>
            <span className={styles.stepNum}>1. VISITAS SITIO</span>
            <span className={styles.stepVal}>{metrics.siteVisits.toLocaleString("es-CL")}</span>
            <div 
              className={styles.stepBar} 
              style={{ width: metrics.siteVisits > 0 ? "100%" : "0%", backgroundColor: '#111827' }} 
            />
          </div>
          <div className={styles.step}>
            <span className={styles.stepNum}>2. VISTA PRODUCTO</span>
            <span className={styles.stepVal}>{metrics.productViews.toLocaleString("es-CL")}</span>
            <div 
              className={styles.stepBar} 
              style={{ width: `${pViewsWidth}%`, backgroundColor: '#1f2937' }} 
            />
          </div>
          <div className={styles.step}>
            <span className={styles.stepNum}>3. AGREGADO BOLSA</span>
            <span className={styles.stepVal}>{metrics.cartAdds.toLocaleString("es-CL")}</span>
            <div 
              className={styles.stepBar} 
              style={{ width: `${cartAddsWidth}%`, backgroundColor: '#374151' }} 
            />
          </div>
          <div className={styles.step}>
            <span className={styles.stepNum}>4. COMPRA EXITOSA</span>
            <span className={styles.stepValGreen}>{metrics.purchases.toLocaleString("es-CL")}</span>
            <div 
              className={styles.stepBar} 
              style={{ width: `${purchasesWidth}%`, backgroundColor: '#10b981' }} 
            />
          </div>
        </div>
      </div>

      {/* RANKING CON MÉTRICAS REALES POR PRODUCTO */}
      <div className={styles.rankingSection}>
        <div className={styles.rankingHeader}>
          <h2 className={styles.sectionTitle}>Ranking: Productos Más Seleccionados y Vistos</h2>
          <p className={styles.sectionSubtitle}>Interacciones de clientes en la tienda en tiempo real</p>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>RANKING / PRODUCTO</th>
                <th>MARCA</th>
                <th>VISITAS / CLICS</th>
                <th>AGREGADOS A LA BOLSA</th>
                <th>UNIDADES VENDIDAS</th>
                <th>CONVERSIÓN %</th>
              </tr>
            </thead>
            <tbody>
              {metrics.rankedProducts.slice(0, 15).map((p, index) => {
                const img = (p.images && p.images[0]) || { src: "/brand/spm-logo-black.png", alt: p.name };
                
                return (
                  <tr key={p.id}>
                    <td>
                      <div className={styles.productCell}>
                        <span className={styles.rankNum}>#{index + 1}</span>
                        <Image src={img.src} alt={img.alt} width={36} height={36} className={styles.productImg} />
                        <span className={styles.productName}>{p.name}</span>
                      </div>
                    </td>
                    <td>{p.brand}</td>
                    <td>
                      <div className={styles.metricCell}>
                        <MousePointerClick size={14} color="#6366f1" /> {p.clicks}
                      </div>
                    </td>
                    <td>
                      <div className={styles.metricCell}>
                        <Package size={14} color="#10b981" /> {p.addedToCart}
                      </div>
                    </td>
                    <td className={p.sold > 0 ? styles.valGreen : ""}>{p.sold}</td>
                    <td>
                      <span className={styles.conversionBadge}>{p.conversionRate}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
