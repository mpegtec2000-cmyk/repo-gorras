const fs = require('fs');

const shopifyProducts = JSON.parse(fs.readFileSync('D:/GORROS/scripts/dropshop_products.json', 'utf8'));

const targetBrands = [
  'cash only',
  'dreamer',
  'icon',
  'rebel',
  'inedit',
  'innedit',
  'fame club',
  '31 hats',
  'thirty one',
  'anymore',
  'barbas'
];

function norm(s) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

const relevant = shopifyProducts.filter(p => {
  const v = norm(p.vendor);
  const t = norm(p.title);
  return targetBrands.some(b => v.includes(b) || t.includes(b));
});

console.log(`Total relevant products in drop-shop: ${relevant.length}`);

// Group by brand
const byBrand = {};
relevant.forEach(p => {
  const v = p.vendor || 'Unknown';
  if (!byBrand[v]) byBrand[v] = [];
  byBrand[v].push({
    title: p.title,
    handle: p.handle,
    variants: p.variants.map(v => ({ title: v.title, available: v.available, price: v.price }))
  });
});

for (const [vendor, prods] of Object.entries(byBrand)) {
  console.log(`\n=== Vendor: ${vendor} (${prods.length} products) ===`);
  prods.forEach(p => {
    console.log(` - ${p.title} (https://drop-shop.mx/products/${p.handle})`);
  });
}
