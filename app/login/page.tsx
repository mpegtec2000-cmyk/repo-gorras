"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LayoutDashboard, ShoppingBag, ArrowRight, CheckCircle2, ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";
import styles from "./login.module.css";
import AdminLogin from "./AdminLogin";
import ClientLogin from "./ClientLogin";

function LoginContent() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  
  const initialView = typeParam === "admin" ? "admin" 
                    : typeParam === "customer" ? "customer" 
                    : "selection";

  const [view, setView] = useState<"selection" | "admin" | "customer">(initialView);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Brand Header */}
        <div className={styles.brandHeader}>
          <Link href="/">
            <Image
              src="/brand/spm-logo-white.png"
              alt="SPM Streetwear Logo"
              width={160}
              height={40}
              priority
              className={styles.logoImg}
            />
          </Link>
          <h1 className={styles.title}>PASARELA DE ACCESO</h1>
          <p className={styles.subtitle}>
            Selecciona tu perfil de ingreso a la plataforma SPM Streetwear
          </p>
        </div>

        {/* Roles Grid OR Login Form */}
        {view === "selection" && (
          <div className={styles.grid}>
            {/* Card Admin / Trabajador */}
            <div className={`${styles.card} ${styles.cardPrimary}`}>
              <div className={styles.cardIcon}>
                <LayoutDashboard size={26} />
              </div>

              <span className={styles.roleTag}>PANEL SAAS ADM</span>
              <h2 className={styles.cardTitle}>TRABAJADOR / ADMINISTRADOR</h2>
              <p className={styles.cardDesc}>
                Acceso al panel SaaS de administración de productos, carga masiva de stock, imágenes WebP, metadata Google SEO y métricas en tiempo real.
              </p>

              <ul className={styles.features}>
                <li className={styles.featureItem}>
                  <CheckCircle2 size={16} className={styles.featureIcon} />
                  Gestión de los 45 productos de la tienda
                </li>
                <li className={styles.featureItem}>
                  <CheckCircle2 size={16} className={styles.featureIcon} />
                  Carga de imágenes WebP + Etiquetas SEO
                </li>
              </ul>

              <button
                onClick={() => setView("admin")}
                className={`${styles.btn} ${styles.btnPrimary}`}
              >
                <span>INGRESAR COMO TRABAJADOR</span>
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Card Cliente */}
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <ShoppingBag size={26} />
              </div>

              <span className={`${styles.roleTag}`}>
                TIENDA & CLIENTE
              </span>
              <h2 className={styles.cardTitle}>ACCESO CLIENTE</h2>
              <p className={styles.cardDesc}>
                Portal de compras para clientes, seguimiento de drops exclusivos, carrito de compras y catálogo de gorras streetwear.
              </p>

              <ul className={styles.features}>
                <li className={styles.featureItem}>
                  <CheckCircle2 size={16} className={styles.featureIcon} />
                  Catálogo completo de gorras streetwear
                </li>
                <li className={styles.featureItem}>
                  <CheckCircle2 size={16} className={styles.featureIcon} />
                  Bolsa de compras con stock actualizado
                </li>
              </ul>

              <button
                onClick={() => setView("customer")}
                className={`${styles.btn} ${styles.btnOutline}`}
              >
                <span>INGRESAR COMO CLIENTE</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {view === "admin" && (
          <div className={styles.formContainer}>
            <AdminLogin onBack={() => setView("selection")} />
          </div>
        )}

        {view === "customer" && (
          <div className={styles.formContainer}>
            <ClientLogin onBack={() => setView("selection")} />
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <Link href="/" className={styles.backLink}>
            <ArrowLeft size={16} />
            Volver al Inicio del sitio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={<div style={{color: 'white', padding: '2rem'}}>Cargando pasarela...</div>}>
      <LoginContent />
    </React.Suspense>
  );
}
