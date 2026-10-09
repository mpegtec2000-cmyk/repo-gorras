async function countExactSearch() {
  const url = 'https://drop-shop.mx/search?q=cash+only&options%5Bprefix%5D=last';
  const res = await fetch(url);
  const html = await res.text();
  
  // Find product handles in the HTML
  const regex = /href="\/products\/([^"?#]+)/g;
  const handles = new Set();
  let match;
  while ((match = regex.exec(html)) !== null) {
    handles.add(match[1]);
  }

  console.log('Total product links in search results:', handles.size);
  
  const fs = require('fs');
  const shopify = JSON.parse(fs.readFileSync('D:/GORROS/scripts/dropshop_products.json', 'utf8'));

  const capsInSearch = [];
  const otherItems = [];

  handles.forEach(h => {
    const prod = shopify.find(p => p.handle === h);
    if (prod) {
      const t = prod.title.toLowerCase();
      if (t.includes('gorra') || t.includes('hat') || t.includes('cap')) {
        capsInSearch.push(prod);
      } else {
        otherItems.push(prod);
      }
    } else {
      console.log('Not in local cache handle:', h);
    }
  });

  console.log(`\n========================================`);
  console.log(`Total productos en esa URL: ${handles.size}`);
  console.log(`- GORRAS: ${capsInSearch.length}`);
  console.log(`- ROPA / OTROS: ${otherItems.length}`);
  console.log(`========================================\n`);

  console.log('--- GORRAS EXACTAS DE ESA BÚSQUEDA ---');
  capsInSearch.forEach((c, i) => {
    console.log(`${i+1}. ${c.title} (https://drop-shop.mx/products/${c.handle})`);
  });

  console.log('\n--- OTROS PRODUCTOS EN ESA BÚSQUEDA (NO GORRAS) ---');
  otherItems.forEach((o, i) => {
    console.log(`${i+1}. ${o.title}`);
  });
}

countExactSearch();
