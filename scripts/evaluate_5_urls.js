const fs = require('fs');
const xlsx = require('xlsx');

const wb = xlsx.readFile('D:/GORROS/PRODUCTOS/BASE DE DATOS.xlsx');
const excelData = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '' });
const excelProducts = excelData.filter(r => r['Marca'] && r['Marca'].trim() !== '');

const userUrls = JSON.parse(fs.readFileSync('D:/GORROS/scripts/user_urls.json', 'utf8')).urls;

console.log('--- RECUENTO DE LAS 5 URLs INGRESADAS VS EXCEL ---');

userUrls.forEach(u => {
  console.log(`\nURL #${u.id}: ${u.title || u.url}`);
  console.log(`Marca detectada: ${u.vendor}`);
  console.log(`Enlace: ${u.url}`);
  
  // Cross reference with Excel
  const matchesInExcel = excelProducts.filter(ep => {
    const brand = (ep['Marca'] || '').toLowerCase();
    const model = (ep['Modelo/color'] || '').toLowerCase();
    const targetBrand = (u.vendor || '').toLowerCase();
    const title = (u.title || '').toLowerCase();

    // Check brand matching
    const brandMatch = brand.includes('barbas') && targetBrand.includes('barbas') ||
                       brand.includes('31') && targetBrand.includes('31') ||
                       brand.includes('rebel') && targetBrand.includes('rebel');
    return brandMatch;
  });

  console.log(`Modelos de esta marca en tu Excel (${matchesInExcel.length}):`);
  matchesInExcel.forEach(m => {
    console.log(` - [Fila] Marca: "${m['Marca']}" | Modelo: "${m['Modelo/color']}" | Stock Actual: ${m['stock actual']}`);
  });
});
