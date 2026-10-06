"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { BRAND_NAMES } from "@/lib/seed-products";
import styles from "./CategoryGrid.module.css";

const BRAND_LIST = Object.entries(BRAND_NAMES).map(([slug, name]) => ({
  slug,
  name,
  desc: `Colección exclusiva ${name} de edición limitada.`,
  image: "/products/placeholder-cap.webp",
}));

export default function CategoryGrid() {
  return (
    <section className={styles.section} id="colecciones">
      <div className="container">
        <div className={styles.header}>
          <div>
            <span className={styles.tag}>MARCAS & COLECCIONES</span>
            <h2 className={styles.title}>EXPLORA POR MARCA</h2>
          </div>
          <Link href="/tienda" className={styles.viewAllBtn}>
            VER TODO EL CATÁLOGO <ArrowUpRight size={18} />
          </Link>
        </div>

        <div className={styles.grid}>
          {BRAND_LIST.map((brand) => (
            <Link
              key={brand.slug}
              href={`/tienda?marca=${brand.slug}`}
              className={styles.card}
            >
              <div className={styles.imageContainer}>
                <Image
                  src={brand.image}
                  alt={`Gorras marca ${brand.name} SPM Streetwear`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className={styles.img}
                />
                <div className={styles.overlay} />
              </div>

              <div className={styles.content}>
                <div className={styles.topRow}>
                  <h3 className={styles.catName}>{brand.name}</h3>
                  <span className={styles.arrowIcon}>
                    <ArrowUpRight size={20} />
                  </span>
                </div>
                <p className={styles.description}>{brand.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
