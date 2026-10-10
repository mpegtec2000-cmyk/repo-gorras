-- ====================================================================
-- ESQUEMA DEFINITIVO BASE DE DATOS SUPABASE — SPM STORE & SAAS ADMIN
-- Ejecutar este archivo completo en el Editor SQL de Supabase:
-- https://supabase.com/dashboard/project/uscjvmwknetmwwnxhtux/sql
-- ====================================================================

-- 1. TABLA DE PRODUCTOS (CATÁLOGO Y SAAS)
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
  clicks INT NOT NULL DEFAULT 0,
  is_new BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  description TEXT NOT NULL DEFAULT '',
  specs JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Si la columna clicks no existe en una tabla preexistente, agregarla
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'clicks'
  ) THEN 
    ALTER TABLE public.products ADD COLUMN clicks INT NOT NULL DEFAULT 0;
  END IF;
END $$;

-- Índices de productos
CREATE INDEX IF NOT EXISTS idx_products_brand_slug ON public.products(brand_slug);
CREATE INDEX IF NOT EXISTS idx_products_stock ON public.products(stock);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);

-- RLS de productos (Permite lectura y escritura transparente para SaaS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Products" ON public.products;
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow Admin Write Products" ON public.products;
CREATE POLICY "Allow Admin Write Products" ON public.products FOR ALL USING (true) WITH CHECK (true);


-- 2. TABLA DE ÓRDENES Y VENTAS (CHECKOUT & FLOW.CL)
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  client_name TEXT NOT NULL,
  client_rut TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT DEFAULT '',
  client_address TEXT DEFAULT '',
  client_city TEXT DEFAULT 'Santiago Centro',
  client_region TEXT DEFAULT 'RM',
  shipping_method TEXT DEFAULT 'Envío Express Starken / Blue Express',
  shipping_cost NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Pendiente de Pago',
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  flow_order BIGINT,
  flow_token TEXT,
  payment_method TEXT DEFAULT 'Webpay Plus / Flow',
  paid_at TIMESTAMPTZ,
  payment_media TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_client_email ON public.orders(client_email);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow All Orders Read" ON public.orders;
CREATE POLICY "Allow All Orders Read" ON public.orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow All Orders Write" ON public.orders;
CREATE POLICY "Allow All Orders Write" ON public.orders FOR ALL USING (true) WITH CHECK (true);


-- 3. PERFILES DE USUARIO / CLIENTES REGISTRADOS (AUTOCOMPLETADO EN CHECKOUT)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT DEFAULT '',
  rut TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  region TEXT DEFAULT 'RM',
  city TEXT DEFAULT 'Santiago Centro',
  address TEXT DEFAULT '',
  apartment TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles Public Read" ON public.profiles;
CREATE POLICY "Profiles Public Read" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Profiles Public Upsert" ON public.profiles;
CREATE POLICY "Profiles Public Upsert" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

-- Disparador para crear el perfil automáticamente cuando un usuario se registra en auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, rut, phone)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', ''),
    COALESCE(new.raw_user_meta_data->>'rut', ''),
    COALESCE(new.raw_user_meta_data->>'phone', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    name = COALESCE(NULLIF(EXCLUDED.name, ''), public.profiles.name),
    rut = COALESCE(NULLIF(EXCLUDED.rut, ''), public.profiles.rut),
    phone = COALESCE(NULLIF(EXCLUDED.phone, ''), public.profiles.phone),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 4. ANALÍTICA DE CLICS Y EVENTOS DEL SITIO
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL DEFAULT 'click',
  product_id TEXT,
  url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow All Analytics" ON public.analytics_events;
CREATE POLICY "Allow All Analytics" ON public.analytics_events FOR ALL USING (true) WITH CHECK (true);


-- 5. BUCKET DE IMÁGENES EN SUPABASE STORAGE
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Storage Select" ON storage.objects;
CREATE POLICY "Public Storage Select" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Public Storage Insert" ON storage.objects;
CREATE POLICY "Public Storage Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Public Storage Update" ON storage.objects;
CREATE POLICY "Public Storage Update" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images');
