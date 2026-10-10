"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Tag, Users, Settings, TrendingUp, Store, UserCheck, Layers, Award } from "lucide-react";
import styles from "./layout.module.css";

interface SidebarNavProps {
  initialProductCount?: number;
  initialBrandCount?: number;
}

export default function SidebarNav({ initialProductCount = 74, initialBrandCount = 6 }: SidebarNavProps) {
  const pathname = usePathname();
  const [productCount, setProductCount] = useState<number>(initialProductCount);
  const [brandCount, setBrandCount] = useState<number>(initialBrandCount);
  const [clientCount, setClientCount] = useState<number>(1);

  useEffect(() => {
    if (initialProductCount !== undefined) {
      setProductCount(initialProductCount);
    }
    if (initialBrandCount !== undefined) {
      setBrandCount(initialBrandCount);
    }
  }, [initialProductCount, initialBrandCount]);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch("/api/admin/products");
        if (res.ok) {
          const data = await res.json();
          const items = Array.isArray(data) ? data : (data.products || []);
          if (items.length > 0) {
            setProductCount(items.length);
            const brands = new Set(items.map((p: any) => p.brand).filter(Boolean));
            setBrandCount(brands.size);
          }
        }
      } catch {
        // Fallback
      }

      try {
        const clientRes = await fetch("/api/admin/clientes");
        if (clientRes.ok) {
          const cData = await clientRes.json();
          if (Array.isArray(cData.clients)) {
            setClientCount(cData.clients.length);
          }
        }
      } catch {
        // Fallback
      }
    };

    fetchCounts();

    const handleCatalogUpdate = () => {
      fetchCounts();
    };

    window.addEventListener("catalog-updated", handleCatalogUpdate);
    return () => {
      window.removeEventListener("catalog-updated", handleCatalogUpdate);
    };
  }, []);

  return (
    <nav className={styles.sidebarNav}>
      <div className={styles.navSection}>
        <p className={styles.navTitle}>MENÚ PRINCIPAL</p>
        <Link href="/admin" className={`${styles.navLink} ${pathname === "/admin" ? styles.activeLink : ""}`}>
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </Link>
        <Link href="/admin/flujo" className={`${styles.navLink} ${pathname.startsWith("/admin/flujo") ? styles.activeLink : ""}`}>
          <TrendingUp size={18} />
          <span>Flujo & Analítica</span>
        </Link>
        <Link href="/admin/clientes" className={`${styles.navLink} ${pathname.startsWith("/admin/clientes") ? styles.activeLink : ""}`}>
          <UserCheck size={18} />
          <span>Clientes ({clientCount})</span>
        </Link>
        <Link href="/admin/productos" className={`${styles.navLink} ${pathname === "/admin/productos" ? styles.activeLink : ""}`}>
          <Package size={18} />
          <span>Productos ({productCount})</span>
        </Link>
        <Link href="/admin/ventas" className={`${styles.navLink} ${pathname.startsWith("/admin/ventas") ? styles.activeLink : ""}`}>
          <Store size={18} />
          <span>Ventas & Órdenes</span>
        </Link>
        <Link href="/admin/productos/nuevo" className={`${styles.navLink} ${pathname === "/admin/productos/nuevo" ? styles.activeLink : ""}`}>
          <Tag size={18} />
          <span>Subir Producto / SEO</span>
        </Link>
        <Link href="/admin/inventario" className={`${styles.navLink} ${pathname.startsWith("/admin/inventario") ? styles.activeLink : ""}`}>
          <Layers size={18} />
          <span>Stock & Ventas</span>
        </Link>
        <Link href="/admin/marcas" className={`${styles.navLink} ${pathname.startsWith("/admin/marcas") ? styles.activeLink : ""}`}>
          <Award size={18} />
          <span>Marcas ({brandCount})</span>
        </Link>
      </div>

      <div className={styles.navSection}>
        <p className={styles.navTitle}>SISTEMA</p>
        <Link href="/admin/configuracion" className={`${styles.navLink} ${pathname.startsWith("/admin/configuracion") ? styles.activeLink : ""}`}>
          <Settings size={18} />
          <span>Base de Datos Supabase</span>
        </Link>
      </div>
    </nav>
  );
}
