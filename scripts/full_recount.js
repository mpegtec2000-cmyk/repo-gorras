const fs = require('fs');
const xlsx = require('xlsx');

// 1. Read Excel
const wb = xlsx.readFile('D:/GORROS/PRODUCTOS/BASE DE DATOS.xlsx');
const excelData = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '' });
const excelProducts = excelData.filter(r => r['Marca'] && r['Marca'].trim() !== '');

// 2. Read URLs
const urls = JSON.parse(fs.readFileSync('D:/GORROS/scripts/user_urls.json', 'utf8')).urls;

console.log('========================================================');
console.log(`TOTAL DE PRODUCTOS REGISTRADOS EN URL: ${urls.length}`);
console.log(`TOTAL DE MODELOS EN BASE DE DATOS EXCEL: ${excelProducts.length}`);
console.log('========================================================');

// Group by Brand
const byBrand = {};
urls.forEach(u => {
  const v = u.vendor || 'OTRAS';
  if (!byBrand[v]) byBrand[v] = [];
  byBrand[v].push(u);
});

console.log('\n--- RESUMEN POR MARCAS REGISTRADAS ---');
for (const [vendor, items] of Object.entries(byBrand)) {
  console.log(`• ${vendor}: ${items.length} productos`);
}

console.log('\n--- LISTADO DETALLADO DE TODAS LAS 32 URLs ---');
urls.forEach((u, i) => {
  console.log(`[#${i + 1}] [${u.vendor}] ${u.title}`);
  console.log(`      ${u.url}`);
});
