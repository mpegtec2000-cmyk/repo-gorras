const fs = require('fs');
const xlsx = require('xlsx');

const wb = xlsx.readFile('D:/GORROS/PRODUCTOS/BASE DE DATOS.xlsx');
const excelData = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '' });
const excelProducts = excelData.filter(r => r['Marca'] && r['Marca'].trim() !== '');

const shopifyProducts = JSON.parse(fs.readFileSync('D:/GORROS/scripts/dropshop_products.json', 'utf8'));

// Check folders in D:\GORROS\PRODUCTOS to see image names or info
const productDirFiles = fs.readdirSync('D:/GORROS/PRODUCTOS');

console.log('Files/Dirs in D:/GORROS/PRODUCTOS:', productDirFiles);

// Let's check subfolders if any
['DropShop-20261005T234413Z-1-001', 'Gorras-20261005T234408Z-1-001', 'Polas'].forEach(dir => {
  const p = `D:/GORROS/PRODUCTOS/${dir}`;
  if (fs.existsSync(p)) {
    try {
      const list = fs.readdirSync(p);
      console.log(`\nContents of ${dir} (${list.length} items):`, list.slice(0, 10));
    } catch(e){}
  }
});
