const fs = require('fs');

const missing10 = [
  {
    title: 'GORRA 31 HATS "LA THORNS"',
    handle: 'gorra-31-hats-la-thorns',
    url: 'https://drop-shop.mx/products/gorra-31-hats-la-thorns',
    vendor: '31 HATS'
  },
  {
    title: 'GORRA 31 HATS "31 FOREVER BLACK"',
    handle: 'gorra-31-hats-31-forever-black-preventa',
    url: 'https://drop-shop.mx/products/gorra-31-hats-31-forever-black-preventa',
    vendor: '31 HATS'
  },
  {
    title: 'Gorra 31 hats x Benavidez "31-0"',
    handle: 'gorra-31-hats-31-0',
    url: 'https://drop-shop.mx/products/gorra-31-hats-31-0',
    vendor: '31 HATS'
  },
  {
    title: 'GORRA 31 HATS "THIRTY ONE GELATO"',
    handle: 'gorra-31-hats-thirty-one-gelato-preventa',
    url: 'https://drop-shop.mx/products/gorra-31-hats-thirty-one-gelato-preventa',
    vendor: '31 HATS'
  },
  {
    title: 'GORRA 31 HATS "FADE TO BLACK"',
    handle: 'gorra-31-hats-fade-to-black',
    url: 'https://drop-shop.mx/products/gorra-31-hats-fade-to-black',
    vendor: '31 HATS'
  },
  {
    title: 'Gorra 31 hats x Benavidez "DB31"',
    handle: 'gorra-31-hats-x-benavidez-db31-preventa',
    url: 'https://drop-shop.mx/products/gorra-31-hats-x-benavidez-db31-preventa',
    vendor: '31 HATS'
  },
  {
    title: 'GORRA 31 HATS "LA MOCHILA"',
    handle: 'gorra-31-hats-la-mochila-preventa',
    url: 'https://drop-shop.mx/products/gorra-31-hats-la-mochila-preventa',
    vendor: '31 HATS'
  },
  {
    title: 'GORRA 31 HATS "WORLD CHAMPIONS" 2025',
    handle: 'gorra-31-hats-world-champions-2025',
    url: 'https://drop-shop.mx/products/gorra-31-hats-world-champions-2025',
    vendor: '31 HATS'
  },
  {
    title: 'GORRA 31 HATS "31 VAMP"',
    handle: 'gorra-31-hats-31-vamp',
    url: 'https://drop-shop.mx/products/gorra-31-hats-31-vamp',
    vendor: '31 HATS'
  },
  {
    title: 'Gorra 31 hats x Benavidez "AND STILL"',
    handle: 'gorra-31-hats-x-benavidez-and-still',
    url: 'https://drop-shop.mx/products/gorra-31-hats-x-benavidez-and-still',
    vendor: '31 HATS'
  }
];

const current = JSON.parse(fs.readFileSync('D:/GORROS/scripts/user_urls_final.json', 'utf8')).urls;

missing10.forEach(item => {
  const exists = current.some(u => u.handle === item.handle);
  if (!exists) {
    current.push(item);
  }
});

// Clean up IDs and deduplicate
const uniqueMap = new Map();
current.forEach(item => {
  let vendor = item.vendor || '';
  const title = item.title || '';
  const handle = item.handle || '';

  if (vendor.includes('31') || title.includes('31') || handle.includes('31')) {
    vendor = '31 HATS';
  } else if (vendor.includes('FAME') || title.includes('Fame')) {
    vendor = 'FAME CLUB';
  } else if (vendor.includes('REBEL') || title.includes('Rebel') || handle.includes('rebel')) {
    vendor = 'REBEL HATS';
  } else if (vendor.includes('DREAMER') || title.includes('DREAMER') || handle.includes('dreamer')) {
    vendor = 'DREAMER HATS';
  } else if (vendor.includes('BARBAS') || title.includes('Barbas') || handle.includes('barbas')) {
    vendor = 'BARBAS HATS';
  } else if (vendor.includes('CASH') || title.includes('CASH') || handle.includes('cash')) {
    vendor = 'CASH ONLY';
  }

  if (!uniqueMap.has(handle)) {
    uniqueMap.set(handle, {
      ...item,
      vendor,
      url: `https://drop-shop.mx/products/${handle}`
    });
  }
});

const finalList = Array.from(uniqueMap.values());
finalList.forEach((item, idx) => item.id = idx + 1);

fs.writeFileSync('D:/GORROS/scripts/user_urls_definitive.json', JSON.stringify({ urls: finalList }, null, 2));

const byBrand = {};
finalList.forEach(item => {
  if (!byBrand[item.vendor]) byBrand[item.vendor] = [];
  byBrand[item.vendor].push(item);
});

console.log('=== RECUENTO FINAL DEFINITIVO ===');
console.log(`TOTAL GENERAL: ${finalList.length} gorras individuales únicas\n`);
for (const [vendor, prods] of Object.entries(byBrand)) {
  console.log(`- ${vendor}: ${prods.length} gorras`);
}
