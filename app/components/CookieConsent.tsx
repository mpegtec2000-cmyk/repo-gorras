"use client";

import React, { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";
import styles from "./CookieConsent.module.css";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("spm_cookie_consent");
    if (!consent) {
      // Small delay to not show immediately on load
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("spm_cookie_consent", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.banner}>
        <div className={styles.iconContainer}>
          <Cookie size={24} />
        </div>
        
        <div className={styles.content}>
          <h3 className={styles.title}>Política de Cookies</h3>
          <p className={styles.text}>
            Utilizamos cookies para mejorar tu experiencia de navegación, analizar el tráfico del sitio y personalizar el contenido. Al continuar navegando, aceptas nuestro uso de cookies.
          </p>
        </div>

        <div className={styles.actions}>
          <button onClick={acceptCookies} className={styles.acceptBtn}>
            ACEPTAR
          </button>
          <button onClick={() => setShow(false)} className={styles.closeBtn} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
