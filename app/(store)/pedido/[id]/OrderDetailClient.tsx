"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, XCircle, Printer, ArrowLeft, Truck, MapPin, Mail, Phone, CreditCard } from "lucide-react";
import { Order } from "@/lib/orders";
import { formatCLP } from "@/lib/products";
import { useCart } from "@/app/components/CartContext";
import styles from "./OrderDetail.module.css";

interface Props {
  order: Order;
  statusParam?: string | null;
}

export default function OrderDetailClient({ order, statusParam }: Props) {
  const { clearCart } = useCart();
  const isSuccess = order.status === "Pagado" || statusParam === "success";

  useEffect(() => {
    if (isSuccess) {
      clearCart();
    }
  }, [isSuccess, clearCart]);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const formattedDate = new Date(order.paidAt || order.date).toLocaleDateString("es-CL", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        {/* Banner de Estado */}
        <div className={styles.statusBanner}>
          {isSuccess ? (
            <>
              <div className={styles.iconWrapSuccess}>
                <CheckCircle2 size={36} />
              </div>
              <h1 className={styles.bannerTitle}>¡PAGO CONFIRMADO CON ÉXITO!</h1>
              <p className={styles.bannerSub}>
                Hemos recibido tu pago a través de Webpay Plus & Flow. Tu pedido está en preparación y recibirás la orden de seguimiento en tu correo.
              </p>
            </>
          ) : (
            <>
              <div className={styles.iconWrapFailed}>
                <XCircle size={36} />
              </div>
              <h1 className={styles.bannerTitle}>TRANSACCIÓN NO COMPLETADA</h1>
              <p className={styles.bannerSub}>
                El pago no pudo procesarse o fue cancelado en la pasarela. No se ha realizado ningún cobro en tu cuenta.
              </p>
            </>
          )}
        </div>

        {/* Voucher / Comprobante */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Comprobante de Transacción</h2>
            <span className={styles.orderBadge}>{order.orderNumber}</span>
          </div>

          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>N° de Transacción Flow</span>
              <span className={styles.detailValue}>#{order.flowOrder || "N/A"}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Medio de Pago</span>
              <span className={styles.detailValue}>{order.paymentMedia || "Webpay Plus / Flow"}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Fecha y Hora</span>
              <span className={styles.detailValue}>{formattedDate}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Estado del Pedido</span>
              <span className={styles.detailValue} style={{ color: isSuccess ? "#15803d" : "#b91c1c" }}>
                {isSuccess ? "Pagado • En Preparación" : "Pago Rechazado"}
              </span>
            </div>
          </div>

          {/* Desglose de Productos */}
          <div className={styles.itemsList}>
            {order.items.map((item, idx) => (
              <div key={idx} className={styles.itemRow}>
                <div className={styles.itemImgWrap}>
                  <Image
                    src={item.image || "/brand/placeholder.png"}
                    alt={item.name || "Gorra"}
                    width={56}
                    height={56}
                    className={styles.itemImg}
                  />
                </div>
                <div className={styles.itemDetails}>
                  <p className={styles.itemBrand}>{item.brand}</p>
                  <h3 className={styles.itemName}>{item.name}</h3>
                  <p className={styles.itemMeta}>
                    Talla: {item.size} • Cantidad: {item.quantity}
                  </p>
                </div>
                <span className={styles.itemTotal}>
                  {formatCLP(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Resumen Financiero */}
          <div className={styles.financialSummary}>
            <div className={styles.finRow}>
              <span>Subtotal Productos</span>
              <span>{formatCLP(order.subtotal || order.total - (order.shippingCost || 0))}</span>
            </div>
            <div className={styles.finRow}>
              <span>Despacho a Domicilio</span>
              <span>{order.shippingCost && order.shippingCost > 0 ? formatCLP(order.shippingCost) : "GRATIS"}</span>
            </div>
            <div className={styles.finRowTotal}>
              <span>TOTAL CANCELADO</span>
              <span>{formatCLP(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Datos de Despacho */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Datos de Despacho</h2>
            <Truck size={18} />
          </div>

          <div className={styles.shippingBox}>
            <div className={styles.shippingRow}>
              <MapPin size={18} className={styles.shippingIcon} />
              <div>
                <strong>{order.clientName}</strong> (RUT: {order.clientRut})
                <br />
                {order.clientAddress}, {order.clientCity}, {order.clientRegion}
              </div>
            </div>

            <div className={styles.shippingRow}>
              <Mail size={18} className={styles.shippingIcon} />
              <span>{order.clientEmail}</span>
            </div>

            {order.clientPhone && (
              <div className={styles.shippingRow}>
                <Phone size={18} className={styles.shippingIcon} />
                <span>{order.clientPhone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Botones de Acción */}
        <div className={styles.actionsRow}>
          <Link href="/tienda" className={styles.btnPrimary}>
            <ArrowLeft size={16} /> Volver a la Tienda
          </Link>

          <button onClick={handlePrint} className={styles.btnSecondary}>
            <Printer size={16} /> Imprimir Comprobante
          </button>
        </div>
      </div>
    </div>
  );
}
