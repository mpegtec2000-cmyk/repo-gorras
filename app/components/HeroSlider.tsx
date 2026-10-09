"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "./HeroSlider.module.css";

const SLIDES = [
  {
    id: 1,
    title: "SPM STREETWEAR",
    subtitle: "DROP 01 // EDICIÓN LIMITADA",
    tag: "NUEVA COLECCIÓN 2026",
    desktop: "/hero/desktop/fondo-1-1920.webp?v=2",
    mobile: "/hero/mobile/fondo-1-1080.webp?v=2",
    link: "/tienda",
  },
  {
    id: 2,
    title: "SILVER STAR & THORNS",
    subtitle: "BORDADOS EN RELIEVE 3D",
    tag: "STREETWEAR ACCESORIOS",
    desktop: "/hero/desktop/fondo-2-1920.webp?v=2",
    mobile: "/hero/mobile/fondo-2-1080.webp?v=2",
    link: "/tienda?categoria=snapback",
  },
  {
    id: 3,
    title: "THORNS HEART",
    subtitle: "CORAZÓN ROJO & GAMUZA NEGRA",
    tag: "BEST SELLER",
    desktop: "/hero/desktop/fondo-3-1920.webp?v=2",
    mobile: "/hero/mobile/fondo-3-1080.webp?v=2",
    link: "/producto/jockey-curvo-thorns-heart-negro",
  },
  {
    id: 4,
    title: "URBAN CULTURE",
    subtitle: "DISEÑADOS EN CHILE",
    tag: "ENVÍOS A TODO EL PAÍS",
    desktop: "/hero/desktop/fondo-4-1920.webp?v=2",
    mobile: "/hero/mobile/fondo-4-1080.webp?v=2",
    link: "/tienda",
  },
  {
    id: 5,
    title: "TRUCKER & FITTED",
    subtitle: "ESTILO REBELDE Y ATEMPORAL",
    tag: "STOCK LIMITADO",
    desktop: "/hero/desktop/fondo-5-1920.webp?v=2",
    mobile: "/hero/mobile/fondo-5-1080.webp?v=2",
    link: "/tienda?categoria=trucker",
  },
  {
    id: 6,
    title: "SPM CORE",
    subtitle: "EXPRESIÓN DE LA CALLE",
    tag: "AUTÉNTICO STREETWEAR",
    desktop: "/hero/desktop/fondo-6-1920.webp?v=2",
    mobile: "/hero/mobile/fondo-6-1080.webp?v=2",
    link: "/tienda",
  },
  {
    id: 7,
    title: "BLESSED STARS",
    subtitle: "DETALLES BRILLANTES & RELIEVE",
    tag: "EDICIÓN EXCLUSIVA",
    desktop: "/hero/desktop/fondo-7-1920.webp?v=2",
    mobile: "/hero/mobile/fondo-7-1080.webp?v=2",
    link: "/tienda",
  },
];

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  }, []);

  // Bucle automático continuo cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section
      className={styles.hero}
      aria-label="Hero Carousel SPM"
    >
      {SLIDES.map((slide, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={slide.id}
            className={`${styles.slide} ${isActive ? styles.active : ""}`}
            aria-hidden={!isActive}
          >
            {/* Picture con media query para escritorio vs móvil */}
            <picture className={styles.pictureContainer}>
              <source media="(min-width: 768px)" srcSet={slide.desktop} />
              <img
                src={slide.mobile}
                alt={slide.title}
                className={styles.bgImage}
                loading={index === 0 ? "eager" : "lazy"}
              />
            </picture>

            <div className={styles.overlay} />

            <div className={styles.contentContainer}>
              <div className={styles.content}>
                <span className={styles.badge}>{slide.tag}</span>
                <h1 className={styles.title}>{slide.title}</h1>
                <p className={styles.subtitle}>{slide.subtitle}</p>
                <div className={styles.actions}>
                  <Link href={slide.link} className={styles.primaryBtn}>
                    VER COLECCIÓN <ArrowRight size={18} />
                  </Link>
                  <Link href="/tienda" className={styles.secondaryBtn}>
                    EXPLORAR TIENDA
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Nav Controls Removed */}

    </section>
  );
}
