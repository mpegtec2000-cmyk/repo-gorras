"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import { useCart } from "./CartContext";
import { formatCLP } from "@/lib/products";
import { site } from "@/lib/site";
import styles from "./CartDrawer.module.css";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, totalItems } = useCart();
  const [checkoutMessage, setCheckoutMessage] = useState(false);

  if (!isOpen) return null;

  const freeShippingThreshold = site.freeShippingFrom;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleCheckoutMock = () => {
    setCheckoutMessage(true);
    setTimeout(() => setCheckoutMessage(false), 5000);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.overlay} onClick={closeCart} />

      <aside className={styles.drawer}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <ShoppingBag size={22} />
            <h2 className={styles.title}>TU BOLSA DE COMPRAS</h2>
            <span className={styles.count}>({totalItems})</span>
          </div>
          <button onClick={closeCart} className={styles.closeBtn} aria-label="Cerrar bolsa">
            <X size={22} />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className={styles.shippingBar}>
          <p className={styles.shippingText}>
            {remainingForFreeShipping > 0 ? (
              <>
                Te faltan <strong>{formatCLP(remainingForFreeShipping)}</strong> para <strong>ENVÍO GRATIS</strong>
              </>
            ) : (
              <>🎉 ¡Felicidades! Tienes <strong>ENVÍO GRATIS</strong> en tu pedido</>
            )}
          </p>
          <div className={styles.progressTrack}>
            <div className={styles.progressBar} style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Items List */}
        <div className={styles.itemList}>
          {items.length === 0 ? (
            <div className={styles.emptyCart}>
              <ShoppingBag size={56} className={styles.emptyIcon} />
              <p className={styles.emptyTitle}>TU BOLSA ESTÁ VACÍA</p>
              <p className={styles.emptyDesc}>Encuentra las mejores gorras y accesorios streetwear.</p>
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
                    width={90}
                    height={90}
                    className={styles.itemImg}
                  />
                </div>

                <div className={styles.itemInfo}>
                  <div className={styles.itemTop}>
                    <h3 className={styles.itemName}>{item.product.name}</h3>
                    <button
                      onClick={() => removeItem(item.product.id, item.size)}
                      className={styles.removeBtn}
                      aria-label="Eliminar producto"
                    >
                      <Trash2 size={16} />
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
                        <Minus size={14} />
                      </button>
                      <span className={styles.qtyValue}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, 1)}
                        className={styles.qtyBtn}
                        aria-label="Aumentar cantidad"
                      >
                        <Plus size={14} />
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
            {checkoutMessage && (
              <div className={styles.noticeBox}>
                ℹ️ <strong>Maqueta Visual Completada:</strong> La pasarela de pago real (Flow/Webpay + Supabase) se conectará en la Fase 2.
              </div>
            )}

            <div className={styles.subtotalRow}>
              <span>SUBTOTAL</span>
              <span className={styles.subtotalValue}>{formatCLP(subtotal)}</span>
            </div>

            <p className={styles.taxNotice}>Impuestos e internación incluidos. Envíos calculados al pagar.</p>

            <button onClick={handleCheckoutMock} className={styles.checkoutBtn}>
              PROCEDER AL PAGO <ArrowRight size={18} />
            </button>

            <div className={styles.trustBadges}>
              <span><ShieldCheck size={14} /> Pago 100% Seguro</span>
              <span>•</span>
              <span>Despacho Rápido</span>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
