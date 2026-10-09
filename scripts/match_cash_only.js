const fs = require('fs');
const xlsx = require('xlsx');

const wb = xlsx.readFile('D:/GORROS/PRODUCTOS/BASE DE DATOS.xlsx');
const excelData = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '' });
const excelProducts = excelData.filter(r => r['Marca'] && r['Marca'].trim() !== '');

const raw = JSON.parse(fs.readFileSync('D:/GORROS/scripts/user_urls.json', 'utf8')).urls;

console.log('=== CRUCE EXCEL VS CASH ONLY ===');
const cashExcel = excelProducts.filter(p => p['Marca'].toLowerCase().includes('cash'));
const cashUrls = raw.filter(u => u.vendor === 'CASH ONLY');

cashExcel.forEach(ce => {
  console.log(`Excel: "${ce['Modelo/color']}" (Stock: ${ce['stock actual']})`);
  cashUrls.forEach(cu => {
    if (
      (ce['Modelo/color'].includes('flores') && cu.title.includes('FLOWERS')) ||
      (ce['Modelo/color'].includes('rockstar') && cu.title.includes('ROCKSTAR')) ||
      (ce['Modelo/color'].includes('cruces') && cu.title.includes('CROSS')) ||
      (ce['Modelo/color'].includes('perrlas') && cu.title.includes('PEARLS')) ||
      (ce['Modelo/color'].includes('celeste desgast') && cu.title.includes('BLUE DENIM')) ||
      (ce['Modelo/color'].includes('NYC') && cu.title.includes('NEW YORK'))
    ) {
      console.log(`  -> MATCH CON: ${cu.title} (${cu.url})`);
    }
  });
});
