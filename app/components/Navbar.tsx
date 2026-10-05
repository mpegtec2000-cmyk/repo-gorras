"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, Search, ChevronRight } from "lucide-react";
import { useCart } from "./CartContext";
import { navLinks, site } from "@/lib/site";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems, toggleCart } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [menuOpen]);

  return (
    <>
      {/* Top Shipping Bar */}
      <div className={styles.topBar}>
        <p>
          ⚡ ENVÍOS GRATIS EN COMPRAS SOBRE <strong>$50.000</strong> A TODO CHILE ⚡
        </p>
      </div>

      <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
        <div className={styles.container}>
          {/* Mobile Menu Toggle */}
          <button
            className={styles.menuToggle}
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu size={24} />
          </button>

          {/* Logo */}
          <Link href="/" className={styles.logoLink}>
            <Image
              src="/brand/spm-logo-white.png"
              alt="SPM Streetwear Logo"
              width={140}
              height={34}
              priority
              className={styles.logoImg}
            />
          </Link>

          {/* Nav Desktop Links */}
          <nav className={styles.desktopNav}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${styles.navLink} ${isActive ? styles.activeLink : ""}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className={styles.actions}>
            <Link href="/tienda" className={styles.iconBtn} aria-label="Buscar productos">
              <Search size={20} />
            </Link>

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

      {/* Off-Canvas Mobile Drawer */}
      <div className={`${styles.mobileDrawer} ${menuOpen ? styles.drawerOpen : ""}`}>
        <div className={styles.drawerOverlay} onClick={() => setMenuOpen(false)} />
        <div className={styles.drawerContent}>
          <div className={styles.drawerHeader}>
            <Image
              src="/brand/spm-logo-white.png"
              alt="SPM Logo"
              width={120}
              height={30}
            />
            <button
              onClick={() => setMenuOpen(false)}
              className={styles.closeBtn}
              aria-label="Cerrar menú"
            >
              <X size={24} />
            </button>
          </div>

          <nav className={styles.mobileNav}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={styles.mobileNavLink}
              >
                <span>{link.label}</span>
                <ChevronRight size={18} />
              </Link>
            ))}
          </nav>

          <div className={styles.drawerFooter}>
            <p className={styles.socialTitle}>SIGUENOS EN INSTAGRAM</p>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.instagramLink}
            >
              {site.instagramHandle}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
