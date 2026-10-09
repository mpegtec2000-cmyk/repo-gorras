const fs = require('fs');

const current = JSON.parse(fs.readFileSync('D:/GORROS/scripts/user_urls.json', 'utf8'));

const dreamerList = [
  {
    title: 'GORRA EL DREAMER HATS JAPO LIFE V2',
    handle: 'gorra-el-dreamer-hats-japo-life-v2',
    url: 'https://drop-shop.mx/products/gorra-el-dreamer-hats-japo-life-v2',
    vendor: 'DREAMER HATS'
  },
  {
    title: 'GORRA EL DREAMER HATS “SILVER CLOVER”',
    handle: 'gorra-el-dreamer-hats-silver-clover',
    url: 'https://drop-shop.mx/products/gorra-el-dreamer-hats-silver-clover',
    vendor: 'DREAMER HATS'
  },
  {
    title: 'GORRA EL DREAMER HATS KOI BLACK',
    handle: 'gorra-el-dreamer-hats-koi-black',
    url: 'https://drop-shop.mx/products/gorra-el-dreamer-hats-koi-black',
    vendor: 'DREAMER HATS'
  },
  {
    title: 'GORRA EL DREAMER HATS KOI OLIVE',
    handle: 'gorra-el-dreamer-hats-koi-olive',
    url: 'https://drop-shop.mx/products/gorra-el-dreamer-hats-koi-olive',
    vendor: 'DREAMER HATS'
  },
  {
    title: 'GORRA EL DREAMER HATS SAGI BLACK',
    handle: 'gorra-el-dreamer-hats-sagi-black',
    url: 'https://drop-shop.mx/products/gorra-el-dreamer-hats-sagi-black',
    vendor: 'DREAMER HATS'
  },
  {
    title: 'GORRA EL DREAMER HATS “NY SOULS”',
    handle: 'gorra-el-dreamer-hats-ny-souls',
    url: 'https://drop-shop.mx/products/gorra-el-dreamer-hats-ny-souls',
    vendor: 'DREAMER HATS'
  }
];

dreamerList.forEach(item => {
  const exists = current.urls.some(u => u.handle === item.handle || u.url.includes(item.handle));
  if (!exists) {
    current.urls.push({
      id: current.urls.length + 1,
      ...item
    });
  }
});

fs.writeFileSync('D:/GORROS/scripts/user_urls.json', JSON.stringify(current, null, 2));
console.log('Total products in database now:', current.urls.length);
