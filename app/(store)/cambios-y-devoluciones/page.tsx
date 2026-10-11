import React from "react";
import Link from "next/link";
import { RotateCcw, ShieldCheck, CheckCircle2, ChevronRight, Scale, RefreshCw } from "lucide-react";
import styles from "../legal.module.css";
import { site } from "@/lib/site";

export const metadata = {
  title: "Garantía Legal, Cambios y Devoluciones | SPM Streetwear Chile",
  description: "Conoce nuestra garantía legal de 6 meses bajo normativa SERNAC (Ley 19.496) y políticas de cambio en SPM Streetwear.",
  alternates: {
    canonical: `${site.url}/cambios-y-devoluciones`,
  },
  openGraph: {
    title: "Garantía Legal, Cambios y Devoluciones | SPM Streetwear Chile",
    description: "Garantía legal de 6 meses según Ley SERNAC y cambios sin costo por fallas de fábrica.",
    url: `${site.url}/cambios-y-devoluciones`,
    siteName: site.name,
    locale: site.locale,
    type: "website",
  },
};

export default function CambiosDevolucionesPage() {
  return (
    <div className={styles.legalContainer}>
      <div className={styles.legalInner}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href="/">Inicio</Link>
          <ChevronRight size={14} />
          <span className={styles.breadcrumbActive}>Garantía y Cambios</span>
        </nav>

        {/* Header */}
        <header className={styles.pageHeader}>
          <span className={styles.tag}>
            <Scale size={14} /> NORMATIVA SERNAC & LEY N° 19.496
          </span>
          <h1 className={styles.pageTitle}>Garantía Legal, Cambios y Devoluciones</h1>
          <p className={styles.pageSubtitle}>
            En SPM Streetwear respaldamos cada una de nuestras gorras bajo los más altos estándares de calidad y la legislación chilena del consumidor.
          </p>
        </header>

        {/* Navigation Tabs */}
        <nav className={styles.tabsNav}>
          <Link href="/politicas-de-envio" className={styles.tabLink}>
            Envíos y Despacho
          </Link>
          <Link href="/cambios-y-devoluciones" className={`${styles.tabLink} ${styles.activeTab}`}>
            Garantía y Cambios
          </Link>
          <Link href="/terminos" className={styles.tabLink}>
            Términos y Condiciones
          </Link>
          <Link href="/faq" className={styles.tabLink}>
            Preguntas Frecuentes
          </Link>
        </nav>

        {/* Content Card */}
        <div className={styles.contentCard}>
          {/* Section 1: Garantía Legal SERNAC */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <ShieldCheck size={20} /> 1. Garantía Legal de 6 Meses (Ley del Consumidor)
            </h2>
            <p className={styles.text}>
              Conforme a la Ley N° 19.496 de Protección de los Derechos de los Consumidores y las disposiciones del SERNAC, todos los productos adquiridos en <strong>SPM Streetwear®</strong> cuentan con una <strong>Garantía Legal de 6 meses</strong> desde la fecha en que recibes tu pedido.
            </p>
            <p className={styles.text}>
              Si el producto presenta defectos de fabricación, fallas en costuras, broches snapback defectuosos o bordados dañados de origen, tienes derecho a elegir libremente una de las siguientes tres opciones:
            </p>

            <ul className={styles.list}>
              <li className={styles.listItem}>
                <strong>Cambio inmediato por un producto nuevo</strong> de igual valor o características.
              </li>
              <li className={styles.listItem}>
                <strong>Devolución total del dinero</strong> cancelado a través del mismo medio de pago (Flow / Webpay).
              </li>
              <li className={styles.listItem}>
                <strong>Reparación gratuita del producto</strong> si correspondiera.
              </li>
            </ul>

            <div className={styles.calloutBox}>
              <div className={styles.calloutTitle}>Costos de Envío por Garantía Legal</div>
              <p className={styles.calloutText}>
                Si la devolución o cambio se origina por una falla de fábrica comprobada o un error en el despacho, <strong>SPM Streetwear asume el 100% de los costos de transporte de retorno y reenvío</strong>.
              </p>
            </div>
          </section>

          {/* Section 2: Cambios por Satisfacción / Talla */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <RotateCcw size={20} /> 2. Cambios por Satisfacción o Modelo (30 Días)
            </h2>
            <p className={styles.text}>
              Queremos que estés completamente satisfecho con tu gorra. Si deseas cambiar el modelo o diseño por gusto personal, dispones de un plazo de <strong>30 días corridos</strong> desde la recepción del paquete.
            </p>
            
            <p className={styles.text}>
              Para hacer efectivo el cambio voluntario, el producto debe cumplir con las siguientes condiciones:
            </p>

            <ul className={styles.list}>
              <li className={styles.listItem}>
                Estar sin uso, en perfectas condiciones higiénicas y sin olores ni manchas.
              </li>
              <li className={styles.listItem}>
                Mantener todas sus etiquetas originales intactas (stickers de visera y tags colgantes).
              </li>
              <li className={styles.listItem}>
                Presentar la boleta de compra o número de orden oficial <strong>#SPM-XXXX</strong>.
              </li>
            </ul>
          </section>

          {/* Section 3: Procedimiento */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <RefreshCw size={20} /> 3. ¿Cómo Solicitar un Cambio o Devolución?
            </h2>
            <ol className={styles.list} style={{ listStyleType: "decimal" }}>
              <li className={styles.listItem}>
                Contáctanos a través de nuestro canal de soporte por Instagram oficial (<strong>@spm_store.cl</strong>) indicando tu número de pedido (#SPM-XXXX) y el motivo de la solicitud.
              </li>
              <li className={styles.listItem}>
                Adjunta fotografías claras del producto y del detalle de la falla si se trata de garantía.
              </li>
              <li className={styles.listItem}>
                Nuestro equipo generará una etiqueta de retorno prepagada con Starken o Blue Express para que entregues el paquete en cualquier sucursal cercana.
              </li>
              <li className={styles.listItem}>
                Una vez recibido y revisado el artículo, se procesará el despacho de la nueva gorra o la reversa bancaria en un plazo máximo de <strong>48 a 72 horas hábiles</strong>.
              </li>
            </ol>
          </section>
        </div>

        {/* Support Footer */}
        <div className={styles.supportFooter}>
          <h3 className={styles.supportTitle}>¿Necesitas gestionar una garantía o cambio?</h3>
          <p className={styles.supportText}>
            Escríbenos con tu número de orden y te ayudaremos de inmediato sin trámites engorrosos.
          </p>
          <Link href="/tienda" className={styles.supportBtn}>
            Volver a la Tienda
          </Link>
        </div>
      </div>
    </div>
  );
}
