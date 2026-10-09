const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('D:/GORROS/scripts/user_urls.json', 'utf8')).urls;

// Normalize vendor names
const normalized = raw.map(item => {
  let vendor = item.vendor || '';
  const title = item.title || '';
  const url = item.url || '';

  if (vendor.toLowerCase().includes('31') || title.toLowerCase().includes('31')) {
    vendor = '31 HATS';
  } else if (vendor.toLowerCase().includes('rebel') || title.toLowerCase().includes('rebel')) {
    vendor = 'REBEL HATS';
  } else if (vendor.toLowerCase().includes('dreamer') || title.toLowerCase().includes('dreamer')) {
    vendor = 'DREAMER HATS';
  } else if (vendor.toLowerCase().includes('barbas') || title.toLowerCase().includes('barbas')) {
    vendor = 'BARBAS HATS';
  }

  return {
    ...item,
    vendor
  };
});

fs.writeFileSync('D:/GORROS/scripts/user_urls.json', JSON.stringify({ urls: normalized }, null, 2));

console.log('=== LISTADO LIMPIO Y AGRUPADO ===');
const groups = {};
normalized.forEach(item => {
  if (!groups[item.vendor]) groups[item.vendor] = [];
  groups[item.vendor].push(item);
});

for (const [vendor, prods] of Object.entries(groups)) {
  console.log(`\n### ${vendor} (${prods.length} productos)`);
  prods.forEach((p, i) => {
    console.log(`${i+1}. **${p.title}**`);
    console.log(`   ${p.url}`);
  });
}
