const fs = require('fs');

async function fetchProducts() {
  let page = 1;
  let allProducts = [];
  while (true) {
    try {
      const url = `https://drop-shop.mx/products.json?page=${page}&limit=250`;
      console.log(`Fetching ${url}...`);
      const res = await fetch(url);
      if (!res.ok) {
        console.log('Status not ok:', res.status, res.statusText);
        break;
      }
      const data = await res.json();
      if (!data.products || data.products.length === 0) break;
      allProducts = allProducts.concat(data.products);
      console.log(`Page ${page}: got ${data.products.length} products (total so far: ${allProducts.length})`);
      page++;
      if (data.products.length < 250) break;
    } catch (e) {
      console.error('Fetch error:', e);
      break;
    }
  }
  fs.writeFileSync('D:/GORROS/scripts/dropshop_products.json', JSON.stringify(allProducts, null, 2));
  console.log(`Successfully saved ${allProducts.length} products to dropshop_products.json`);
}

fetchProducts();
