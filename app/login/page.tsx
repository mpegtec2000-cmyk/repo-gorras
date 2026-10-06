"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, ShoppingBag, ArrowRight, ShieldCheck, CheckCircle2, Lock, Sparkles, ArrowLeft } from "lucide-react";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  const handleBypassLogin = (role: "admin" | "customer") => {
    setLoadingRole(role);
    // Simula sesión en cookie o localStorage
    try {
      localStorage.setItem("spm_session", JSON.stringify({ role, timestamp: Date.now() }));
    } catch (e) {
      // Ignore
    }
    setTimeout(() => {
      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/tienda");
      }
    }, 400);
  };

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

        {/* Roles Grid */}
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
              <li className={styles.featureItem}>
                <CheckCircle2 size={16} className={styles.featureIcon} />
                Control de Stock, Vendidas e Inventario
              </li>
            </ul>

            <button
              onClick={() => handleBypassLogin("admin")}
              disabled={loadingRole !== null}
              className={`${styles.btn} ${styles.btnPrimary}`}
            >
              <span>{loadingRole === "admin" ? "INGRESANDO AL SAAS..." : "INGRESAR COMO TRABAJADOR"}</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Card Cliente */}
          <div className={styles.card}>
            <div className={styles.cardIcon}>
              <ShoppingBag size={26} />
            </div>

            <span className={`${styles.roleTag}`} style={{ background: "rgba(16, 185, 129, 0.2)", color: "#34d399" }}>
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
                Filtros por Marca y Orden de Precios
              </li>
              <li className={styles.featureItem}>
                <CheckCircle2 size={16} className={styles.featureIcon} />
                Bolsa de compras con stock actualizado
              </li>
            </ul>

            <button
              onClick={() => handleBypassLogin("customer")}
              disabled={loadingRole !== null}
              className={`${styles.btn} ${styles.btnOutline}`}
            >
              <span>{loadingRole === "customer" ? "INGRESANDO A LA TIENDA..." : "INGRESAR COMO CLIENTE"}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Temporary Bypass Notice */}
        <div className={styles.bypassNotice}>
          <Sparkles size={16} />
          <span>MODO MODO MUESTRA ACTIVO: Ingreso libre sin clave para revisión del sitio y SaaS.</span>
        </div>

        <div style={{ textAlign: "center" }}>
          <Link href="/" className={styles.backLink}>
            <ArrowLeft size={16} />
            Volver al Inicio del sitio
          </Link>
        </div>
      </div>
    </div>
  );
}
