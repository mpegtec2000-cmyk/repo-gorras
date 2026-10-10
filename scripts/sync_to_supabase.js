const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Cargar variables desde .env.local si existen
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const val = match[2].trim();
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uscjvmwknetmwwnxhtux.supabase.co';
const secKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!secKey) {
  console.error('Error: no se encontró clave de servicio en variables de entorno.');
  process.exit(1);
}

const client = createClient(url, secKey);

async function main() {
  console.log('🚀 Iniciando sincronización masiva hacia Supabase...');
  const catalogPath = path.join(__dirname, '..', 'lib', 'catalog-data.json');
  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

  console.log(`📦 Encontrados ${catalog.length} productos en el catálogo local.`);

  const payload = catalog.map((p) => ({
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
    clicks: p.clicks || 0,
    is_new: p.isNew,
    is_featured: p.isFeatured,
    is_active: p.isActive,
    description: p.description,
    specs: p.specs,
    created_at: p.createdAt,
    updated_at: new Date().toISOString(),
  }));

  const { data, error } = await client.from('products').upsert(payload, { onConflict: 'id' });

  if (error) {
    console.error('❌ Error al sincronizar con Supabase:', error.message);
    process.exit(1);
  }

  console.log(`✅ ¡Éxito total! Se sincronizaron los ${catalog.length} productos en Supabase.`);
}

main();
