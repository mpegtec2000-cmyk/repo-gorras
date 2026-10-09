const fs = require('fs');

async function getRebelAvailable() {
  const res = await fetch('https://drop-shop.mx/collections/caps-baez-copia/products.json?limit=250');
  const d = await res.json();
  const rebelProducts = d.products.filter(p => {
    return (p.vendor || '').toLowerCase().includes('rebel') || (p.title || '').toLowerCase().includes('rebel');
  });
  console.log('Total rebel products in collection:', rebelProducts.length);
  rebelProducts.forEach((p, idx) => {
    const isAvail = p.variants.some(v => v.available);
    console.log(`${idx+1}. ${p.title} | https://drop-shop.mx/products/${p.handle} | Available: ${isAvail}`);
  });
  fs.writeFileSync('D:/GORROS/scripts/rebel_collection_products.json', JSON.stringify(rebelProducts, null, 2));
}

getRebelAvailable();
