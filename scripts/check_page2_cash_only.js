async function checkPage2() {
  const url = 'https://drop-shop.mx/search?options%5Bprefix%5D=last&page=2&q=cash+only';
  const res = await fetch(url);
  const html = await res.text();
  
  const regex = /href="\/products\/([^"?#]+)/g;
  const handles = new Set();
  let match;
  while ((match = regex.exec(html)) !== null) {
    handles.add(match[1]);
  }

  console.log('Total handles on page 2:', handles.size);
  
  const fs = require('fs');
  const shopify = JSON.parse(fs.readFileSync('D:/GORROS/scripts/dropshop_products.json', 'utf8'));

  const prods = [];
  handles.forEach(h => {
    const prod = shopify.find(p => p.handle === h);
    if (prod) {
      prods.push(prod);
    } else {
      console.log('Handle not found in cache:', h);
    }
  });

  console.log('\n=== PRODUCTOS EN PÁGINA 2 ===');
  prods.forEach((p, i) => {
    console.log(`${i+1}. [${p.vendor}] ${p.title} -> https://drop-shop.mx/products/${p.handle}`);
  });

  // Update user_urls
  const current = JSON.parse(fs.readFileSync('D:/GORROS/scripts/user_urls.json', 'utf8'));
  let added = 0;
  prods.forEach(p => {
    const isCap = p.title.toLowerCase().includes('gorra') || p.title.toLowerCase().includes('hat') || p.title.toLowerCase().includes('cap');
    if (isCap) {
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
    }
  });

  fs.writeFileSync('D:/GORROS/scripts/user_urls.json', JSON.stringify(current, null, 2));
  console.log(`\nNuevas gorras añadidas desde la página 2: ${added}`);
  console.log(`Total de productos en lista general: ${current.urls.length}`);
}

checkPage2();
