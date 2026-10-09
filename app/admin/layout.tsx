import React from "react";
import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, Package, Tag, Users, Settings, LogOut, ArrowLeft, Store, TrendingUp } from "lucide-react";
import styles from "./layout.module.css";
import SidebarNav from "./SidebarNav";
import { getProducts } from "@/lib/catalog";
import { getBrands } from "@/lib/products";

export const metadata = {
  title: "SaaS Admin | SPM Streetwear",
  description: "Panel de administración SPM",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const products = await getProducts();
  const brands = getBrands(products);

  return (
    <div className={styles.adminLayout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/admin">
            <Image
              src="/brand/spm-logo-black.png"
              alt="SPM Admin"
              width={140}
              height={34}
              priority
              className={styles.logo}
            />
          </Link>
          <span className={styles.badge}>SaaS PRO</span>
        </div>

        <SidebarNav initialProductCount={products.length} initialBrandCount={brands.length} />

        <div className={styles.sidebarFooter}>
          <div className={styles.userCard}>
            <div className={styles.userAvatar}>
              <span className={styles.userInitials}>AD</span>
            </div>
            <div className={styles.userInfo}>
              <p className={styles.userName}>Equipo SPM</p>
              <p className={styles.userRole}>Administrador</p>
            </div>
          </div>
          
          <div className={styles.footerActions}>
            <Link href="/" className={styles.actionBtn}>
              <Store size={16} /> Ver Tienda
            </Link>
            <button className={`${styles.actionBtn} ${styles.logoutBtn}`}>
              <LogOut size={16} /> Salir
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Top Header */}
        <header className={styles.topHeader}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>Panel SaaS</h1>
          </div>
          <div className={styles.headerRight}>
            <span className={styles.statusDot}></span>
            <span className={styles.statusText}>Sistema Operativo</span>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className={styles.contentArea}>
          {children}
        </div>
      </main>
    </div>
  );
}
