const fs = require('fs');

const current = JSON.parse(fs.readFileSync('D:/GORROS/scripts/user_urls.json', 'utf8'));
const exists = current.urls.some(u => u.url.includes('gorra-31-hats-page-31'));

if (!exists) {
  current.urls.push({
    id: current.urls.length + 1,
    url: 'https://drop-shop.mx/products/gorra-31-hats-page-31',
    handle: 'gorra-31-hats-page-31',
    title: 'GORRA 31 HATS "PAGE 31"',
    vendor: '31 HATS'
  });
  fs.writeFileSync('D:/GORROS/scripts/user_urls.json', JSON.stringify(current, null, 2));
}

console.log('Total products recorded:', current.urls.length);
