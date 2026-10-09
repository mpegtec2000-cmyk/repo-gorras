const fs = require('fs');

const definitive = JSON.parse(fs.readFileSync('D:/GORROS/scripts/user_urls_definitive.json', 'utf8')).urls;
const dropshopAll = JSON.parse(fs.readFileSync('D:/GORROS/scripts/dropshop_products.json', 'utf8'));

console.log('Definitive products:', definitive.length);

const matchedData = [];

definitive.forEach(d => {
  const prod = dropshopAll.find(p => p.handle === d.handle);
  if (prod) {
    matchedData.push({
      handle: d.handle,
      title: prod.title,
      vendor: d.vendor,
      originalVendor: prod.vendor,
      body_html: prod.body_html,
      images: (prod.images || []).map(img => img.src),
      variants: prod.variants
    });
  } else {
    console.log('Not found in shopify cache:', d.handle);
  }
});

console.log('Successfully found in Shopify dump:', matchedData.length);
console.log('Sample images for first product:', matchedData[0].images);

const totalImages = matchedData.reduce((acc, p) => acc + (p.images ? p.images.length : 0), 0);
console.log('Total images across all 74 products:', totalImages);
