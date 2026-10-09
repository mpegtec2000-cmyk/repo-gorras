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

console.log(`Total relevant products: ${relevant.length}`);
relevant.forEach((p, idx) => {
  console.log(`${idx+1}. [${p.vendor}] ${p.title} -> https://drop-shop.mx/products/${p.handle}`);
});
