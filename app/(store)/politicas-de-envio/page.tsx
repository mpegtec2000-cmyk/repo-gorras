import React from "react";
import Link from "next/link";
import { Truck, Clock, ShieldCheck, ChevronRight, MapPin, PackageCheck, AlertCircle } from "lucide-react";
import styles from "../legal.module.css";

export const metadata = {
  title: "Políticas de Envío y Despacho | SPM Streetwear Chile",
  description: "Conoce los plazos de entrega, couriers oficiales Starken y Blue Express, y cobertura a todo Chile de SPM Streetwear.",
};

export default function PoliticasEnvioPage() {
  return (
    <div className={styles.legalContainer}>
      <div className={styles.legalInner}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href="/">Inicio</Link>
          <ChevronRight size={14} />
          <span className={styles.breadcrumbActive}>Políticas de Envío</span>
        </nav>

        {/* Header */}
        <header className={styles.pageHeader}>
          <span className={styles.tag}>
            <Truck size={14} /> COURIERS & LOGÍSTICA CHILE
          </span>
          <h1 className={styles.pageTitle}>Políticas de Envío y Despacho</h1>
          <p className={styles.pageSubtitle}>
            Envíos rápidos y asegurados a todo el territorio nacional a través de Starken y Blue Express.
          </p>
        </header>

        {/* Navigation Tabs */}
        <nav className={styles.tabsNav}>
          <Link href="/politicas-de-envio" className={`${styles.tabLink} ${styles.activeTab}`}>
            Envíos y Despacho
          </Link>
          <Link href="/cambios-y-devoluciones" className={styles.tabLink}>
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
          {/* Section 1 */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <PackageCheck size={20} /> 1. Couriers y Alianzas Oficiales
            </h2>
            <p className={styles.text}>
              En <strong>SPM Streetwear®</strong> despachamos todos los pedidos exclusivamente mediante empresas de transporte certificadas: <strong>Starken</strong> y <strong>Blue Express</strong>. Cada paquete viaja protegido en embalaje rígido para preservar la estructura de la corona y la visera de la gorra, con seguro de transporte ante cualquier extravío o daño.
            </p>
          </section>

          {/* Section 2: Tiempos de Entrega */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Clock size={20} /> 2. Plazos Estimados de Entrega
            </h2>
            <p className={styles.text}>
              Los pedidos completados y pagados con Webpay / Flow antes de las <strong>13:00 hrs</strong> (días hábiles) se entregan al courier el mismo día. Aquellos realizados después de las 13:00 hrs o en fines de semana se procesan al día hábil siguiente.
            </p>

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Zona Geográfica</th>
                    <th>Regiones</th>
                    <th>Tiempo Estimado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Región Metropolitana</strong></td>
                    <td>Santiago urbano y comunas aledañas</td>
                    <td><strong>1 a 2 días hábiles</strong></td>
                  </tr>
                  <tr>
                    <td><strong>Zona Centro y Sur</strong></td>
                    <td>Valparaíso, O&apos;Higgins, Maule, Biobío, Araucanía, Los Ríos, Los Lagos</td>
                    <td><strong>2 a 3 días hábiles</strong></td>
                  </tr>
                  <tr>
                    <td><strong>Zona Norte</strong></td>
                    <td>Coquimbo, Atacama, Antofagasta, Tarapacá, Arica</td>
                    <td><strong>2 a 4 días hábiles</strong></td>
                  </tr>
                  <tr>
                    <td><strong>Zonas Extremas</strong></td>
                    <td>Aysén y Magallanes</td>
                    <td><strong>3 a 6 días hábiles</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3: Costos y Envío Gratis */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <ShieldCheck size={20} /> 3. Tarifas y Envío Gratuito
            </h2>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <strong>ENVÍO GRATIS:</strong> En todas las compras iguales o superiores a <strong>$50.000 CLP</strong> a cualquier destino de Chile continental.
              </li>
              <li className={styles.listItem}>
                <strong>TARIFA PLANA ECONÓMICA:</strong> Para compras menores a $50.000 CLP, el costo fijo es de solo <strong>$3.990 CLP</strong> para Santiago y principales ciudades.
              </li>
            </ul>

            <div className={styles.calloutBox}>
              <div className={styles.calloutTitle}>Seguimiento en Tiempo Real</div>
              <p className={styles.calloutText}>
                Una vez que tu paquete sea retirado por Starken o Blue Express, recibirás un correo electrónico automático con el número de seguimiento (Orden de Transporte OT) para rastrear tu pedido en vivo.
              </p>
            </div>
          </section>

          {/* Section 4: Intentos de Entrega */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <MapPin size={20} /> 4. Intentos de Entrega y Dirección
            </h2>
            <p className={styles.text}>
              El courier realiza <strong>2 intentos de entrega</strong> en la dirección indicada por el cliente. Si en el segundo intento no es posible ubicar a un receptor mayor de 18 años, el paquete quedará retenido por 5 días hábiles en la sucursal del transportista más cercana para su retiro personal.
            </p>
            <p className={styles.text}>
              Es responsabilidad del comprador ingresar una dirección completa, válida y con numeración visible al momento de completar el checkout.
            </p>
          </section>
        </div>

        {/* Support Footer */}
        <div className={styles.supportFooter}>
          <h3 className={styles.supportTitle}>¿Tienes dudas sobre el estado de tu envío?</h3>
          <p className={styles.supportText}>
            Nuestro equipo de soporte está disponible de Lunes a Sábado de 10:00 a 19:00 hrs.
          </p>
          <Link href="/tienda" className={styles.supportBtn}>
            Volver a la Tienda
          </Link>
        </div>
      </div>
    </div>
  );
}
