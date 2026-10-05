"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { site, navLinks } from "@/lib/site";
import styles from "./Footer.module.css";

function InstagramIcon({ size = 24, className }: { size?: number | string; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className={styles.footer} id="nosotros">
      {/* Guarantees Ribbon */}
      <div className={styles.guaranteesBar}>
        <div className="container">
          <div className={styles.guaranteesGrid}>
            <div className={styles.guaranteeItem}>
              <Truck size={24} />
              <div>
                <h4>DESPACHOS A TODO CHILE</h4>
                <p>Envíos por Starken y Blue Express</p>
              </div>
            </div>

            <div className={styles.guaranteeItem}>
              <ShieldCheck size={24} />
              <div>
                <h4>CALIDAD GARANTIZADA</h4>
                <p>Gamuza, lana y bordados 3D de alta densidad</p>
              </div>
            </div>

            <div className={styles.guaranteeItem}>
              <RotateCcw size={24} />
              <div>
                <h4>CAMBIOS Y DEVOLUCIONES</h4>
                <p>Garantía de satisfacción directa</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container">
        <div className={styles.mainGrid}>
          {/* Brand Col */}
          <div className={styles.brandCol}>
            <Image
              src="/brand/spm-logo-white.png"
              alt="SPM Streetwear Logo"
              width={160}
              height={38}
              className={styles.logo}
            />
            <p className={styles.brandDesc}>
              SPM® — Marca chilena de gorras y accesorios streetwear. Diseños exclusivos con bordados en relieve, viseras de máxima calidad y estética urbana pura.
            </p>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.instagramBtn}
            >
              <InstagramIcon size={18} />
              <span>{site.instagramHandle}</span>
              <ArrowUpRight size={16} />
            </a>
          </div>

          {/* Links Col */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>NAVEGACIÓN</h4>
            <ul className={styles.linkList}>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories Col */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>MODELOS</h4>
            <ul className={styles.linkList}>
              <li><Link href="/tienda?categoria=curva">Gorras Curvas</Link></li>
              <li><Link href="/tienda?categoria=snapback">Snapback Plana</Link></li>
              <li><Link href="/tienda?categoria=trucker">Trucker Malla</Link></li>
              <li><Link href="/tienda?categoria=dad-hat">Dad Hat</Link></li>
              <li><Link href="/tienda?categoria=fitted">Fitted Cerrada</Link></li>
              <li><Link href="/tienda?categoria=gorros">Gorros / Beanies</Link></li>
            </ul>
          </div>

          {/* Newsletter Col */}
          <div className={styles.newsletterCol}>
            <h4 className={styles.colTitle}>JOIN THE DROP CLUB</h4>
            <p className={styles.newsletterDesc}>
              Suscríbete para acceder antes que nadie a lanzamientos exclusivos y drops limitados.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className={styles.newsletterForm}>
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className={styles.emailInput}
                required
              />
              <button type="submit" className={styles.submitBtn}>
                UNIRME
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <p>© {new Date().getFullYear()} {site.name}®. TODOS LOS DERECHOS RESERVADOS.</p>
          <p className={styles.legalNotice}>SANTIAGO DE CHILE • STREETWEAR BRAND</p>
        </div>
      </div>
    </footer>
  );
}
