const fs = require('fs');
const xlsx = require('xlsx');

const wb = xlsx.readFile('D:/GORROS/PRODUCTOS/BASE DE DATOS.xlsx');
const excelData = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '' });
const excelProducts = excelData.filter(r => r['Marca'] && r['Marca'].trim() !== '');

const userUrls = JSON.parse(fs.readFileSync('D:/GORROS/scripts/user_urls.json', 'utf8')).urls;

console.log('--- REVISIÓN DETALLADA 1 A 1 DE TODAS LAS COINCIDENCIAS ---');

userUrls.forEach(u => {
  console.log(`\nURL Drop-Shop: "${u.title}" [${u.vendor}]`);
  
  // Find candidates in Excel for this brand
  const candidates = excelProducts.filter(ep => {
    const brand = ep['Marca'].toLowerCase();
    const vendor = (u.vendor || '').toLowerCase();
    if (vendor.includes('31') && brand.includes('31')) return true;
    if (vendor.includes('barbas') && brand.includes('barbas')) return true;
    if (vendor.includes('rebel') && brand.includes('rebel')) return true;
    return false;
  });

  candidates.forEach(c => {
    console.log(`   -> Fila Excel: "${c['Modelo/color']}" (Stock: ${c['stock actual']})`);
  });
});
