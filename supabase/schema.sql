-- ====================================================================
-- ESQUEMA BASE DE DATOS SUPABASE — SPM STREETWEAR STORE & SAAS ADMIN
-- Ejecutar este archivo en el Editor SQL de tu proyecto Supabase:
-- https://supabase.com/dashboard/project/uscjvmwknetmwwnxhtux/sql
-- ====================================================================

-- 1. Tabla de Productos
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

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_products_brand_slug ON public.products(brand_slug);
CREATE INDEX IF NOT EXISTS idx_products_stock ON public.products(stock);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública y escritura anon/service
DROP POLICY IF EXISTS "Public Read Products" ON public.products;
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow Admin Write Products" ON public.products;
CREATE POLICY "Allow Admin Write Products" ON public.products FOR ALL USING (true) WITH CHECK (true);

-- 2. Bucket para Imágenes de Productos en Supabase Storage
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Storage Select" ON storage.objects;
CREATE POLICY "Public Storage Select" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Public Storage Insert" ON storage.objects;
CREATE POLICY "Public Storage Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Public Storage Update" ON storage.objects;
CREATE POLICY "Public Storage Update" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images');
