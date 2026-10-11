import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';

// Cargar variables de entorno desde .env.local si existen
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const val = match[2].trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uscjvmwknetmwwnxhtux.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

const itemsToImport = [
  {
    handle: 'gorra-icon-hats-ny-yankees-crystal-black-preventa',
    id: 'prod_75',
    name: 'NY YANKEES CRYSTAL BLACK',
    fullName: 'Gorra Icon Los Angeles NY Yankees Crystal Black',
    slug: 'icon-hats-ny-yankees-crystal-black',
    colorName: 'Negro / Cristales Black',
    colorHex: '#0b0b0b',
  },
  {
    handle: 'gorra-icon-hats-la-dodgers-crystal-black',
    id: 'prod_76',
    name: 'LA DODGERS CRYSTAL BLACK',
    fullName: 'Gorra Icon Los Angeles LA Dodgers Crystal Black',
    slug: 'icon-hats-la-dodgers-crystal-black',
    colorName: 'Negro / Cristales Black',
    colorHex: '#0b0b0b',
  },
  {
    handle: 'gorra-icon-hats-ny-yankees-crystal-white',
    id: 'prod_77',
    name: 'NY YANKEES CRYSTAL WHITE',
    fullName: 'Gorra Icon Los Angeles NY Yankees Crystal White',
    slug: 'icon-hats-ny-yankees-crystal-white',
    colorName: 'Negro / Cristales White',
    colorHex: '#1a1a1a',
  },
  {
    handle: 'gorra-icon-los-angeles-stars',
    id: 'prod_78',
    name: 'LOS ANGELES STARS',
    fullName: 'Gorra Icon Hats Los Angeles Stars',
    slug: 'icon-hats-los-angeles-stars',
    colorName: 'Negro / Estrellas 3D',
    colorHex: '#0a0a0a',
  },
  {
    handle: 'gorra-icon-los-angeles-la-dodgers-crystal-sky-blue',
    id: 'prod_79',
    name: 'LA DODGERS CRYSTAL SKY BLUE',
    fullName: 'Gorra Icon Los Angeles LA Dodgers Crystal Sky Blue',
    slug: 'icon-hats-la-dodgers-crystal-sky-blue',
    colorName: 'Celeste / Sky Blue',
    colorHex: '#5b9bd5',
  },
  {
    handle: 'gorra-icon-los-angeles-ny-yankees-crystal-sky-blue',
    id: 'prod_80',
    name: 'NY YANKEES CRYSTAL SKY BLUE',
    fullName: 'Gorra Icon Los Angeles NY Yankees Crystal Sky Blue',
    slug: 'icon-hats-ny-yankees-crystal-sky-blue',
    colorName: 'Celeste / Sky Blue',
    colorHex: '#5b9bd5',
  },
  {
    handle: 'gorra-icon-hats-la-dodgers-crystal-white',
    id: 'prod_81',
    name: 'LA DODGERS CRYSTAL WHITE',
    fullName: 'Gorra Icon Los Angeles LA Dodgers Crystal White',
    slug: 'icon-hats-la-dodgers-crystal-white',
    colorName: 'Negro / Cristales White',
    colorHex: '#1a1a1a',
  },
];

