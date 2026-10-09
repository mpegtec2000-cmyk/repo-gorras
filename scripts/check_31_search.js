async function check31Search() {
  const url = 'https://drop-shop.mx/search?q=gorra+31&options%5Bprefix%5D=last';
  const res = await fetch(url);
  const html = await res.text();
  
  const regex = /href="\/products\/([^"?#]+)/g;
  const handles = new Set();
  let match;
  while ((match = regex.exec(html)) !== null) {
    handles.add(match[1]);
  }

  console.log('Total handles in gorra 31 search:', handles.size);
  
  const fs = require('fs');
  const shopify = JSON.parse(fs.readFileSync('D:/GORROS/scripts/dropshop_products.json', 'utf8'));
  const current = JSON.parse(fs.readFileSync('D:/GORROS/scripts/user_urls_final.json', 'utf8')).urls;

  const inSearchCaps = [];
  const missingCaps = [];
  const alreadyInListCaps = [];

  handles.forEach(h => {
    const prod = shopify.find(p => p.handle === h);
    if (prod) {
      const t = prod.title.toLowerCase();
      const isCap = (t.includes('gorra') || t.includes('hat') || t.includes('cap') || t.includes('31')) && 
                    !t.includes('mystery box') && 
                    !t.includes('playera') && 
                    !t.includes('short') && 
                    !t.includes('hoodie') &&
                    !t.includes('carta pokemon');

      if (isCap) {
        inSearchCaps.push(prod);
        const inList = current.find(c => c.handle === h || c.url.includes(h));
        if (inList) {
          alreadyInListCaps.push(prod);
        } else {
          missingCaps.push(prod);
        }
      }
    }
  });

  console.log(`\n=== ANÁLISIS DE LA BÚSQUEDA "GORRA 31" ===`);
  console.log(`Total gorras en la página de búsqueda: ${inSearchCaps.length}`);
  console.log(`Gorras que YA TENEMOS en la lista: ${alreadyInListCaps.length}`);
  console.log(`Gorras que FALTAN por agregar: ${missingCaps.length}`);

  console.log('\n--- GORRAS QUE FALTAN ---');
  missingCaps.forEach((m, i) => {
    const isAvail = m.variants.some(v => v.available);
    console.log(`${i+1}. [${m.vendor}] ${m.title} (Disponible: ${isAvail})`);
    console.log(`   https://drop-shop.mx/products/${m.handle}`);
  });
}

check31Search();
