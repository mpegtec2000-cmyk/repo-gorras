const fs = require('fs');

const shopify = JSON.parse(fs.readFileSync('D:/GORROS/scripts/dropshop_products.json', 'utf8'));

// Filter all rebel hats
const rebelResults = shopify.filter(p => {
  const t = (p.title || '').toLowerCase();
  const v = (p.vendor || '').toLowerCase();
  const h = (p.handle || '').toLowerCase();
  return (t.includes('rebel') || v.includes('rebel') || h.includes('rebel')) && 
         !t.includes('jordan') && 
         !t.includes('dunk') && 
         !t.includes('rebellionaire');
});

console.log('=== GORRAS REBEL ENCONTRADAS EN DROP-SHOP SEARCH ===');
console.log(`Total gorras Rebel: ${rebelResults.length}`);

rebelResults.forEach((p, i) => {
  const isAvail = p.variants.some(v => v.available);
  console.log(`${i + 1}. ${p.title} (Disponible: ${isAvail})`);
  console.log(`   https://drop-shop.mx/products/${p.handle}`);
});

// Now let's update user_urls.json with any new Rebel hat
const current = JSON.parse(fs.readFileSync('D:/GORROS/scripts/user_urls.json', 'utf8'));
let addedCount = 0;

rebelResults.forEach(p => {
  const exists = current.urls.some(u => u.handle === p.handle || u.url.includes(p.handle));
  if (!exists) {
    current.urls.push({
      id: current.urls.length + 1,
      url: `https://drop-shop.mx/products/${p.handle}`,
      handle: p.handle,
      title: p.title,
      vendor: p.vendor || 'Rebel Hats'
    });
    addedCount++;
  }
});

fs.writeFileSync('D:/GORROS/scripts/user_urls.json', JSON.stringify(current, null, 2));
console.log(`\nNuevas gorras Rebel agregadas a la lista: ${addedCount}`);
console.log(`Total productos en la lista general: ${current.urls.length}`);
