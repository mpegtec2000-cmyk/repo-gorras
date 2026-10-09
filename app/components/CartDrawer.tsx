"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  CheckCircle2
} from "lucide-react";
import { useCart } from "./CartContext";
import { formatCLP } from "@/lib/products";
import { site } from "@/lib/site";
import styles from "./CartDrawer.module.css";

export default function CartDrawer() {
  const router = useRouter();
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, totalItems } = useCart();

  if (!isOpen) return null;

  const freeShippingThreshold = site.freeShippingFrom;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const hasFreeShipping = remainingForFreeShipping === 0;

  const handleProceedToCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.overlay} onClick={closeCart} />

      <aside className={styles.drawer}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <ShoppingBag size={20} className={styles.bagIcon} />
            <h2 className={styles.title}>TU BOLSA DE COMPRAS</h2>
            <span className={styles.count}>({totalItems})</span>
          </div>
          <button onClick={closeCart} className={styles.closeBtn} aria-label="Cerrar bolsa">
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress (Professional, zero emojis) */}
        <div className={styles.shippingBar}>
          <div className={styles.shippingText}>
            {hasFreeShipping ? (
              <>
                <CheckCircle2 size={14} className={styles.checkIcon} />
                <span>Tienes <strong>ENVÍO GRATIS</strong> en este pedido</span>
              </>
            ) : (
              <>
                <Truck size={14} className={styles.truckIcon} />
                <span>
                  Faltan <strong>{formatCLP(remainingForFreeShipping)}</strong> para <strong>ENVÍO GRATIS</strong>
                </span>
              </>
            )}
          </div>
          <div className={styles.progressTrack}>
            <div 
              className={`${styles.progressBar} ${hasFreeShipping ? styles.progressComplete : ""}`} 
              style={{ width: `${progressPercent}%` }} 
            />
          </div>
        </div>

        {/* Items List */}
        <div className={styles.itemList}>
          {items.length === 0 ? (
            <div className={styles.emptyCart}>
              <ShoppingBag size={48} className={styles.emptyIcon} />
              <p className={styles.emptyTitle}>TU BOLSA ESTÁ VACÍA</p>
              <p className={styles.emptyDesc}>Explora los últimos drops de gorras y accesorios originales.</p>
              <Link href="/tienda" onClick={closeCart} className={styles.shopNowBtn}>
                EXPLORAR CATÁLOGO
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.product.id}-${item.size}`} className={styles.itemCard}>
                <div className={styles.itemImgWrapper}>
                  <Image
                    src={item.product.images[0].src}
                    alt={item.product.name}
                    width={80}
                    height={80}
                    className={styles.itemImg}
                  />
                </div>

                <div className={styles.itemInfo}>
                  <div className={styles.itemTop}>
                    <div className={styles.itemNames}>
                      <span className={styles.itemBrand}>{item.product.brand}</span>
                      <h3 className={styles.itemName}>{item.product.name}</h3>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id, item.size)}
                      className={styles.removeBtn}
                      aria-label="Eliminar producto"
                      title="Eliminar de la bolsa"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <p className={styles.itemMeta}>Talla: {item.size}</p>

                  <div className={styles.itemBottom}>
                    <div className={styles.qtyPicker}>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, -1)}
                        className={styles.qtyBtn}
                        aria-label="Reducir cantidad"
                      >
                        <Minus size={13} />
                      </button>
                      <span className={styles.qtyValue}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, 1)}
                        className={styles.qtyBtn}
                        aria-label="Aumentar cantidad"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <span className={styles.itemPrice}>
                      {formatCLP(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Subtotal */}
        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.subtotalRow}>
              <span className={styles.subtotalLabel}>SUBTOTAL</span>
              <span className={styles.subtotalValue}>{formatCLP(subtotal)}</span>
            </div>

            <p className={styles.taxNotice}>
              Impuestos e internación incluidos. Envíos calculados al finalizar compra.
            </p>

            <button onClick={handleProceedToCheckout} className={styles.checkoutBtn}>
              <span>PROCEDER AL PAGO</span>
              <ArrowRight size={16} />
            </button>

            <div className={styles.trustBadges}>
              <span className={styles.trustBadgeItem}>
                <ShieldCheck size={14} /> Pago 100% Seguro
              </span>
              <span className={styles.trustBullet}>•</span>
              <span className={styles.trustBadgeItem}>
                <Truck size={14} /> Despacho a Todo Chile
              </span>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
