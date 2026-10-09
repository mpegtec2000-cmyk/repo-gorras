import React from "react";
import Link from "next/link";
import { FileText, Shield, Lock, ChevronRight, CheckCircle2, ShoppingBag } from "lucide-react";
import styles from "../legal.module.css";

export const metadata = {
  title: "Términos y Condiciones de Uso | SPM Streetwear Chile",
  description: "Términos y condiciones generales de compra y navegación en la tienda oficial de SPM Streetwear.",
};

export default function TerminosPage() {
  return (
    <div className={styles.legalContainer}>
      <div className={styles.legalInner}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href="/">Inicio</Link>
          <ChevronRight size={14} />
          <span className={styles.breadcrumbActive}>Términos y Condiciones</span>
        </nav>

        {/* Header */}
        <header className={styles.pageHeader}>
          <span className={styles.tag}>
            <FileText size={14} /> TÉRMINOS LEGALES & CONTRATACIÓN
          </span>
          <h1 className={styles.pageTitle}>Términos y Condiciones</h1>
          <p className={styles.pageSubtitle}>
            Condiciones generales aplicables a la compra, navegación y uso del sitio web oficial de SPM Streetwear®.
          </p>
        </header>

        {/* Navigation Tabs */}
        <nav className={styles.tabsNav}>
          <Link href="/politicas-de-envio" className={styles.tabLink}>
            Envíos y Despacho
          </Link>
          <Link href="/cambios-y-devoluciones" className={styles.tabLink}>
            Garantía y Cambios
          </Link>
          <Link href="/terminos" className={`${styles.tabLink} ${styles.activeTab}`}>
            Términos y Condiciones
          </Link>
          <Link href="/faq" className={styles.tabLink}>
            Preguntas Frecuentes
          </Link>
        </nav>

        {/* Content Card */}
        <div className={styles.contentCard}>
          {/* Section 1 */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <ShoppingBag size={20} /> 1. Identificación del Comercio y Propiedad
            </h2>
            <p className={styles.text}>
              El presente sitio web es operado por <strong>SPM Streetwear®</strong>, marca chilena dedicada a la comercialización y curaduría de gorras y accesorios urbanos de colección. Toda transacción realizada en este portal se rige bajo las leyes vigentes de la República de Chile.
            </p>
          </section>

          {/* Section 2 */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Shield size={20} /> 2. Precios, Moneda y Stock Limitado
            </h2>
            <p className={styles.text}>
              Todos los precios informados en el catálogo están expresados en <strong>Pesos Chilenos (CLP)</strong> e incluyen el Impuesto al Valor Agregado (IVA).
            </p>
            <p className={styles.text}>
              Debido a la naturaleza de los <em>drops de streetwear</em> y colecciones limitadas, los productos cuentan con inventario exclusivo y unitario. Un producto agregado a la bolsa de compras no queda reservado hasta que se concrete el pago exitoso a través de la pasarela bancaria.
            </p>
          </section>

          {/* Section 3 */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Lock size={20} /> 3. Pasarela de Pagos y Seguridad Bancaria
            </h2>
            <p className={styles.text}>
              Los pagos en línea se procesan a través de la plataforma certificada <strong>Flow.cl</strong>, la cual opera bajo estándares de seguridad bancaria y cifrado TLS/SSL 256-bit.
            </p>
            <p className={styles.text}>
              <strong>SPM Streetwear no almacena ni tiene acceso a los datos confidenciales de tarjetas de crédito o débito</strong> (números de tarjeta, códigos CVV o contraseñas bancarias). Dichos datos son procesados directamente por Transbank y las entidades emisoras de cada tarjeta.
            </p>
          </section>

          {/* Section 4 */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <CheckCircle2 size={20} /> 4. Privacidad y Protección de Datos (Ley N° 19.628)
            </h2>
            <p className={styles.text}>
              Los datos personales ingresados por los usuarios (nombre, RUT, correo, dirección de entrega y teléfono) son tratados con estricta confidencialidad de conformidad con la Ley N° 19.628 sobre Protección de la Vida Privada.
            </p>
            <p className={styles.text}>
              Dichos datos se utilizan exclusivamente para el procesamiento del pedido, emisión de la boleta de venta, coordinación de despacho con Starken / Blue Express y comunicaciones relativas a la compra. En ningún caso se transferirán ni venderán a terceros para fines ajenos al servicio.
            </p>
          </section>
        </div>

        {/* Support Footer */}
        <div className={styles.supportFooter}>
          <h3 className={styles.supportTitle}>Transparencia y Seguridad en cada compra</h3>
          <p className={styles.supportText}>
            En SPM Streetwear operamos con total apego a la normativa chilena para brindarte la mejor experiencia de compra.
          </p>
          <Link href="/tienda" className={styles.supportBtn}>
            Ir a la Tienda
          </Link>
        </div>
      </div>
    </div>
  );
}
