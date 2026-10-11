"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, ArrowRight, Truck, Lock, CreditCard, ShoppingBag, Loader2, ArrowLeft, CheckCircle2, UserCheck } from "lucide-react";
import { useCart } from "@/app/components/CartContext";
import { formatCLP } from "@/lib/products";
import { CHILE_REGIONS } from "@/lib/chile";
import { supabase } from "@/lib/supabase";
import styles from "./Checkout.module.css";

// Formateador de RUT chileno (ej. 12.345.678-9)
function formatChileanRut(value: string): string {
  const clean = value.replace(/[^0-9kK]/g, "").toUpperCase();
  if (clean.length <= 1) return clean;
  const dv = clean.slice(-1);
  const num = clean.slice(0, -1);
  let formatted = "";
  for (let i = num.length - 1, j = 1; i >= 0; i--, j++) {
    formatted = num[i] + formatted;
    if (j % 3 === 0 && i > 0) {
      formatted = "." + formatted;
    }
  }
  return `${formatted}-${dv}`;
}

export default function CheckoutClient() {
  const { items, subtotal, totalItems } = useCart();

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    rut: "",
    email: "",
    phone: "",
    region: "RM",
    city: "Santiago Centro",
    address: "",
    apartment: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [autofilled, setAutofilled] = useState(false);
  const [autofillName, setAutofillName] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadUserData() {
      // 1. Intentar sesión oficial de Supabase Auth
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const meta = session.user.user_metadata || {};
          let prof: any = null;
          try {
            const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
            prof = data;
          } catch {}

          if (isMounted) {
            const resolvedName = prof?.name || meta.name || "";
            const resolvedRut = prof?.rut || meta.rut || "";
            const resolvedPhone = prof?.phone || meta.phone || "";
            const resolvedEmail = session.user.email || "";
            const resolvedRegion = prof?.region || "RM";
            const resolvedCity = prof?.city || "Santiago Centro";
            const resolvedAddress = prof?.address || "";
            const resolvedApt = prof?.apartment || "";

            setFormData((prev) => ({
              ...prev,
              name: resolvedName || prev.name,
              rut: resolvedRut ? formatChileanRut(resolvedRut) : prev.rut,
              email: resolvedEmail || prev.email,
              phone: resolvedPhone || prev.phone,
              region: resolvedRegion || prev.region,
              city: resolvedCity || prev.city,
              address: resolvedAddress || prev.address,
              apartment: resolvedApt || prev.apartment,
            }));
            setAutofillName(resolvedName || resolvedEmail);
            setAutofilled(true);
          }
          return;
        }
      } catch (err) {
        console.warn("No se pudo obtener sesión remota:", err);
      }

      // 2. Fallback de cliente recordado en localStorage
      try {
        const saved = localStorage.getItem("spm_customer_info");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && (parsed.email || parsed.name)) {
            if (isMounted) {
              setFormData((prev) => ({
                ...prev,
                name: parsed.name || prev.name,
                rut: parsed.rut ? formatChileanRut(parsed.rut) : prev.rut,
                email: parsed.email || prev.email,
                phone: parsed.phone || prev.phone,
                region: parsed.region || prev.region,
                city: parsed.city || prev.city,
                address: parsed.address || prev.address,
                apartment: parsed.apartment || prev.apartment,
              }));
              setAutofillName(parsed.name || parsed.email);
              setAutofilled(true);
            }
          }
        }
      } catch {}
    }

    loadUserData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Region and comunas
  const selectedRegion = CHILE_REGIONS.find((r) => r.id === formData.region) || CHILE_REGIONS[0];

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const regId = e.target.value;
    const reg = CHILE_REGIONS.find((r) => r.id === regId) || CHILE_REGIONS[0];
    setFormData((prev) => ({
      ...prev,
      region: regId,
      city: reg.comunas[0] || "",
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "rut") {
      setFormData((prev) => ({ ...prev, rut: formatChileanRut(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Shipping (temporalmente en $0 para pruebas de compra)
  const shippingCost = 0; // ORIGINAL: subtotal >= 50000 ? 0 : 3990;
  const finalTotal = subtotal + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validations
    if (!formData.name.trim()) {
      setErrorMessage("Por favor ingresa tu nombre y apellido completo.");
      return;
    }
    if (!formData.rut.trim() || formData.rut.length < 8) {
      setErrorMessage("Por favor ingresa un RUT chileno válido.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setErrorMessage("Por favor ingresa un correo electrónico válido para tu comprobante.");
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage("Por favor ingresa un teléfono de contacto para el despacho.");
      return;
    }
    if (!formData.address.trim()) {
      setErrorMessage("Por favor ingresa tu dirección de entrega (calle y número).");
      return;
    }

    try {
      setLoading(true);

      // Guardar datos en localStorage y perfiles para futuras compras
      const customerToSave = {
        name: formData.name.trim(),
        rut: formData.rut.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        region: formData.region,
        city: formData.city,
        address: formData.address.trim(),
        apartment: formData.apartment.trim(),
      };
      localStorage.setItem("spm_customer_info", JSON.stringify(customerToSave));

      // Guardar en Supabase profiles si hay sesión activa
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          await supabase.from("profiles").upsert({
            id: session.user.id,
            email: formData.email.trim().toLowerCase(),
            name: formData.name.trim(),
            rut: formData.rut.trim(),
            phone: formData.phone.trim(),
            region: formData.region,
            city: formData.city,
            address: formData.address.trim(),
            apartment: formData.apartment.trim(),
            updated_at: new Date().toISOString(),
          });
        }
      } catch {}

      const payload = {
        customer: {
          name: formData.name.trim(),
          rut: formData.rut.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: `+56 9 ${formData.phone.replace(/[^0-9]/g, "")}`,
          region: selectedRegion.name,
          city: formData.city,
          address: formData.apartment.trim()
            ? `${formData.address.trim()}, Depto/Casa ${formData.apartment.trim()}`
            : formData.address.trim(),
        },
        items: items.map((i) => ({
          productId: i.product.id,
          name: i.product.name,
          size: i.size,
          quantity: i.quantity,
        })),
        shippingMethod: "Envío Express a Domicilio (Starken / Blue Express)",
      };

      const res = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success && data.redirectUrl) {
        // Redirigir a la pasarela bancaria oficial de Flow.cl
        window.location.href = data.redirectUrl;
      } else {
        setErrorMessage(data.error || "No se pudo iniciar la sesión de pago. Intenta nuevamente.");
        setLoading(false);
      }
    } catch (err: any) {
      setErrorMessage("Error de conexión al procesar el pago: " + err.message);
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className={styles.checkoutContainer}>
        <div className={styles.checkoutInner}>
          <header className={styles.checkoutHeader}>
            <Link href="/" className={styles.brandLink}>
              <Image
                src="/brand/spm-logo-black.png"
                alt="SPM Streetwear"
                width={130}
                height={32}
                priority
                className={styles.brandLogo}
              />
            </Link>
            <div className={styles.secureBadge}>
              <ShieldCheck size={16} /> Pago Cifrado SSL
            </div>
          </header>

          <div className={styles.emptyState}>
            <ShoppingBag size={52} className={styles.emptyIcon} />
            <h2 className={styles.emptyTitle}>TU BOLSA DE COMPRAS ESTÁ VACÍA</h2>
            <p className={styles.emptyText}>
              Agrega una o más gorras del catálogo para proceder con el pago seguro.
            </p>
            <Link href="/tienda" className={styles.btnReturn}>
              <ArrowLeft size={16} /> Explorar Catálogo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.checkoutContainer}>
      <div className={styles.checkoutInner}>
        {/* Header */}
        <header className={styles.checkoutHeader}>
          <Link href="/" className={styles.brandLink}>
            <Image
              src="/brand/spm-logo-black.png"
              alt="SPM Streetwear"
              width={140}
              height={34}
              priority
              className={styles.brandLogo}
            />
          </Link>
          <div className={styles.secureBadge}>
            <Lock size={15} /> Checkout Seguro Cifrado 256-Bit
          </div>
        </header>

        <form onSubmit={handleSubmit} className={styles.grid}>
          {/* Columna Izquierda: Datos del Comprador y Envío */}
          <div className={styles.formCol}>
            {/* Paso 1: Datos Personales */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.stepNumber}>1</span>
                <h3 className={styles.cardTitle}>Datos del Comprador</h3>
              </div>

              {autofilled && (
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  padding: "0.65rem 0.9rem",
                  marginBottom: "1.25rem",
                  borderRadius: "6px",
                  backgroundColor: "rgba(16, 185, 129, 0.08)",
                  border: "1px solid rgba(16, 185, 129, 0.25)",
                  color: "#059669",
                  fontSize: "0.85rem",
                  fontWeight: 600
                }}>
                  <UserCheck size={18} />
                  <span>Sesión activa ({autofillName}). Tus datos han sido autocompletados automáticamente.</span>
                </div>
              )}

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nombre y Apellido *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ej: Matías Silva Rojas"
                  required
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGrid2}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>RUT Chileno *</label>
                  <input
                    type="text"
                    name="rut"
                    value={formData.rut}
                    onChange={handleInputChange}
                    placeholder="12.345.678-9"
                    maxLength={12}
                    required
                    className={styles.formInput}
                  />
                  <span className={styles.inputHint}>Sin puntos ni guión o con formato</span>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Teléfono Móvil *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="9 8765 4321"
                    required
                    className={styles.formInput}
                  />
                  <span className={styles.inputHint}>Para coordinación de entrega</span>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Correo Electrónico *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="tucorreo@gmail.com"
                  required
                  className={styles.formInput}
                />
                <span className={styles.inputHint}>Recibirás la boleta y el seguimiento aquí</span>
              </div>
            </div>

            {/* Paso 2: Dirección de Despacho */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.stepNumber}>2</span>
                <h3 className={styles.cardTitle}>Dirección de Despacho en Chile</h3>
              </div>

              <div className={styles.formGrid2}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Región *</label>
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleRegionChange}
                    className={styles.formSelect}
                  >
                    {CHILE_REGIONS.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Comuna / Ciudad *</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={styles.formSelect}
                  >
                    {selectedRegion.comunas.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Dirección (Calle y Número) *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Ej: Av. Providencia 1234"
                  required
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Depto / Oficina / Casa (Opcional)</label>
                <input
                  type="text"
                  name="apartment"
                  value={formData.apartment}
                  onChange={handleInputChange}
                  placeholder="Ej: Depto 402, Torre B"
                  className={styles.formInput}
                />
              </div>
            </div>

            {/* Paso 3: Método de Envío */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.stepNumber}>3</span>
                <h3 className={styles.cardTitle}>Método de Despacho</h3>
              </div>

              <div className={styles.shippingOption}>
                <div className={styles.shippingInfo}>
                  <div className={styles.shippingIconWrap}>
                    <Truck size={20} />
                  </div>
                  <div>
                    <div className={styles.shippingTitle}>
                      Despacho Express a Domicilio (Starken / Blue Express)
                    </div>
                    <div className={styles.shippingSub}>
                      Entrega en 1 a 3 días hábiles con seguimiento online
                    </div>
                  </div>
                </div>

                <div className={styles.shippingPriceWrap}>
                  {shippingCost === 0 ? (
                    <span className={styles.freeTag}>GRATIS</span>
                  ) : (
                    <span className={styles.shippingCost}>{formatCLP(shippingCost)}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Paso 4: Medio de Pago */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.stepNumber}>4</span>
                <h3 className={styles.cardTitle}>Pasarela de Pago Bancario</h3>
              </div>

              <div className={styles.paymentBox}>
                <div className={styles.paymentPill}>
                  <div className={styles.paymentPillLeft}>
                    <CreditCard size={18} />
                    <span>Webpay Plus & Flow Oficial</span>
                  </div>
                  <CheckCircle2 size={18} color="#15803d" />
                </div>

                <div className={styles.paymentMethodsGrid}>
                  <span className={`${styles.badgePay} ${styles.badgePayPrimary}`}>Webpay Plus</span>
                  <span className={styles.badgePay}>Redcompra</span>
                  <span className={styles.badgePay}>Visa</span>
                  <span className={styles.badgePay}>Mastercard</span>
                  <span className={styles.badgePay}>Banco Estado</span>
                  <span className={styles.badgePay}>Mach</span>
                  <span className={styles.badgePay}>Servipag</span>
                </div>

                <p className={styles.flowNotice}>
                  Al hacer clic en pagar, serás redirigido a la pasarela bancaria segura de Flow para ingresar los datos de tu tarjeta con autenticación bancaria directa.
                </p>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Resumen del Pedido */}
          <div className={styles.summaryCol}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>
                Resumen del Pedido ({totalItems})
              </h3>

              <div className={styles.itemsList}>
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.size}`} className={styles.itemRow}>
                    <div className={styles.itemImgWrap}>
                      <Image
                        src={item.product.images?.[0]?.src || "/brand/placeholder.png"}
                        alt={item.product.name}
                        width={52}
                        height={52}
                        className={styles.itemImg}
                      />
                    </div>
                    <div className={styles.itemDetails}>
                      <p className={styles.itemBrand}>{item.product.brand}</p>
                      <h4 className={styles.itemName}>{item.product.name}</h4>
                      <p className={styles.itemMeta}>
                        Talla: {item.size} • Cant: {item.quantity}
                      </p>
                    </div>
                    <span className={styles.itemTotal}>
                      {formatCLP(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className={styles.pricingTable}>
                <div className={styles.priceRow}>
                  <span>Subtotal</span>
                  <span>{formatCLP(subtotal)}</span>
                </div>
                <div className={styles.priceRow}>
                  <span>Envío a Domicilio</span>
                  <span>{shippingCost === 0 ? "GRATIS" : formatCLP(shippingCost)}</span>
                </div>
                <div className={styles.priceRowTotal}>
                  <span className={styles.totalLabel}>TOTAL A PAGAR</span>
                  <span className={styles.totalAmount}>{formatCLP(finalTotal)}</span>
                </div>
              </div>

              {errorMessage && (
                <div className={styles.errorAlert}>
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={styles.payBtn}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Conectando con Webpay...</span>
                  </>
                ) : (
                  <>
                    <span>PAGAR CON WEBPAY / FLOW</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className={styles.securityFooter}>
                <div className={styles.securityItem}>
                  <Lock size={12} /> Cifrado 256-Bit
                </div>
                <div className={styles.securityItem}>
                  <ShieldCheck size={12} /> Compra 100% Segura
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
