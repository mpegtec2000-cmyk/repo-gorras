"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/lib/products";
import styles from "./CategoryGrid.module.css";

export default function CategoryGrid() {
  return (
    <section className={styles.section} id="colecciones">
      <div className="container">
        <div className={styles.header}>
          <div>
            <span className={styles.tag}>CATEGORÍAS & MODELOS</span>
            <h2 className={styles.title}>EXPLORA NUESTRO CATÁLOGO</h2>
          </div>
          <Link href="/tienda" className={styles.viewAllBtn}>
            VER TODO EL CATÁLOGO <ArrowUpRight size={18} />
          </Link>
        </div>

        <div className={styles.grid}>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/tienda?categoria=${cat.slug}`}
              className={styles.card}
            >
              <div className={styles.imageContainer}>
                <Image
                  src={cat.image}
                  alt={`Gorras modelo ${cat.name} SPM Streetwear`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className={styles.img}
                />
                <div className={styles.overlay} />
              </div>

              <div className={styles.content}>
                <div className={styles.topRow}>
                  <h3 className={styles.catName}>{cat.name}</h3>
                  <span className={styles.arrowIcon}>
                    <ArrowUpRight size={20} />
                  </span>
                </div>
                <p className={styles.description}>{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
