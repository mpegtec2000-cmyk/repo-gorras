"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  CreditCard,
  Package,
  Lock
} from "lucide-react";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import styles from "./Footer.module.css";

function InstagramIcon({ size = 20, className }: { size?: number | string; className?: string }) {
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

const BRAND_LINKS = [
  { name: "31 Hats", slug: "31-hats", count: 24 },
  { name: "Cash Only", slug: "cash-only", count: 22 },
  { name: "Rebel Hats", slug: "rebel-hats", count: 14 },
  { name: "Dreamer Hats", slug: "dreamer-hats", count: 6 },
  { name: "Barbas Hats", slug: "barbas-hats", count: 4 },
  { name: "Fame Club", slug: "fame-club", count: 4 },
];

export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) {
    return null;
  }

  const isDropsPage = pathname.startsWith("/drops");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3500);
    }
  };

  return (
    <footer className={styles.footer} id="nosotros">
      {/* Guarantees Ribbon (oculto en la sección Drops para mantener el look editorial limpio) */}
      {!isDropsPage && (
        <div className={styles.guaranteesBar}>
        <div className="container">
          <div className={styles.guaranteesGrid}>
            <div className={styles.guaranteeItem}>
              <div className={styles.guaranteeIconWrapper}>
                <Truck size={22} />
              </div>
              <div className={styles.guaranteeText}>
                <h4>DESPACHOS A TODO CHILE</h4>
                <p>Envíos diarios vía Starken y Blue Express</p>
              </div>
            </div>

            <div className={styles.guaranteeItem}>
              <div className={styles.guaranteeIconWrapper}>
                <ShieldCheck size={22} />
              </div>
              <div className={styles.guaranteeText}>
                <h4>PRODUCTOS 100% ORIGINALES</h4>
                <p>Gamuza, lana premium y bordados 3D</p>
              </div>
            </div>

            <div className={styles.guaranteeItem}>
              <div className={styles.guaranteeIconWrapper}>
                <RotateCcw size={22} />
              </div>
              <div className={styles.guaranteeText}>
                <h4>GARANTÍA DE SATISFACCIÓN</h4>
                <p>Cambios y devoluciones sin complicaciones</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Main Footer */}
      <div className="container">
        <div className={styles.mainGrid}>
          {/* Brand Col */}
          <div className={styles.brandCol}>
            <Link href="/" className={styles.logoLink}>
              <Image
                src="/brand/spm-logo-black.png"
                alt="SPM Streetwear Logo"
                width={155}
                height={36}
                className={styles.logo}
                priority
              />
            </Link>
            <p className={styles.brandDesc}>
              SPM® — Marca chilena de gorras streetwear de colección. Diseños estructurados, bordados 3D de alta densidad y edición limitada. Hecho para la calle.
            </p>
            <div className={styles.brandBadge}>
              <Lock size={13} />
              <span>COMPRA SEGURA & EDICIONES LIMITADAS</span>
            </div>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.instagramBtn}
            >
              <InstagramIcon size={18} />
              <span>{site.instagramHandle}</span>
              <ArrowUpRight size={15} />
            </a>
          </div>

          {/* Links Col: Navegación */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>NAVEGACIÓN</h4>
            <ul className={styles.linkList}>
              <li><Link href="/">Inicio</Link></li>
              <li><Link href="/tienda">Tienda Oficial</Link></li>
              <li><Link href="/drops">Drops & Lookbook IG</Link></li>
              <li><Link href="/tienda?orden=precio-desc">Colección Limitada</Link></li>
              <li><Link href="/#nosotros">Sobre SPM Store</Link></li>
            </ul>
          </div>

          {/* Categories Col: Marcas */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>MARCAS EXCLUSIVAS</h4>
            <ul className={styles.linkList}>
              {BRAND_LINKS.map((b) => (
                <li key={b.slug}>
                  <Link href={`/tienda?marca=${b.slug}`} className={styles.brandLinkItem}>
                    <span>{b.name}</span>
                    <span className={styles.brandCount}>({b.count})</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Col */}
          <div className={styles.newsletterCol}>
            <h4 className={styles.colTitle}>JOIN THE DROP CLUB</h4>
            <p className={styles.newsletterDesc}>
              Suscríbete para acceder antes que nadie a lanzamientos exclusivos, drops secretos y alertas de stock.
            </p>

            {subscribed ? (
              <div className={styles.subscribeSuccess}>
                <Check size={18} />
                <span>¡Te has suscrito con éxito al Club SPM!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className={styles.newsletterForm}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Tu correo electrónico..."
                  className={styles.emailInput}
                  required
                />
                <button type="submit" className={styles.submitBtn}>
                  UNIRME
                </button>
              </form>
            )}

            <p className={styles.newsletterNotice}>
              Sin spam. Solo preventas y drops de streetwear de verdad.
            </p>
          </div>
        </div>

        {/* Chilean Trust Strip: Métodos de Pago y Despacho */}
        <div className={styles.trustStrip}>
          <div className={styles.trustBlock}>
            <span className={styles.trustLabel}>
              <CreditCard size={15} /> PAGO SEGURO:
            </span>
            <div className={styles.trustPills}>
              <span className={styles.trustPill}>Webpay Plus</span>
              <span className={styles.trustPill}>Redcompra</span>
              <span className={styles.trustPill}>Débito / Crédito</span>
              <span className={styles.trustPill}>Transferencia</span>
            </div>
          </div>

          <div className={styles.trustBlock}>
            <span className={styles.trustLabel}>
              <Package size={15} /> COURIERS OFICIALES:
            </span>
            <div className={styles.trustPills}>
              <span className={styles.trustPill}>Starken</span>
              <span className={styles.trustPill}>Blue Express</span>
              <span className={styles.trustPill}>Chilexpress</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} {site.name}®. TODOS LOS DERECHOS RESERVADOS.
          </p>

          <div className={styles.bottomLegalLinks}>
            <Link href="/politicas-de-envio">Envíos y Despacho</Link>
            <span>•</span>
            <Link href="/cambios-y-devoluciones">Garantía SERNAC</Link>
            <span>•</span>
            <Link href="/terminos">Términos</Link>
            <span>•</span>
            <Link href="/faq">Preguntas Frecuentes</Link>
          </div>

          <p className={styles.legalNotice}>
            SANTIAGO DE CHILE • STREETWEAR CULTURE
          </p>
        </div>
      </div>
    </footer>
  );
}
