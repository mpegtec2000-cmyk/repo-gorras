const fs = require('fs');
const xlsx = require('xlsx');

// 1. Read Excel
const wb = xlsx.readFile('D:/GORROS/PRODUCTOS/BASE DE DATOS.xlsx');
const excelData = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '' });
const excelProducts = excelData.filter(r => r['Marca'] && r['Marca'].trim() !== '');

// 2. Read Shopify products
const shopifyProducts = JSON.parse(fs.readFileSync('D:/GORROS/scripts/dropshop_products.json', 'utf8'));

console.log(`Excel products count: ${excelProducts.length}`);
console.log(`Drop-shop total products count: ${shopifyProducts.length}`);

// Unique vendors in Drop-shop
const vendors = new Set(shopifyProducts.map(p => p.vendor ? p.vendor.trim() : ''));
console.log('\nDrop-shop Vendors count:', vendors.size);
console.log('Sample Vendors:', Array.from(vendors).slice(0, 30));

// Compare each Excel product
console.log('\n--- MATCHING ANALYSIS ---');

function normalize(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const results = [];

excelProducts.forEach((item, idx) => {
  const brand = (item['Marca'] || '').trim();
  const model = (item['Modelo/color'] || '').trim();
  const brandNorm = normalize(brand);
  const modelNorm = normalize(model);
  
  // Find vendor matches
  const vendorMatches = shopifyProducts.filter(p => {
    const vNorm = normalize(p.vendor);
    const titleNorm = normalize(p.title);
    return vNorm.includes(brandNorm) || brandNorm.includes(vNorm) || titleNorm.includes(brandNorm);
  });

  // Score each product in shopify
  const modelWords = modelNorm.split(' ').filter(w => w.length > 2);
  
  let bestMatch = null;
  let highestScore = 0;

  const candidatePool = vendorMatches.length > 0 ? vendorMatches : shopifyProducts;

  candidatePool.forEach(sp => {
    const titleNorm = normalize(sp.title);
    const handleNorm = normalize(sp.handle);
    const bodyNorm = normalize(sp.body_html || '');
    
    let matchedWords = 0;
    modelWords.forEach(w => {
      if (titleNorm.includes(w) || handleNorm.includes(w) || bodyNorm.includes(w)) {
        matchedWords++;
      }
    });

    const score = modelWords.length > 0 ? (matchedWords / modelWords.length) : 0;
    if (score > highestScore) {
      highestScore = score;
      bestMatch = {
        title: sp.title,
        vendor: sp.vendor,
        handle: sp.handle,
        url: `https://drop-shop.mx/products/${sp.handle}`,
        score: Math.round(score * 100)
      };
    }
  });

  results.push({
    index: idx + 1,
    brand,
    model,
    stock_actual: item['stock actual'],
    vendorMatchCount: vendorMatches.length,
    bestMatch,
    highestScore: Math.round(highestScore * 100)
  });
});

fs.writeFileSync('D:/GORROS/scripts/match_results.json', JSON.stringify(results, null, 2));

console.log('\n--- SUMMARY STATS ---');
const highMatch = results.filter(r => r.highestScore >= 70);
const midMatch = results.filter(r => r.highestScore >= 40 && r.highestScore < 70);
const lowMatch = results.filter(r => r.highestScore < 40);

console.log(`High confidence matches (>=70%): ${highMatch.length}`);
console.log(`Medium confidence matches (40-69%): ${midMatch.length}`);
console.log(`Low / No match (<40%): ${lowMatch.length}`);

console.log('\nDetailed list:');
results.forEach(r => {
  console.log(`[#${r.index}] ${r.brand} - ${r.model}`);
  console.log(`     Match (${r.highestScore}%): ${r.bestMatch ? `${r.bestMatch.vendor} | ${r.bestMatch.title} (${r.bestMatch.url})` : 'None'}`);
});