async function run() {
  console.log('🚀 Iniciando importación de 7 gorras Icon Hats...');
  const newProducts = [];
  const publicProductsDir = path.join(process.cwd(), 'public', 'products');

  for (const item of itemsToImport) {
    console.log(`\n📦 Procesando: ${item.fullName} (${item.handle})`);
    
    // 1. Fetch producto desde Shopify
    const res = await fetch(`https://drop-shop.mx/products/${item.handle}.js`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    if (!res.ok) {
      console.error(`❌ Error al obtener datos para ${item.handle}: ${res.status}`);
      continue;
    }
    const data = await res.json();
    
    // 2. Tomar las 3 primeras imágenes
    const rawImages = (data.images || []).slice(0, 3);
    const convertedImages = [];

    for (let i = 0; i < rawImages.length; i++) {
      let imgUrl = rawImages[i];
      if (imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl;
      // Remover tamaño query y pedir alta resolución
      imgUrl = imgUrl.split('?')[0];

      const fileName = `gorra-${item.slug}-${i + 1}.webp`;
      const filePath = path.join(publicProductsDir, fileName);

      try {
        console.log(`   ⬇️ Descargando imagen ${i + 1}: ${imgUrl}`);
        const imgRes = await fetch(imgUrl);
        const buffer = Buffer.from(await imgRes.arrayBuffer());

        await sharp(buffer)
          .resize(1000, 1000, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 88 })
          .toFile(filePath);

        convertedImages.push({
          src: `/products/${fileName}`,
          alt: `Gorra Icon Hats "${item.name}" - Vista ${i + 1} original SPM Store Chile`,
        });
        console.log(`   ✅ Guardada en: ${fileName}`);
      } catch (err) {
        console.error(`   ❌ Error descargando imagen ${i + 1}:`, err.message);
      }
    }

    // 3. Construir objeto Product
    const now = new Date().toISOString();
    const product = {
      id: item.id,
      slug: item.slug,
      name: item.name,
      brand: "Icon Hats",
      brandSlug: "icon-hats",
      seoTitle: `Gorra Icon Hats ${item.name} | SPM Store Chile`,
      seoDescription: `Gorra streetwear original Icon Hats modelo ${item.name}. Confección de alta calidad con cristales y bordados exclusivos. Envíos express a todo Chile en SPM Store.`,
      price: 70000,
      compareAtPrice: 85000,
      color: {
        name: item.colorName,
        hex: item.colorHex,
      },
      sizes: ["Única · Ajustable"],
      images: convertedImages,
      initialStock: 1,
      sold: 0,
      stock: 1,
      clicks: 0,
      isNew: true,
      isFeatured: false,
      isActive: true,
      description: `Gorra streetwear 100% original Icon Hats modelo ${item.name}. Confección premium con cristales incrustados, bordados en alto relieve y broche ajustable. Disponible en SPM Store con despacho a todo Chile.`,
      specs: [
        { label: "Marca", value: "Icon Hats" },
        { label: "Modelo", value: item.name },
        { label: "Colección", value: "Icon Los Angeles Crystal Edition" },
        { label: "Tipo", value: "Gorra / Jockey Streetwear" },
        { label: "Talla", value: "Unitalla Ajustable (Snapback / Strapback)" },
        { label: "Condición", value: "Nuevo con etiquetas / 100% Original" },
      ],
      createdAt: now,
      updatedAt: now,
    };

    newProducts.push(product);
  }

  // 4. Actualizar lib/catalog-data.json
  const catalogPath = path.join(process.cwd(), 'lib', 'catalog-data.json');
  const rawCatalog = fs.readFileSync(catalogPath, 'utf-8');
  const currentCatalog = JSON.parse(rawCatalog);

  // Filtrar duplicados si ya existen
  const currentIds = new Set(newProducts.map(p => p.id));
  const filteredCatalog = currentCatalog.filter(p => !currentIds.has(p.id));
  const updatedCatalog = [...newProducts, ...filteredCatalog];

  fs.writeFileSync(catalogPath, JSON.stringify(updatedCatalog, null, 2));
  console.log(`\n✅ lib/catalog-data.json actualizado: Total ${updatedCatalog.length} productos.`);

  // 5. Insertar / Actualizar en Supabase
  console.log('\n🔄 Sincronizando con Supabase tabla products...');
  for (const p of newProducts) {
    const dbRow = {
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
      clicks: p.clicks,
      is_new: p.isNew,
      is_featured: p.isFeatured,
      is_active: p.isActive,
      description: p.description,
      specs: p.specs,
      created_at: p.createdAt,
      updated_at: p.updatedAt,
    };

    const { error } = await sb.from('products').upsert(dbRow, { onConflict: 'id' });
    if (error) {
      console.error(`❌ Error en Supabase para ${p.id}:`, error.message);
    } else {
      console.log(`✅ Supabase sincronizado: ${p.id} - ${p.name}`);
    }
  }

  console.log('\n🎉 ¡Importación de las 7 gorras Icon Hats completada con éxito!');
}

run().catch(console.error);
