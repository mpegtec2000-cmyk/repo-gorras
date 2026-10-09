const fs = require('fs');

const shopify = JSON.parse(fs.readFileSync('D:/GORROS/scripts/dropshop_products.json', 'utf8'));

// Filter only caps/hats of Cash Only
const cashOnlyCaps = shopify.filter(p => {
  const t = (p.title || '').toLowerCase();
  const v = (p.vendor || '').toLowerCase();
  const h = (p.handle || '').toLowerCase();
  
  const isCashOnly = t.includes('cash only') || v.includes('cash only') || h.includes('cash-only');
  const isGorra = t.includes('gorra') || t.includes('hat') || t.includes('cap');
  const isClothing = t.includes('pantalon') || t.includes('playera') || t.includes('hoodie') || t.includes('t-shirt') || t.includes('short') || t.includes('denim');

  return isCashOnly && (isGorra || !isClothing);
});

console.log('=== GORRAS CASH ONLY EN DROP-SHOP ===');
console.log(`Total gorras encontradas: ${cashOnlyCaps.length}`);

cashOnlyCaps.forEach((p, i) => {
  const isAvail = p.variants.some(v => v.available);
  console.log(`${i + 1}. ${p.title} (Disponible: ${isAvail})`);
  console.log(`   https://drop-shop.mx/products/${p.handle}`);
});

// Update user_urls.json
const current = JSON.parse(fs.readFileSync('D:/GORROS/scripts/user_urls.json', 'utf8'));
let added = 0;

cashOnlyCaps.forEach(p => {
  const exists = current.urls.some(u => u.handle === p.handle || u.url.includes(p.handle));
  if (!exists) {
    current.urls.push({
      id: current.urls.length + 1,
      url: `https://drop-shop.mx/products/${p.handle}`,
      handle: p.handle,
      title: p.title,
      vendor: 'CASH ONLY'
    });
    added++;
  }
});

fs.writeFileSync('D:/GORROS/scripts/user_urls.json', JSON.stringify(current, null, 2));
console.log(`\nNuevas gorras Cash Only agregadas: ${added}`);
console.log(`Total general de productos registrados: ${current.urls.length}`);
