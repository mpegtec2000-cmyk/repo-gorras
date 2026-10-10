"use client";

import React, { useState, useEffect } from "react";
import { Database, ShieldAlert, CheckCircle2, RefreshCw, UploadCloud, Copy, Check, ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ConfigClient() {
  const [checking, setChecking] = useState(true);
  const [dbConnected, setDbConnected] = useState(false);
  const [dbProductCount, setDbProductCount] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const checkConnection = async () => {
    setChecking(true);
    setErrorMessage(null);
    try {
      const { data, count, error } = await supabase
        .from("products")
        .select("id", { count: "exact", head: true });

      if (error) {
        setDbConnected(false);
        setErrorMessage(error.message);
      } else {
        setDbConnected(true);
        setDbProductCount(count ?? 0);
      }
    } catch (err: any) {
      setDbConnected(false);
      setErrorMessage(err.message || "Error al conectar con Supabase");
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const handleSyncAll = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      // Leer productos del catálogo local
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      const products = data.products || [];

      if (products.length === 0) {
        setSyncResult("No se encontraron productos locales para sincronizar.");
        setSyncing(false);
        return;
      }

      // Enviar a Supabase
      const payload = products.map((p: any) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        brand: p.brand,
        brand_slug: p.brandSlug,
        seo_title: p.seoTitle,
        seo_description: p.seoDescription,
        price: p.price,
        compare_at_price: p.compareAtPrice,
        color: p.color,
        sizes: p.sizes,
        images: p.images,
        initial_stock: p.initialStock,
        sold: p.sold,
        stock: p.stock,
        is_new: p.isNew,
        is_featured: p.isFeatured,
        is_active: p.isActive,
        description: p.description,
        specs: p.specs,
        created_at: p.createdAt,
        updated_at: new Date().toISOString(),
      }));

      const { error } = await supabase.from("products").upsert(payload);

      if (error) {
        setSyncResult(`Error en Supabase: ${error.message}`);
      } else {
        setSyncResult(`¡Éxito! Se sincronizaron los ${products.length} productos a Supabase.`);
        checkConnection();
      }
    } catch (e: any) {
      setSyncResult(`Error de conexión: ${e.message}`);
    } finally {
      setSyncing(false);
    }
  };

  const sqlSchema = `-- Ejecutar en: https://supabase.com/dashboard/project/uscjvmwknetmwwnxhtux/sql
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  brand_slug TEXT NOT NULL,
  seo_title TEXT NOT NULL,
  seo_description TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 70000,
  compare_at_price NUMERIC,
  color JSONB NOT NULL DEFAULT '{"name":"Negro","hex":"#0b0b0b"}'::jsonb,
  sizes JSONB NOT NULL DEFAULT '["Única · Ajustable"]'::jsonb,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  initial_stock INT NOT NULL DEFAULT 1,
  sold INT NOT NULL DEFAULT 0,
  stock INT NOT NULL DEFAULT 1,
  is_new BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  description TEXT NOT NULL DEFAULT '',
  specs JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Products" ON public.products;
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow Admin Write Products" ON public.products;
CREATE POLICY "Allow Admin Write Products" ON public.products FOR ALL USING (true) WITH CHECK (true);

INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT (id) DO NOTHING;
DROP POLICY IF EXISTS "Public Storage Select" ON storage.objects;
CREATE POLICY "Public Storage Select" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
DROP POLICY IF EXISTS "Public Storage Insert" ON storage.objects;
CREATE POLICY "Public Storage Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "850px" }}>
      <div>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 700, margin: "0 0 0.5rem 0", color: "#111827" }}>
          Configuración de Base de Datos & Supabase
        </h2>
        <p style={{ color: "#6b7280", fontSize: "0.9rem", margin: 0 }}>
          Administra la sincronización entre el catálogo local de SPM y la base de datos PostgreSQL remota.
        </p>
      </div>

      {/* Tarjeta de Estado */}
      <div style={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Database size={24} color="#3b82f6" />
            <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600 }}>Estado de Conexión en Vivo</h3>
          </div>
          <button
            onClick={checkConnection}
            disabled={checking}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.4rem 0.8rem",
              fontSize: "0.85rem",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              background: "#f9fafb",
              cursor: "pointer",
            }}
          >
            <RefreshCw size={14} className={checking ? "spin" : ""} />
            {checking ? "Comprobando..." : "Verificar"}
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#10b981", fontSize: "0.9rem" }}>
            <CheckCircle2 size={18} />
            <strong>Project Reference:</strong> uscjvmwknetmwwnxhtux (Supabase São Paulo)
          </div>

          {dbConnected ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#10b981", fontSize: "0.9rem" }}>
              <CheckCircle2 size={18} />
              <span>
                <strong>Tablas remotas activas:</strong> {dbProductCount} productos sincronizados en Supabase.
              </span>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#f59e0b", fontSize: "0.9rem" }}>
              <ShieldAlert size={18} />
              <span>
                <strong>Base de Datos en Espera:</strong> {errorMessage || "Falta ejecutar la migración SQL en Supabase para crear las tablas."}
              </span>
            </div>
          )}

          <p style={{ color: "#4b5563", fontSize: "0.85rem", marginTop: "0.5rem", lineHeight: 1.5 }}>
            🛡️ <strong>Modo Respaldo Activo:</strong> Tu tienda y el panel SaaS operan con el catálogo local de 74 productos. Las ventas y navegación nunca se interrumpen.
          </p>
        </div>
      </div>

      {/* Acciones de Sincronización */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Paso 1: Migración SQL */}
        <div style={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "1.25rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem", fontWeight: 600 }}>Paso 1: Crear Tablas en Supabase</h4>
            <p style={{ color: "#6b7280", fontSize: "0.85rem", margin: "0 0 1rem 0" }}>
              Copia el esquema SQL y pégalo en el SQL Editor de Supabase para crear la tabla de productos y el storage de imágenes.
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexDirection: "column" }}>
            <button
              onClick={handleCopySql}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                padding: "0.6rem 1rem",
                background: "#111827",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
              {copied ? "¡Código SQL Copiado!" : "Copiar Script SQL"}
            </button>
            <a
              href="https://supabase.com/dashboard/project/uscjvmwknetmwwnxhtux/sql"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                padding: "0.5rem 1rem",
                background: "#f3f4f6",
                color: "#374151",
                textDecoration: "none",
                borderRadius: "6px",
                fontSize: "0.85rem",
                fontWeight: 500,
              }}
            >
              Abrir SQL Editor en Supabase <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Paso 2: Sincronizar Datos */}
        <div style={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "1.25rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem", fontWeight: 600 }}>Paso 2: Subir Catálogo (74 Productos)</h4>
            <p style={{ color: "#6b7280", fontSize: "0.85rem", margin: "0 0 1rem 0" }}>
              Una vez creadas las tablas, presiona este botón para enviar todos los 74 productos con sus fotos y precios a la nube de Supabase.
            </p>
          </div>
          <div>
            <button
              onClick={handleSyncAll}
              disabled={syncing}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                padding: "0.6rem 1rem",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: syncing ? "not-allowed" : "pointer",
                opacity: syncing ? 0.7 : 1,
              }}
            >
              <UploadCloud size={18} />
              {syncing ? "Sincronizando a Supabase..." : "Sincronizar Catálogo Ahora"}
            </button>
            {syncResult && (
              <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.8rem", color: syncResult.includes("Error") ? "#ef4444" : "#10b981" }}>
                {syncResult}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
