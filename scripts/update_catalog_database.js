const fs = require('fs');

const processed = JSON.parse(fs.readFileSync('D:/GORROS/scripts/processed_products.json', 'utf8'));

// Format clean brand name
function cleanBrand(vendor) {
  const v = vendor.trim();
  if (v === '31 HATS') return '31 Hats';
  if (v === 'CASH ONLY') return 'Cash Only';
  if (v === 'REBEL HATS') return 'Rebel Hats';
  if (v === 'DREAMER HATS') return 'Dreamer Hats';
  if (v === 'FAME CLUB') return 'Fame Club';
  if (v === 'BARBAS HATS') return 'Barbas Hats';
  return v;
}

// Format brandSlug
function brandToSlug(vendor) {
  const v = vendor.toLowerCase();
  if (v.includes('31')) return '31-hats';
  if (v.includes('cash')) return 'cash-only';
  if (v.includes('rebel')) return 'rebel-hats';
  if (v.includes('dreamer')) return 'dreamer-hats';
  if (v.includes('fame')) return 'fame-club';
  if (v.includes('barbas')) return 'barbas-hats';
  return v.replace(/[^a-z0-9]+/g, '-');
}

// Clean up product name
function cleanName(title, brand) {
  let name = title
    .replace(/^GORRA\s+/i, '')
    .replace(/^Gorra\s+/i, '')
    .replace(/EL\s+BARBAS\s+HATS/i, '')
    .replace(/EL\s+DREAMER\s+HATS/i, '')
    .replace(/BARBAS\s+HATS/i, '')
    .replace(/DREAMER\s+HATS/i, '')
    .replace(/31\s+HATS/i, '')
    .replace(/REBEL\s+HATS/i, '')
    .replace(/REBEL/i, '')
    .replace(/CASH\s+ONLY/i, '')
    .replace(/FAME\s+CLUB/i, '')
    .replace(/^[-–—:\s]+/i, '')
    .replace(/[-–—:\s]+$/i, '')
    .replace(/["“”]/g, '')
    .trim();

  if (!name || name.length < 2) {
    name = title;
  }
  return name;
}

// SEO Title (Google Guidelines: <= 60 chars)
function buildSeoTitle(brand, name) {
  const full = `Jockey ${brand} ${name}`;
  if (full.length <= 60) return full;
  return full.slice(0, 57).trim() + '...';
}

// SEO Description (Google Guidelines: <= 160 chars)
function buildSeoDescription(brand, name) {
  const full = `Gorra streetwear original ${brand} ${name}. Edición limitada de alta calidad con broche ajustable. Envíos express a todo Chile en SPM Store.`;
  if (full.length <= 160) return full;
  return full.slice(0, 157).trim() + '...';
}

const catalog = processed.map((p, idx) => {
  const brand = cleanBrand(p.vendor);
  const brandSlug = brandToSlug(p.vendor);
  const name = cleanName(p.title, brand);
  const slug = `${brandSlug}-${p.handle}`.replace(/--+/g, '-');

  return {
    id: `prod_${idx + 1}`,
    slug: slug,
    name: name,
    brand: brand,
    brandSlug: brandSlug,
    seoTitle: buildSeoTitle(brand, name),
    seoDescription: buildSeoDescription(brand, name),
    price: 70000,
    compareAtPrice: null,
    color: {
      name: "Edición Oficial",
      hex: "#111111"
    },
    sizes: [
      "Única · Ajustable"
    ],
    images: p.localImages,
    initialStock: 1,
    sold: 0,
    stock: 1, // As requested: set stock to 1
    isNew: true,
    isFeatured: idx % 5 === 0, // Feature a curated subset across brands
    isActive: true,
    description: `Gorra streetwear 100% original ${brand} modelo ${name}. Confección premium con bordados detallados y broche ajustable. Disponible en SPM Store con despacho a todo Chile.`,
    specs: [
      { label: "Marca", value: brand },
      { label: "Modelo", value: name },
      { label: "Tipo", value: "Gorra / Jockey Streetwear" },
      { label: "Talla", value: "Unitalla Ajustable (Snapback / Strapback)" },
      { label: "Condición", value: "Nuevo con etiquetas / 100% Original" }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
});

// Write to lib/catalog-data.json and data/catalog.json
fs.writeFileSync('D:/GORROS/lib/catalog-data.json', JSON.stringify(catalog, null, 2));
fs.writeFileSync('D:/GORROS/data/catalog.json', JSON.stringify(catalog, null, 2));

console.log(`Updated catalog with ${catalog.length} products!`);

const brandSummary = {};
catalog.forEach(c => {
  brandSummary[c.brand] = (brandSummary[c.brand] || 0) + 1;
});
console.table(brandSummary);
