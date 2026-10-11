"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { RefreshCw, ArrowLeft } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[SPM Global Error]:", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 1.5rem",
        textAlign: "center",
        backgroundColor: "#0a0a0a",
        color: "#ffffff",
      }}
    >
      <div style={{ marginBottom: "2rem" }}>
        <Image
          src="/brand/spm-logo-white.png"
          alt="SPM Streetwear"
          width={150}
          height={36}
          style={{ width: "auto", height: "auto" }}
          priority
        />
      </div>

      <span
        style={{
          display: "inline-block",
          fontSize: "0.8rem",
          fontWeight: 700,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "#e60000",
          backgroundColor: "rgba(230, 0, 0, 0.12)",
          padding: "0.35rem 0.85rem",
          borderRadius: "4px",
          marginBottom: "1rem",
        }}
      >
        ALERTA DEL SISTEMA
      </span>

      <h1
        style={{
          fontSize: "clamp(1.8rem, 4vw, 2.75rem)",
          fontWeight: 900,
          letterSpacing: "-0.03em",
          textTransform: "uppercase",
          margin: "0 0 1rem",
        }}
      >
        OCURRIÓ UN PROBLEMA INESPERADO
      </h1>

      <p
        style={{
          maxWidth: "460px",
          color: "#a1a1aa",
          fontSize: "0.95rem",
          lineHeight: 1.6,
          margin: "0 0 2rem",
        }}
      >
        No te preocupes, tus datos y compras están seguras. Puedes reintentar la acción o volver a la tienda.
      </p>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <button
          onClick={() => reset()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.6rem",
            backgroundColor: "#ffffff",
            color: "#0a0a0a",
            fontWeight: 700,
            fontSize: "0.85rem",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            padding: "0.85rem 1.75rem",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
          }}
        >
          <RefreshCw size={18} />
          REINTENTAR
        </button>

        <Link
          href="/"
          prefetch={false}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.6rem",
            backgroundColor: "transparent",
            color: "#ffffff",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            fontWeight: 700,
            fontSize: "0.85rem",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            padding: "0.85rem 1.75rem",
            borderRadius: "6px",
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={18} />
          VOLVER AL INICIO
        </Link>
      </div>
    </div>
  );
}
