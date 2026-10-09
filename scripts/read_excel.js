const xlsx = require('xlsx');
const path = require('path');

const filePath = path.join('D:', 'GORROS', 'PRODUCTOS', 'BASE DE DATOS.xlsx');
const wb = xlsx.readFile(filePath);

console.log('Sheets in workbook:', wb.SheetNames);

wb.SheetNames.forEach(name => {
  const ws = wb.Sheets[name];
  const data = xlsx.utils.sheet_to_json(ws, { defval: '' });
  console.log('\n========================================');
  console.log(`SHEET: ${name} (Total rows: ${data.length})`);
  console.log('========================================');
  if (data.length > 0) {
    console.log('Columns:', Object.keys(data[0]));
    console.log('All Rows Summary:');
    
    // Aggregate by Brand, Category, etc.
    const summary = {};
    data.forEach((row, i) => {
      console.log(`[${i+1}]`, JSON.stringify(row));
    });
  }
});
