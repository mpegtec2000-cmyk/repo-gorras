import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Flame, Shield, Sparkles } from "lucide-react";
import HeroSlider from "./components/HeroSlider";
import Marquee from "./components/Marquee";
import ProductCard from "./components/ProductCard";
import CategoryGrid from "./components/CategoryGrid";
import { getNewArrivals, getFeatured } from "@/lib/products";
import { getAllProducts } from "@/lib/catalog";
import { site } from "@/lib/site";
import styles from "./page.module.css";

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

export default async function Home() {
  const allProducts = await getAllProducts();
  const newDrops = getNewArrivals(allProducts, 4);
  const featured = getFeatured(allProducts, 8);

  return (
    <>
      {/* Hero Slider with 2s loop & desktop/mobile picture fallback */}
      <HeroSlider />

      {/* Marquee Banner */}
      <Marquee />

      {/* New Drops Section */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.tag}>
                <Flame size={14} /> RECIÉN LLEGADOS
              </span>
              <h2 className={styles.sectionTitle}>NUEVOS DROPS 2026</h2>
            </div>
            <Link href="/tienda?orden=nuevos" className={styles.linkBtn}>
              VER TODOS LOS DROPS <ArrowRight size={16} />
            </Link>
          </div>

          <div className={styles.productGrid}>
            {newDrops.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Category Grid Section */}
      <CategoryGrid />

      {/* Editorial Lookbook Banner */}
      <section className={styles.editorialSection}>
        <div className={styles.editorialBgContainer}>
          <picture>
            <source media="(min-width: 768px)" srcSet="/hero/desktop/fondo-4-1920.webp" />
            <img
              src="/hero/mobile/fondo-4-1080.webp"
              alt="SPM Streetwear Lookbook"
              className={styles.editorialBg}
            />
          </picture>
          <div className={styles.editorialOverlay} />
        </div>

        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className={styles.editorialContent}>
            <span className={styles.editorialTag}>EDICIÓN LIMITADA</span>
            <h2 className={styles.editorialTitle}>NO RULES. JUST STREETWEAR.</h2>
            <p className={styles.editorialDesc}>
              Inspirados en la arquitectura urbana y la cultura subterránea. Cada gorra SPM es diseñada con materiales pesados, bordados 3D de máxima definición y acabados que resisten el uso diario.
            </p>
            <Link href="/tienda" className={styles.editorialBtn}>
              DESCUBRIR COLECCIÓN
            </Link>
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.tag}>
                <Sparkles size={14} /> MÁS VENDIDOS
              </span>
              <h2 className={styles.sectionTitle}>FAVORITOS DE LA CALLE</h2>
            </div>
            <Link href="/tienda" className={styles.linkBtn}>
              IR A LA TIENDA <ArrowRight size={16} />
            </Link>
          </div>

          <div className={styles.productGrid}>
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Reverse Marquee */}
      <Marquee reverse />

      {/* Instagram Community Banner */}
      <section className={styles.instagramSection}>
        <div className="container">
          <div className={styles.instaBox}>
            <InstagramIcon size={48} className={styles.instaIcon} />
            <h2 className={styles.instaTitle}>COMUNIDAD @SPM_STORE.CL</h2>
            <p className={styles.instaDesc}>
              Etiquétanos en tus fotos usando <strong>#SPMstreetwear</strong> para aparecer en nuestras historias y catálogo oficial.
            </p>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.instaBtn}
            >
              SEGUIR EN INSTAGRAM <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
