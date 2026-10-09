const fs = require('fs');

const urls = JSON.parse(fs.readFileSync('D:/GORROS/scripts/user_urls.json', 'utf8')).urls;
const dreamerInList = urls.filter(u => 
  (u.vendor || '').toLowerCase().includes('dreamer') || 
  (u.title || '').toLowerCase().includes('dreamer') || 
  u.url.toLowerCase().includes('dreamer')
);

console.log('=== ESTADO ACTUAL DE GORRAS DREAMER EN NUESTRA LISTA ===');
console.log(`Gorras Dreamer agregadas actualmente en la lista: ${dreamerInList.length}`);

const shopify = JSON.parse(fs.readFileSync('D:/GORROS/scripts/dropshop_products.json', 'utf8'));
const dreamerShopify = shopify.filter(p => {
  const t = (p.title || '').toLowerCase();
  const v = (p.vendor || '').toLowerCase();
  return (t.includes('dreamer') || v.includes('dreamer')) && !t.includes('versace');
});

console.log(`\n=== GORRAS DREAMER DISPONIBLES EN DROP-SHOP (${dreamerShopify.length}) ===`);
dreamerShopify.forEach((p, i) => {
  const isAvail = p.variants.some(v => v.available);
  console.log(`${i + 1}. ${p.title} (Disponible: ${isAvail})`);
  console.log(`   https://drop-shop.mx/products/${p.handle}`);
});
