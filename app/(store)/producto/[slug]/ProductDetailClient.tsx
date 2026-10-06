"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Truck, ShieldCheck, RotateCcw, Minus, Plus, ChevronRight } from "lucide-react";
import { Product, formatCLP, displayImages } from "@/lib/products";
import { useCart } from "@/app/components/CartContext";
import ProductCard from "@/app/components/ProductCard";
import styles from "./ProductDetailClient.module.css";

interface ProductDetailClientProps {
  product: Product;
  related: Product[];
}

export default function ProductDetailClient({ product, related }: ProductDetailClientProps) {
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const images = displayImages(product);
  const isSoldOut = product.stock <= 0;
  const currentImage = images[selectedImgIndex] || images[0];

  const handleAddToCart = () => {
    if (!isSoldOut) {
      for (let i = 0; i < quantity; i++) {
        addItem(product);
      }
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className="container">
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">INICIO</Link>
          <ChevronRight size={14} />
          <Link href="/tienda">TIENDA</Link>
          <ChevronRight size={14} />
          <span className={styles.breadcrumbActive}>{product.name}</span>
        </nav>

        <div className={styles.grid}>
          {/* Gallery */}
          <div className={styles.gallerySection}>
            <div className={styles.mainImageWrapper}>
              <Image
                src={currentImage.src}
                alt={currentImage.alt || product.name}
                width={800}
                height={800}
                className={styles.mainImg}
                priority
              />
            </div>

            {product.images.length > 1 && (
              <div className={styles.thumbnails}>
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    className={`${styles.thumbBtn} ${idx === selectedImgIndex ? styles.activeThumb : ""}`}
                    onClick={() => setSelectedImgIndex(idx)}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt || product.name}
                      width={160}
                      height={160}
                      className={styles.thumbImg}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info & Buy Form */}
          <div className={styles.infoSection}>
            <div className={styles.headerMeta}>
              <span className={styles.categoryBadge}>{product.brand}</span>
              {product.isNew && <span className={styles.tagNew}>NUEVO DROP</span>}
            </div>

            <h1 className={styles.title}>{product.name}</h1>

            <div className={styles.priceBox}>
              <span className={styles.price}>{formatCLP(product.price)}</span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className={styles.comparePrice}>{formatCLP(product.compareAtPrice)}</span>
              )}
            </div>

            <p className={styles.description}>{product.description}</p>

            <div className={styles.specList}>
              <div className={styles.specRow}>
                <span className={styles.specLabel}>TALLA:</span>
                <span className={styles.specVal}>{product.sizes.join(", ")}</span>
              </div>
              <div className={styles.specRow}>
                <span className={styles.specLabel}>MATERIAL:</span>
                <span className={styles.specVal}>{product.specs.find(s => s.label === "Material")?.value || "N/A"}</span>
              </div>
              <div className={styles.specRow}>
                <span className={styles.specLabel}>COLOR:</span>
                <span className={styles.specVal}>{product.color.name}</span>
              </div>
              <div className={styles.specRow}>
                <span className={styles.specLabel}>BORDADO:</span>
                <span className={styles.specVal}>Relieve 3D Alta Densidad</span>
              </div>
            </div>

            {/* Actions */}
            <div className={styles.formSection}>
              <div className={styles.qtyRow}>
                <div className={styles.qtySelector}>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || isSoldOut}
                    aria-label="Disminuir cantidad"
                  >
                    <Minus size={16} />
                  </button>
                  <span className={styles.qtyVal}>{quantity}</span>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => setQuantity((q) => q + 1)}
                    disabled={isSoldOut}
                    aria-label="Aumentar cantidad"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  className={styles.addToCartBtn}
                  onClick={handleAddToCart}
                  disabled={isSoldOut}
                >
                  <ShoppingBag size={20} />
                  <span>{isSoldOut ? "PRODUCTO AGOTADO" : "AGREGAR A LA BOLSA"}</span>
                </button>
              </div>
            </div>

            {/* Guarantees Box */}
            <div className={styles.guaranteesBox}>
              <div className={styles.guaranteeItem}>
                <Truck size={20} />
                <span>Despacho rápido a todo Chile vía Starken / Blue Express</span>
              </div>
              <div className={styles.guaranteeItem}>
                <ShieldCheck size={20} />
                <span>Producto 100% original SPM® Streetwear</span>
              </div>
              <div className={styles.guaranteeItem}>
                <RotateCcw size={20} />
                <span>Garantía de cambios y devoluciones sin complicaciones</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className={styles.relatedSection}>
            <h2 className={styles.relatedTitle}>TAMBIÉN TE PUEDE INTERESAR</h2>
            <div className={styles.relatedGrid}>
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
