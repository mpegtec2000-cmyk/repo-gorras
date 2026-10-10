"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Check } from "lucide-react";
import { Product, formatCLP, displayImages } from "@/lib/products";
import { useCart } from "./CartContext";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const { addItem } = useCart();

  const isSoldOut = product.stock <= 0;
  const imgs = displayImages(product);
  const hasSecondImage = imgs.length > 1;
  const displayImage = isHovered && hasSecondImage ? imgs[1] : imgs[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isSoldOut) {
      addItem(product);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1400);
    }
  };

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  return (
    <div
      className={styles.card}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={`/producto/${product.slug}`}
        className={styles.imageLink}
        aria-label={product.name}
        onClick={() => {
          try {
            fetch("/api/analytics/click", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ productId: product.id }),
            }).catch(() => {});
          } catch {}
        }}
      >
        <div className={styles.imageWrapper}>
          {/* Badges */}
          <div className={styles.badges}>
            {isSoldOut ? (
              <span className={`${styles.badge} ${styles.soldOut}`}>AGOTADO</span>
            ) : product.isNew ? (
              <span className={`${styles.badge} ${styles.new}`}>NUEVO</span>
            ) : null}
            {discountPercent && (
              <span className={`${styles.badge} ${styles.sale}`}>-{discountPercent}%</span>
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
        </div>
      </Link>

      {/* Info Section */}
      <div className={styles.info}>
        <div className={styles.meta}>
          <span className={styles.category}>{product.brand}</span>
          <span
            className={styles.colorDot}
            style={{ backgroundColor: product.color.hex }}
            title={`Color: ${product.color.name}`}
          />
        </div>

        <h3 className={styles.title}>
          <Link href={`/producto/${product.slug}`}>{product.name}</Link>
        </h3>

        {/* Price & Action Row */}
        <div className={styles.priceRow}>
          <div className={styles.priceBox}>
            <span className={styles.price}>{formatCLP(product.price)}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className={styles.comparePrice}>{formatCLP(product.compareAtPrice)}</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isSoldOut}
            className={`${styles.actionBtn} ${justAdded ? styles.added : ""}`}
            title={isSoldOut ? "Agotado" : justAdded ? "¡Agregado!" : "Agregar al carrito"}
            aria-label={isSoldOut ? "Agotado" : "Agregar al carrito"}
          >
            {justAdded ? (
              <Check size={15} className={styles.btnIcon} />
            ) : (
              <ShoppingBag size={15} className={styles.btnIcon} />
            )}
            <span className={styles.actionText}>
              {isSoldOut ? "AGOTADO" : justAdded ? "LISTO" : "AGREGAR"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
