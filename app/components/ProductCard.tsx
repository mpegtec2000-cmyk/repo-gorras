"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Eye } from "lucide-react";
import { Product, formatCLP } from "@/lib/products";
import { useCart } from "./CartContext";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCart();

  const isSoldOut = product.stock <= 0;
  const hasSecondImage = product.images.length > 1;
  const displayImage = isHovered && hasSecondImage ? product.images[1] : product.images[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isSoldOut) {
      addItem(product);
    }
  };

  return (
    <div
      className={styles.card}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/producto/${product.slug}`} className={styles.imageLink}>
        <div className={styles.imageWrapper}>
          {/* Badges */}
          <div className={styles.badges}>
            {isSoldOut ? (
              <span className={`${styles.badge} ${styles.soldOut}`}>AGOTADO</span>
            ) : product.isNew ? (
              <span className={`${styles.badge} ${styles.new}`}>NUEVO DROP</span>
            ) : null}
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className={`${styles.badge} ${styles.sale}`}>OFERTA</span>
            )}
          </div>

          {/* Product Image */}
          <div className={styles.imgContainer}>
            <Image
              src={displayImage.src}
              alt={displayImage.alt || product.seoTitle}
              width={600}
              height={600}
              className={styles.img}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>

          {/* Quick Actions Overlay */}
          <div className={styles.overlayActions}>
            <button
              onClick={handleAddToCart}
              disabled={isSoldOut}
              className={styles.actionBtn}
              title={isSoldOut ? "Agotado" : "Agregar a la bolsa"}
            >
              <ShoppingBag size={18} />
              <span>{isSoldOut ? "AGOTADO" : "AGREGAR"}</span>
            </button>
          </div>
        </div>
      </Link>

      {/* Info Section */}
      <div className={styles.info}>
        <div className={styles.meta}>
          <span className={styles.category}>{product.category}</span>
          <span className={styles.colorDot} style={{ backgroundColor: product.color.hex }} />
        </div>

        <h3 className={styles.title}>
          <Link href={`/producto/${product.slug}`}>{product.name}</Link>
        </h3>

        <div className={styles.priceRow}>
          <span className={styles.price}>{formatCLP(product.price)}</span>
          {product.compareAtPrice && (
            <span className={styles.comparePrice}>{formatCLP(product.compareAtPrice)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
