const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('D:/GORROS/scripts/user_urls.json', 'utf8')).urls;

// Normalize vendor names
const normalized = raw.map(item => {
  let vendor = item.vendor || '';
  const title = item.title || '';
  const handle = (item.handle || item.url.split('/products/')[1] || '').split('?')[0];

  if (handle.includes('buzyone') || handle.includes('31-hats') || title.includes('31 HATS')) {
    vendor = '31 HATS';
  } else if (title.toLowerCase().includes('fame club') || handle.includes('fame-club')) {
    vendor = 'FAME CLUB';
  } else if (vendor.toLowerCase().includes('rebel') || title.toLowerCase().includes('rebel')) {
    vendor = 'REBEL HATS';
  } else if (vendor.toLowerCase().includes('dreamer') || title.toLowerCase().includes('dreamer')) {
    vendor = 'DREAMER HATS';
  } else if (vendor.toLowerCase().includes('barbas') || title.toLowerCase().includes('barbas')) {
    vendor = 'BARBAS HATS';
  } else if (vendor.toLowerCase().includes('cash') || title.toLowerCase().includes('cash')) {
    vendor = 'CASH ONLY';
  }

  return {
    ...item,
    handle,
    url: `https://drop-shop.mx/products/${handle}`,
    vendor
  };
});

// Deduplicate
const uniqueMap = new Map();
normalized.forEach(item => {
  if (!uniqueMap.has(item.handle)) {
    uniqueMap.set(item.handle, item);
  }
});

const list = Array.from(uniqueMap.values());
list.forEach((item, idx) => item.id = idx + 1);

fs.writeFileSync('D:/GORROS/scripts/user_urls_final.json', JSON.stringify({ urls: list }, null, 2));

const byBrand = {};
list.forEach(item => {
  if (!byBrand[item.vendor]) byBrand[item.vendor] = [];
  byBrand[item.vendor].push(item);
});

console.log('=== RECUENTO FINAL ===');
console.log(`TOTAL GENERAL: ${list.length} gorras únicas\n`);
for (const [vendor, prods] of Object.entries(byBrand)) {
  console.log(`- ${vendor}: ${prods.length} gorras`);
}
