"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, Search, ChevronRight, User, Truck, Zap, Shield } from "lucide-react";
import { useCart } from "./CartContext";
import { navLinks, site } from "@/lib/site";
import styles from "./Navbar.module.css";

const DRAWER_BRANDS = [
  { name: "31 Hats", slug: "31-hats" },
  { name: "Cash Only", slug: "cash-only" },
  { name: "Rebel Hats", slug: "rebel-hats" },
  { name: "Dreamer Hats", slug: "dreamer-hats" },
  { name: "Barbas Hats", slug: "barbas-hats" },
  { name: "Fame Club", slug: "fame-club" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems, toggleCart } = useCart();
  const pathname = usePathname();

  // Hide store navbar on SaaS Admin and Login portal
  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) {
    return null;
  }

  useEffect(() => {
    let scrollTimer: NodeJS.Timeout;
    
    const handleScroll = () => {
      setIsScrolling(true);
      
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        setIsScrolling(false);
      }, 150);

      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimer);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [menuOpen]);

  // Manejo fluido de enlaces internos y anclas
  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    if (href === "/" && pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (href.startsWith("/#") && pathname === "/") {
      const id = href.replace("/#", "");
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  };

  return (
    <>
      {/* Top Shipping Bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarContent}>
          <Zap size={14} className={styles.topBarIcon} />
          <p>
            ENVÍOS GRATIS EN COMPRAS SOBRE <strong>$50.000</strong> A TODO CHILE
          </p>
          <Truck size={15} className={styles.topBarIcon} />
        </div>
      </div>

      <header className={`${styles.header} ${scrolled ? styles.scrolled : ""} ${isScrolling ? styles.isScrolling : ""}`}>
        <div className={styles.container}>
          {/* Controles Izquierdos en Móvil: Menú Hamburguesa + Buscar */}
          <div className={styles.leftMobileControls}>
            <button
              className={styles.menuToggle}
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menú"
            >
              <Menu size={24} />
            </button>
            <Link href="/tienda" className={styles.mobileSearchBtn} prefetch={false} aria-label="Buscar productos">
              <Search size={20} />
            </Link>
          </div>

          {/* Logo Oficial SPM (Centrado en móvil, a la izquierda en desktop) */}
          <Link href="/" className={styles.logoLink} prefetch={false} onClick={() => setMenuOpen(false)}>
            <Image
              src="/brand/spm-logo-white.png"
              alt="SPM Streetwear Logo"
              width={135}
              height={32}
              priority
              className={styles.logoImg}
            />
          </Link>

          {/* Navegación Desktop */}
          <nav className={styles.desktopNav}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={false}
                  className={`${styles.navLink} ${isActive ? styles.activeLink : ""}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Acciones Derecha */}
          <div className={styles.actions}>
            {/* Búsqueda en Desktop */}
            <Link href="/tienda" prefetch={false} className={`${styles.iconBtn} ${styles.desktopOnly}`} aria-label="Buscar productos">
              <Search size={20} />
            </Link>

            {/* Accesos en Desktop (Ocultos en barra móvil para no apretar el diseño) */}
            <Link href="/login?type=customer" prefetch={false} className={`${styles.navAuthBtn} ${styles.desktopOnly}`}>
              MI CUENTA
            </Link>
            <Link href="/login?type=admin" prefetch={false} className={`${styles.navAuthBtn} ${styles.desktopOnly}`}>
              COLABORADOR
            </Link>

            {/* Bolsa de compras (Siempre visible en desktop y móvil) */}
            <button
              onClick={toggleCart}
              className={styles.cartBtn}
              aria-label={`Bolsa de compras con ${totalItems} artículos`}
            >
              <ShoppingBag size={22} />
              {totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* Drawer Móvil Lateral Ultra-Completo */}
      <div className={`${styles.mobileDrawer} ${menuOpen ? styles.drawerOpen : ""}`}>
        <div className={styles.drawerOverlay} onClick={() => setMenuOpen(false)} />
        
        <div className={styles.drawerContent}>
          {/* Header del Drawer */}
          <div className={styles.drawerHeader}>
            <Link href="/" onClick={() => setMenuOpen(false)} className={styles.drawerLogoLink}>
              <Image
                src="/brand/spm-logo-white.png"
                alt="SPM Logo"
                width={120}
                height={29}
                className={styles.drawerLogo}
              />
            </Link>
            <button
              onClick={() => setMenuOpen(false)}
              className={styles.closeBtn}
              aria-label="Cerrar menú"
            >
              <X size={24} />
            </button>
          </div>

          {/* Sección de Accesos Requerida por el Usuario: MI CUENTA & COLABORADOR */}
          <div className={styles.drawerAuthSection}>
            <p className={styles.drawerSectionTitle}>ACCESOS Y CUENTA</p>
            <div className={styles.drawerAuthGrid}>
              <Link
                href="/login?type=customer"
                prefetch={false}
                onClick={() => setMenuOpen(false)}
                className={styles.drawerAuthBtn}
              >
                <User size={16} />
                <span>MI CUENTA</span>
              </Link>
              <Link
                href="/login?type=admin"
                prefetch={false}
                onClick={() => setMenuOpen(false)}
                className={`${styles.drawerAuthBtn} ${styles.drawerAuthBtnAdmin}`}
              >
                <Shield size={16} />
                <span>COLABORADOR</span>
              </Link>
            </div>
          </div>

          {/* Navegación Principal */}
          <nav className={styles.mobileNav}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={false}
                onClick={() => handleNavClick(link.href)}
                className={styles.mobileNavLink}
              >
                <span>{link.label}</span>
                <ChevronRight size={18} />
              </Link>
            ))}
          </nav>

          {/* Marcas Activas del Catálogo */}
          <div className={styles.drawerBrandsSection}>
            <p className={styles.drawerSectionTitle}>MARCAS DEL CATÁLOGO</p>
            <div className={styles.brandPillsGrid}>
              {DRAWER_BRANDS.map((b) => (
                <Link
                  key={b.slug}
                  href={`/tienda?marca=${b.slug}`}
                  prefetch={false}
                  onClick={() => setMenuOpen(false)}
                  className={styles.brandPill}
                >
                  {b.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Enlaces de Ayuda y Políticas */}
          <div className={styles.drawerHelpSection}>
            <p className={styles.drawerSectionTitle}>INFORMACIÓN & AYUDA</p>
            <div className={styles.drawerHelpLinks}>
              <Link href="/politicas-de-envio" prefetch={false} onClick={() => setMenuOpen(false)}>
                Envíos Starken / Blue Express
              </Link>
              <Link href="/cambios-y-devoluciones" prefetch={false} onClick={() => setMenuOpen(false)}>
                Garantía Legal SERNAC (6 meses)
              </Link>
              <Link href="/terminos" prefetch={false} onClick={() => setMenuOpen(false)}>
                Términos y Condiciones
              </Link>
              <Link href="/faq" prefetch={false} onClick={() => setMenuOpen(false)}>
                Preguntas Frecuentes (FAQ)
              </Link>
            </div>
          </div>

          {/* Footer del Menú: Comunidad Instagram */}
          <div className={styles.drawerFooter}>
            <p className={styles.drawerSectionTitle}>COMUNIDAD OFICIAL</p>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.instagramLink}
            >
              <span>{site.instagramHandle}</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
