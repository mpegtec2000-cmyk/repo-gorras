const fs = require('fs');
const shopify = JSON.parse(fs.readFileSync('D:/GORROS/scripts/dropshop_products.json', 'utf8'));

const fameProds = shopify.filter(p => {
  const t = (p.title || '').toLowerCase();
  const v = (p.vendor || '').toLowerCase();
  return (t.includes('fame club') || v.includes('fame club')) && (t.includes('gorra') || t.includes('cap') || t.includes('hat'));
});

console.log('Fame club caps in whole Shopify catalog:', fameProds.length);
fameProds.forEach(p => console.log(' -', p.title, '->', p.handle));
