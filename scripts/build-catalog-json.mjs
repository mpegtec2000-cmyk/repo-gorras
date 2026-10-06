import fs from 'fs';
import path from 'path';

// Helpers from products.ts
const normalize = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const slugify = (s) => normalize(s).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 90);
function truncateWords(text, max) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max + 1);
  const idx = cut.lastIndexOf(" ");
  return (idx > max * 0.6 ? cut.slice(0, idx) : clean.slice(0, max)).replace(/[\s,.;:–-]+$/, "");
}
const buildSeoTitle = (brand, name) => truncateWords(`Jockey ${brand} ${name}`, 60);
const buildSeoDescription = (brand, name) => truncateWords(`Jockey ${brand} ${name.toLowerCase()}. Gorra streetwear original de edición limitada. Compra en SPM Store con envíos a todo Chile.`, 160);

const rawPath = path.join(process.cwd(), 'scripts', 'raw-data-utf8.json');
let raw = fs.readFileSync(rawPath, 'utf8');
if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
const rows = JSON.parse(raw);

const products = [];
let idCounter = 1;
const createdAt = new Date().toISOString();

for (const row of rows) {
  if (row.r === 1 || row.r === 47) continue; // header and total footer
  
  const brandRaw = row.A ? row.A.trim() : '';
  const nameRaw = row.B ? row.B.trim() : '';
  const initialStock = parseInt(row.C) || 0;
  const sold = parseInt(row.D) || 0;
  const stock = parseInt(row.E) || 0;
  const price = parseInt(row.F) || 70000;

  if (!brandRaw || !nameRaw) continue;

  const brandMap = {
    'cash only': 'Cash Only',
    'cash only': 'Cash Only',
    'dreamer hats': 'Dreamer Hats',
    'icon hats': 'Icon Hats',
    'rebel hats': 'Rebel Hats',
    'inédit': 'Inédit',
    'in├ëdit': 'Inédit', // handled encoding artifact
    'fame club': 'Fame Club',
    'thirty one / 31 hats': 'Thirty One',
    'anymore': 'Anymore',
    'barbas hats': 'Barbas Hats'
  };

  const cleanBrand = brandMap[brandRaw.toLowerCase()] || brandRaw;
  const brandSlug = slugify(cleanBrand);
  const slug = slugify(`${cleanBrand} ${nameRaw}`);
  const isNew = sold === 0 && stock > 0;
  const isFeatured = sold > 0 && stock > 0;

  const product = {
    id: `prod_${idCounter++}`,
    slug,
    name: nameRaw,
    brand: cleanBrand,
    brandSlug,
    seoTitle: buildSeoTitle(cleanBrand, nameRaw),
    seoDescription: buildSeoDescription(cleanBrand, nameRaw),
    price,
    compareAtPrice: null,
    color: { name: "Referencia imagen", hex: "#000000" },
    sizes: ["Única · Ajustable"],
    images: [{ src: "", alt: "" }],
    initialStock,
    sold,
    stock,
    isNew,
    isFeatured,
    isActive: true,
    description: `Jockey ${cleanBrand} modelo ${nameRaw}. 100% original.`,
    specs: [
      { label: "Marca", value: cleanBrand },
      { label: "Modelo", value: nameRaw }
    ],
    createdAt,
    updatedAt: createdAt
  };
  
  products.push(product);
}

fs.writeFileSync(
  path.join(process.cwd(), 'lib', 'catalog-data.json'), 
  JSON.stringify(products, null, 2), 
  'utf8'
);
console.log(`Generated ${products.length} products to lib/catalog-data.json`);
