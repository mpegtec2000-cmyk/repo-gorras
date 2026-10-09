async function addFameClub() {
  const url = 'https://drop-shop.mx/search?q=fame+club+&options%5Bprefix%5D=last';
  const res = await fetch(url);
  const html = await res.text();
  
  const regex = /href="\/products\/([^"?#]+)/g;
  const handles = new Set();
  let match;
  while ((match = regex.exec(html)) !== null) {
    handles.add(match[1]);
  }

  console.log('Handles in fame club search:', Array.from(handles));
  
  const fs = require('fs');
  const shopify = JSON.parse(fs.readFileSync('D:/GORROS/scripts/dropshop_products.json', 'utf8'));

  const fameCaps = [];
  handles.forEach(h => {
    const prod = shopify.find(p => p.handle === h);
    if (prod) {
      const t = prod.title.toLowerCase();
      if ((t.includes('gorra') || t.includes('fame')) && !t.includes('bundle') && !t.includes('playera') && !t.includes('hoodie')) {
        fameCaps.push(prod);
      }
    }
  });

  // If there are specific caps, let's list them
  console.log(`\n=== GORRAS FAME CLUB ENCONTRADAS (${fameCaps.length}) ===`);
  fameCaps.forEach((p, i) => {
    console.log(`${i+1}. ${p.title} -> https://drop-shop.mx/products/${p.handle}`);
  });

  const current = JSON.parse(fs.readFileSync('D:/GORROS/scripts/user_urls.json', 'utf8'));
  let added = 0;
  fameCaps.forEach(p => {
    const exists = current.urls.some(u => u.handle === p.handle || u.url.includes(p.handle));
    if (!exists) {
      current.urls.push({
        id: current.urls.length + 1,
        url: `https://drop-shop.mx/products/${p.handle}`,
        handle: p.handle,
        title: p.title,
        vendor: 'FAME CLUB'
      });
      added++;
    }
  });

  fs.writeFileSync('D:/GORROS/scripts/user_urls.json', JSON.stringify(current, null, 2));
  console.log(`\nNuevas gorras Fame Club agregadas: ${added}`);
  console.log(`Total gorras en la lista: ${current.urls.length}`);
}

addFameClub();
