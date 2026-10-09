const fs = require('fs');

const data = JSON.parse(fs.readFileSync('D:/GORROS/scripts/user_urls.json', 'utf8')).urls;

// Filter out any mystery box, starter kit, pack or non-single-cap item
const onlyCaps = data.filter(item => {
  const t = (item.title || '').toLowerCase();
  const u = (item.url || '').toLowerCase();
  
  if (t.includes('mystery box') || u.includes('mystery-box')) return false;
  if (t.includes('starter kit') || u.includes('starter-kit')) return false;
  if (t.includes('pass') || u.includes('pass')) return false;
  
  return true;
});

// Re-index IDs
const cleaned = onlyCaps.map((item, idx) => ({
  id: idx + 1,
  ...item
}));

fs.writeFileSync('D:/GORROS/scripts/user_urls.json', JSON.stringify({ urls: cleaned }, null, 2));

console.log('=== LISTADO PURIFICADO: SOLO GORRAS INDIVIDUALES ===');
console.log(`Total gorras individuales: ${cleaned.length}`);

const byBrand = {};
cleaned.forEach(item => {
  if (!byBrand[item.vendor]) byBrand[item.vendor] = [];
  byBrand[item.vendor].push(item);
});

for (const [vendor, prods] of Object.entries(byBrand)) {
  console.log(`\n### ${vendor} (${prods.length} gorras)`);
  prods.forEach((p, i) => {
    console.log(`${i+1}. ${p.title}`);
    console.log(`   ${p.url}`);
  });
}
