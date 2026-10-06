"use client";

import React, { useMemo } from "react";
import { ArrowUpRight, Package, ShoppingCart, TrendingUp, AlertTriangle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Product } from "@/lib/products";
import styles from "./page.module.css";

const MOCK_TRAFFIC_DATA = [
  { name: 'Lun', visitas: 120, ventas: 4 },
  { name: 'Mar', visitas: 210, ventas: 8 },
  { name: 'Mié', visitas: 180, ventas: 5 },
  { name: 'Jue', visitas: 290, ventas: 12 },
  { name: 'Vie', visitas: 350, ventas: 18 },
  { name: 'Sáb', visitas: 420, ventas: 25 },
  { name: 'Dom', visitas: 380, ventas: 20 },
];

export default function DashboardClient({ initialProducts }: { initialProducts: Product[] }) {
  const totalStock = initialProducts.reduce((acc, p) => acc + p.stock, 0);
  const totalSold = initialProducts.reduce((acc, p) => acc + p.sold, 0);
  const totalRevenue = initialProducts.reduce((acc, p) => acc + (p.sold * p.price), 0);
  const lowStock = initialProducts.filter(p => p.stock > 0 && p.stock <= 2).length;
  const outOfStock = initialProducts.filter(p => p.stock === 0).length;

  const formatter = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' });

  // Agrupar ventas por marca para un gráfico circular o de barras
  const salesByBrand = useMemo(() => {
    const brands: Record<string, number> = {};
    initialProducts.forEach(p => {
      if (p.sold > 0) {
        brands[p.brand] = (brands[p.brand] || 0) + p.sold;
      }
    });
    return Object.entries(brands)
      .map(([name, sold]) => ({ name, sold }))
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5); // top 5 brands
  }, [initialProducts]);

  return (
    <div className={styles.dashboard}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Ventas Totales</span>
            <div className={`${styles.statIcon} ${styles.iconBlue}`}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div className={styles.statValue}>{formatter.format(totalRevenue)}</div>
          <div className={styles.statTrend}>
            <ArrowUpRight size={16} className={styles.trendUp} />
            <span className={styles.trendText}>Ingresos generados</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Gorras Vendidas</span>
            <div className={`${styles.statIcon} ${styles.iconGreen}`}>
              <ShoppingCart size={20} />
            </div>
          </div>
          <div className={styles.statValue}>{totalSold}</div>
          <div className={styles.statTrend}>
            <span className={styles.trendText}>Unidades entregadas</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Inventario Actual</span>
            <div className={`${styles.statIcon} ${styles.iconPurple}`}>
              <Package size={20} />
            </div>
          </div>
          <div className={styles.statValue}>{totalStock}</div>
          <div className={styles.statTrend}>
            <span className={styles.trendText}>Gorras en stock</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Alertas de Stock</span>
            <div className={`${styles.statIcon} ${styles.iconOrange}`}>
              <AlertTriangle size={20} />
            </div>
          </div>
          <div className={styles.statValue}>{outOfStock + lowStock}</div>
          <div className={styles.statTrend}>
            <span className={styles.trendAlertText}>
              {outOfStock} agotados, {lowStock} por agotarse
            </span>
          </div>
        </div>
      </div>

      <div className={styles.mainGrid}>
        {/* Gráfico Real con Recharts */}
        <div className={styles.chartSection}>
          <h2 className={styles.sectionTitle}>Flujo de Visitas vs Ventas (Última Semana)</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={MOCK_TRAFFIC_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisitas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Area type="monotone" dataKey="visitas" stroke="#3b82f6" fillOpacity={1} fill="url(#colorVisitas)" name="Visitas" />
                <Area type="monotone" dataKey="ventas" stroke="#10b981" fillOpacity={1} fill="url(#colorVentas)" name="Ventas" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Productos vs Top Marcas */}
        <div className={styles.topProductsSection}>
          <h2 className={styles.sectionTitle}>Marcas Más Vendidas</h2>
          <div style={{ width: '100%', height: 200, marginBottom: '2rem' }}>
            <ResponsiveContainer>
              <BarChart data={salesByBrand} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontSize: 12 }} width={80} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '6px', border: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="sold" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="Unidades Vendidas" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <h2 className={styles.sectionTitle}>Top Productos</h2>
          <div className={styles.topProductsList}>
            {initialProducts
              .sort((a, b) => b.sold - a.sold)
              .slice(0, 4)
              .map(p => (
                <div key={p.id} className={styles.topProductItem}>
                  <div className={styles.tpInfo}>
                    <p className={styles.tpBrand}>{p.brand}</p>
                    <p className={styles.tpName}>{p.name}</p>
                  </div>
                  <div className={styles.tpStats}>
                    <span className={styles.tpSold}>{p.sold} uds</span>
                    <span className={styles.tpRevenue}>{formatter.format(p.sold * p.price)}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
