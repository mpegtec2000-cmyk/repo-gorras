"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Tag, Users, Settings, TrendingUp, Store } from "lucide-react";
import styles from "./layout.module.css";

export default function SidebarNav() {
  const pathname = usePathname();

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
        <Link href="/admin/productos" className={`${styles.navLink} ${pathname === "/admin/productos" ? styles.activeLink : ""}`}>
          <Package size={18} />
          <span>Productos (45)</span>
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
          <Users size={18} />
          <span>Stock & Ventas</span>
        </Link>
        <Link href="/admin/marcas" className={`${styles.navLink} ${pathname.startsWith("/admin/marcas") ? styles.activeLink : ""}`}>
          <Users size={18} />
          <span>Marcas (9)</span>
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
