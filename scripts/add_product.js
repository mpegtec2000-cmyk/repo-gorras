const fs = require('fs');

function addProduct(url, title, vendor, handle) {
  const current = JSON.parse(fs.readFileSync('D:/GORROS/scripts/user_urls.json', 'utf8'));
  const exists = current.urls.some(u => u.url.includes(handle) || (u.handle && u.handle === handle));
  if (!exists) {
    current.urls.push({
      id: current.urls.length + 1,
      url: url,
      handle: handle,
      title: title,
      vendor: vendor
    });
    fs.writeFileSync('D:/GORROS/scripts/user_urls.json', JSON.stringify(current, null, 2));
  } else {
    console.log('Already exists with handle:', handle);
  }
  console.log('Total products recorded:', current.urls.length);
}

addProduct(
  'https://drop-shop.mx/products/gorra-barbas-hats-x-lonche-wilito-skull-fes?_pos=1&_fid=faeb39fb3&_ss=c',
  'Gorra Barbas Hats x Lonche & Wilito "Skull Fes"',
  'BARBAS HATS',
  'gorra-barbas-hats-x-lonche-wilito-skull-fes'
);
