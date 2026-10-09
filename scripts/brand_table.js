const fs = require('fs');
const xlsx = require('xlsx');

const wb = xlsx.readFile('D:/GORROS/PRODUCTOS/BASE DE DATOS.xlsx');
const excelData = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '' });
const excelProducts = excelData.filter(r => r['Marca'] && r['Marca'].trim() !== '');

const shopifyProducts = JSON.parse(fs.readFileSync('D:/GORROS/scripts/dropshop_products.json', 'utf8'));

console.log('Total Drop-Shop products in catalog:', shopifyProducts.length);

function norm(s) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

// Check how many brands from Excel are present on Drop-Shop
const brandStatus = {};
excelProducts.forEach(p => {
  const brand = p['Marca'].trim();
  if (!brandStatus[brand]) {
    brandStatus[brand] = {
      excelCount: 0,
      matchingShopifyProducts: []
    };
  }
  brandStatus[brand].excelCount++;
});

Object.keys(brandStatus).forEach(brand => {
  const brandNorm = norm(brand).replace(/\s+/g, ' ');
  // Look in shopify
  const matches = shopifyProducts.filter(sp => {
    const vNorm = norm(sp.vendor);
    const tNorm = norm(sp.title);
    if (brandNorm.includes('31') || brandNorm.includes('thirty')) {
      return vNorm.includes('31') || tNorm.includes('31') || vNorm.includes('thirty') || tNorm.includes('thirty');
    }
    if (brandNorm.includes('inedit')) {
      return vNorm.includes('inedit') || vNorm.includes('innedit') || tNorm.includes('inedit') || tNorm.includes('innedit');
    }
    if (brandNorm.includes('cash')) {
      return vNorm.includes('cash') || tNorm.includes('cash');
    }
    if (brandNorm.includes('dreamer')) {
      return vNorm.includes('dreamer') || tNorm.includes('dreamer');
    }
    if (brandNorm.includes('rebel')) {
      return vNorm.includes('rebel') || tNorm.includes('rebel');
    }
    if (brandNorm.includes('fame')) {
      return vNorm.includes('fame') || tNorm.includes('fame');
    }
    if (brandNorm.includes('barbas')) {
      return vNorm.includes('barbas') || tNorm.includes('barbas');
    }
    if (brandNorm.includes('icon')) {
      return vNorm.includes('icon') || tNorm.includes('icon');
    }
    if (brandNorm.includes('anymore')) {
      return vNorm.includes('anymore') || tNorm.includes('anymore');
    }
    return false;
  });
  brandStatus[brand].shopifyCount = matches.length;
  brandStatus[brand].sampleShopify = matches.slice(0, 3).map(m => m.title);
});

console.log('Brand breakdown:');
console.table(Object.entries(brandStatus).map(([b, info]) => ({
  Marca: b,
  'En Excel': info.excelCount,
  'En Drop-Shop (Catálogo)': info.shopifyCount,
  'Ejemplos en Drop-Shop': info.sampleShopify.join(', ')
})));
