"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./HeroSlider.module.css";

const SLIDES = [
  {
    id: 1,
    title: "SPM STREETWEAR",
    subtitle: "DROP 01 // EDICIÓN LIMITADA",
    tag: "NUEVA COLECCIÓN 2026",
    desktop: "/hero/desktop/fondo-1-1920.webp",
    mobile: "/hero/mobile/fondo-1-1080.webp",
    link: "/tienda",
  },
  {
    id: 2,
    title: "SILVER STAR & THORNS",
    subtitle: "BORDADOS EN RELIEVE 3D",
    tag: "STREETWEAR ACCESORIOS",
    desktop: "/hero/desktop/fondo-2-1920.webp",
    mobile: "/hero/mobile/fondo-2-1080.webp",
    link: "/tienda?categoria=snapback",
  },
  {
    id: 3,
    title: "THORNS HEART",
    subtitle: "CORAZÓN ROJO & GAMUZA NEGRA",
    tag: "BEST SELLER",
    desktop: "/hero/desktop/fondo-3-1920.webp",
    mobile: "/hero/mobile/fondo-3-1080.webp",
    link: "/producto/jockey-curvo-thorns-heart-negro",
  },
  {
    id: 4,
    title: "URBAN CULTURE",
    subtitle: "DISAÑADOS EN CHILE",
    tag: "ENVÍOS A TODO EL PAÍS",
    desktop: "/hero/desktop/fondo-4-1920.webp",
    mobile: "/hero/mobile/fondo-4-1080.webp",
    link: "/tienda",
  },
  {
    id: 5,
    title: "TRUCKER & FITTED",
    subtitle: "ESTILO REBELDE Y ATEMPORAL",
    tag: "STOCK LIMITADO",
    desktop: "/hero/desktop/fondo-5-1920.webp",
    mobile: "/hero/mobile/fondo-5-1080.webp",
    link: "/tienda?categoria=trucker",
  },
  {
    id: 6,
    title: "SPM CORE",
    subtitle: "EXPRESION DE LA CALLE",
    tag: "AUTÉNTICO STREETWEAR",
    desktop: "/hero/desktop/fondo-6-1920.webp",
    mobile: "/hero/mobile/fondo-6-1080.webp",
    link: "/tienda",
  },
];

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  // Bucle automático cada 2 segundos (2000ms)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 2000);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused]);

  return (
    <section
      className={styles.hero}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
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

      {/* Nav Controls */}
      <button
        onClick={prevSlide}
        className={`${styles.navBtn} ${styles.prevBtn}`}
        aria-label="Anterior fondo"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        className={`${styles.navBtn} ${styles.nextBtn}`}
        aria-label="Siguiente fondo"
      >
        <ChevronRight size={24} />
      </button>

      {/* Progress Indicators / Dots */}
      <div className={styles.indicators}>
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`${styles.dot} ${idx === currentIndex ? styles.activeDot : ""}`}
            aria-label={`Ir a diapositiva ${idx + 1}`}
          >
            <span
              key={idx === currentIndex ? `active-${idx}` : `idle-${idx}`}
              className={styles.progressBar}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
