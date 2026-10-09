import React from "react";
import Link from "next/link";
import { HelpCircle, ChevronRight, ShoppingBag, Truck, ShieldCheck, CreditCard, Sparkles } from "lucide-react";
import styles from "../legal.module.css";

export const metadata = {
  title: "Preguntas Frecuentes (FAQ) | SPM Streetwear Chile",
  description: "Resuelve todas tus dudas sobre autenticidad de gorras, medios de pago Webpay/Flow, tiempos de envío y tallas en SPM.",
};

const FAQ_ITEMS = [
  {
    q: "¿Las gorras de SPM Streetwear son 100% originales?",
    a: "Sí, absolutamente. Todas nuestras piezas son 100% originales con acabados de alta gama, bordados en relieve 3D de alta densidad, etiquetas oficiales y costuras reforzadas. Seleccionamos y curamos colecciones exclusivas de marcas reconocidas como 31 Hats, Cash Only, Rebel Hats, Dreamer Hats, Barbas Hats y Fame Club.",
  },
  {
    q: "¿Qué talla tienen las gorras y cómo se ajustan?",
    a: "La gran mayoría de nuestras gorras son de Talla Única con sistema de cierre snapback (broche de presión) o strapback (correa ajustable de cuero/tela), adaptándose cómodamente a circunferencias de cabeza entre 55 cm y 61 cm.",
  },
  {
    q: "¿Qué medios de pago aceptan?",
    a: "Aceptamos todos los medios de pago oficiales de Chile a través de Flow y Webpay Plus: Tarjetas de Débito (Redcompra / CuentaRUT), Tarjetas de Crédito (Visa, Mastercard, American Express con opción de cuotas), Billeteras digitales (Mach, Onepay) y Transferencias bancarias directas.",
  },
  {
    q: "¿Cuánto demora en llegar mi pedido?",
    a: "Para la Región Metropolitana (Santiago), el tiempo habitual de entrega es de 1 a 2 días hábiles. Para regiones del centro y sur, de 2 a 3 días hábiles. Para zonas extremas (Norte Grande y Magallanes), entre 3 y 5 días hábiles. Despachamos todos los días vía Starken y Blue Express.",
  },
  {
    q: "¿Cómo sé cuál es el número de seguimiento de mi paquete?",
    a: "Apenas entregamos tu paquete a Starken o Blue Express, te enviamos un correo electrónico automático con el número de seguimiento (Orden de Transporte OT) y el enlace directo para rastrear la ubicación de tu compra en tiempo real.",
  },
  {
    q: "¿El envío es gratis?",
    a: "¡Sí! Ofrecemos ENVÍO GRATIS a todo Chile continental en cualquier compra igual o superior a $50.000 CLP. Si compras un monto menor, el valor de despacho es una tarifa plana fija de solo $3.990 CLP.",
  },
  {
    q: "¿Qué hago si mi gorra viene con alguna falla de fábrica?",
    a: "Nuestras gorras cuentan con 6 meses de Garantía Legal conforme a la Ley del Consumidor de SERNAC. Si tu producto presenta alguna falla de fabricación, nos encargamos del cambio inmediato por una nueva unidad o la devolución del 100% de tu dinero sin ningún costo de envío para ti.",
  },
  {
    q: "¿Cómo debo limpiar mi gorra sin dañar el bordado?",
    a: "Recomendamos no meter nunca la gorra a la lavadora ni secadora. Para limpiarla, utiliza un paño de microfibra o cepillo de cerdas suaves humedecido con agua fría y jabón neutro, frotando suavemente la superficie y dejándola secar a la sombra en un lugar ventilado.",
  },
];

export default function FaqPage() {
  return (
    <div className={styles.legalContainer}>
      <div className={styles.legalInner}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href="/">Inicio</Link>
          <ChevronRight size={14} />
          <span className={styles.breadcrumbActive}>Preguntas Frecuentes</span>
        </nav>

        {/* Header */}
        <header className={styles.pageHeader}>
          <span className={styles.tag}>
            <HelpCircle size={14} /> AYUDA & SOPORTE OFICIAL
          </span>
          <h1 className={styles.pageTitle}>Preguntas Frecuentes</h1>
          <p className={styles.pageSubtitle}>
            Encuentra respuestas claras y rápidas sobre autenticidad, envíos, métodos de pago y garantías en SPM Streetwear.
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
          <Link href="/terminos" className={styles.tabLink}>
            Términos y Condiciones
          </Link>
          <Link href="/faq" className={`${styles.tabLink} ${styles.activeTab}`}>
            Preguntas Frecuentes
          </Link>
        </nav>

        {/* Content Card */}
        <div className={styles.contentCard}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Sparkles size={20} /> Dudas Habituales de la Comunidad
            </h2>

            <div style={{ marginTop: "1.5rem" }}>
              {FAQ_ITEMS.map((item, idx) => (
                <div key={idx} className={styles.faqItem}>
                  <h3 className={styles.faqQuestion}>{item.q}</h3>
                  <p className={styles.faqAnswer}>{item.a}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Support Footer */}
        <div className={styles.supportFooter}>
          <h3 className={styles.supportTitle}>¿No encontraste lo que buscabas?</h3>
          <p className={styles.supportText}>
            Escríbenos directamente y un miembro del equipo SPM te responderá en minutos.
          </p>
          <Link href="/tienda" className={styles.supportBtn}>
            Volver a la Tienda
          </Link>
        </div>
      </div>
    </div>
  );
}
