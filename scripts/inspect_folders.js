const fs = require('fs');
const path = require('path');

function inspectFolder(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  const items = fs.readdirSync(dirPath);
  console.log(`\n=== Folder: ${dirPath} (${items.length} items) ===`);
  items.slice(0, 25).forEach(item => console.log(' -', item));
}

inspectFolder('D:/GORROS/PRODUCTOS/DropShop-20261005T234413Z-1-001/DropShop');
inspectFolder('D:/GORROS/PRODUCTOS/Gorras-20261005T234408Z-1-001/Gorras');
