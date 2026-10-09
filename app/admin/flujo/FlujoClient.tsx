"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { Download, RefreshCw, Plus, Eye, MousePointerClick, Package, TrendingUp } from "lucide-react";
import { Product, displayImages, formatCLP } from "@/lib/products";
import styles from "./Flujo.module.css";
import { useRouter } from "next/navigation";

export default function FlujoClient({ initialProducts }: { initialProducts: Product[] }) {
  const router = useRouter();

  // Synthetic Analytics based on actual catalog to look like the screenshot
  const totalSold = initialProducts.reduce((acc, p) => acc + p.sold, 0);
  const totalRevenue = initialProducts.reduce((acc, p) => acc + (p.sold * p.price), 0);
  const currentStock = initialProducts.reduce((acc, p) => acc + p.stock, 0);
  const initialStockSum = initialProducts.reduce((acc, p) => acc + p.initialStock, 0);

  // Sorting products by synthetic clicks for the ranking
  const rankedProducts = useMemo(() => {
    return [...initialProducts]
      .map(p => ({
        ...p,
        // Synthetic data to match screenshot vibe
        clicks: Math.floor(p.sold * 100 + (p.price / 1000) + (p.stock * 5)),
        addedToCart: Math.floor(p.sold * 8 + (p.stock * 0.5))
      }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10);
  }, [initialProducts]);

  const topProduct = rankedProducts[0];

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.pageTitle}>Flujo de Visitas & Analítica en Vivo</h1>
          <p className={styles.pageSubtitle}>
            Catálogo oficial de {initialProducts.length} productos • {new Set(initialProducts.map(p => p.brand)).size} marcas • Normas Google SEO WebP
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.btnSecondary}><Download size={16} /> Exportar CSV</button>
          <button className={styles.btnSecondary}><RefreshCw size={16} /> Sincronizar Supabase</button>
          <button className={styles.btnPrimary} onClick={() => router.push('/admin/productos/nuevo')}>
            <Plus size={16} /> Nuevo Producto
          </button>
        </div>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.mcHeader}>
            <span>VISITAS DEL SITIO</span>
            <Eye size={16} className={styles.mcIcon} />
          </div>
          <div className={styles.mcValue}>14,280</div>
          <div className={styles.mcFooter}>
            <span className={styles.liveBadge}>
              <span className={styles.pulseDot}></span> 18 activos ahora
            </span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.mcHeader}>
            <span>MÁS SELECCIONADO</span>
            <MousePointerClick size={16} className={styles.mcIcon} />
          </div>
          <div className={styles.mcValueText}>{topProduct?.name || "N/A"}</div>
          <div className={styles.mcFooterText}>
            {topProduct?.clicks || 0} clics / vistas
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.mcHeader}>
            <span>STOCK DISPONIBLE</span>
            <Package size={16} className={styles.mcIcon} />
          </div>
          <div className={styles.mcValue}>{currentStock}</div>
          <div className={styles.mcFooterText}>
            de {initialStockSum} iniciales
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.mcHeader}>
            <span>VENTAS REALIZADAS</span>
            <TrendingUp size={16} className={styles.mcIcon} />
          </div>
          <div className={styles.mcValueGreen}>{totalSold}</div>
          <div className={styles.mcFooterTextGreen}>
            {formatCLP(totalRevenue)} generados
          </div>
        </div>
      </div>

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
            <span className={styles.stepVal}>14,280</span>
            <div className={styles.stepBar} style={{ width: '100%', backgroundColor: '#111827' }}></div>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNum}>2. VISTA PRODUCTO</span>
            <span className={styles.stepVal}>8,640</span>
            <div className={styles.stepBar} style={{ width: '60%', backgroundColor: '#1f2937' }}></div>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNum}>3. AGREGADO BOLSA</span>
            <span className={styles.stepVal}>1,120</span>
            <div className={styles.stepBar} style={{ width: '15%', backgroundColor: '#374151' }}></div>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNum}>4. COMPRA EXITOSA</span>
            <span className={styles.stepValGreen}>{totalSold}</span>
            <div className={styles.stepBar} style={{ width: '5%', backgroundColor: '#10b981' }}></div>
          </div>
        </div>
      </div>

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
              {rankedProducts.map((p, index) => {
                const img = displayImages(p)[0];
                const conversion = p.clicks > 0 ? ((p.sold / p.clicks) * 100).toFixed(1) : "0.0";
                
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
                      <span className={styles.conversionBadge}>{conversion}%</span>
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
