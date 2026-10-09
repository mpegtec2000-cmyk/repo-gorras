const fs = require('fs');
const xlsx = require('xlsx');

// Read Excel
const wb = xlsx.readFile('D:/GORROS/PRODUCTOS/BASE DE DATOS.xlsx');
const excelData = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '' });
const excelProducts = excelData.filter(r => r['Marca'] && r['Marca'].trim() !== '');

// Read URLs
const userUrls = JSON.parse(fs.readFileSync('D:/GORROS/scripts/user_urls.json', 'utf8')).urls;

console.log('Total URLs recorded:', userUrls.length);
console.log('Total Excel products:', excelProducts.length);

function normalize(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const detailedMatches = [];

excelProducts.forEach((ep, idx) => {
  const rowNum = idx + 1;
  const brand = ep['Marca'].trim();
  const model = ep['Modelo/color'].trim();
  const stock = ep['stock actual'];
  
  const bNorm = normalize(brand);
  const mNorm = normalize(model);
  const modelWords = mNorm.split(' ').filter(w => w.length > 2);

  // Compare against all 26 URLs
  let best = null;
  let maxScore = 0;

  userUrls.forEach(u => {
    const uTitleNorm = normalize(u.title);
    const uVendorNorm = normalize(u.vendor);
    const uHandleNorm = normalize(u.handle);

    // Brand matching
    let brandMatch = false;
    if (bNorm.includes('31') || bNorm.includes('thirty')) {
      brandMatch = uVendorNorm.includes('31') || uTitleNorm.includes('31') || uTitleNorm.includes('thirty');
    } else if (bNorm.includes('barbas')) {
      brandMatch = uVendorNorm.includes('barbas') || uTitleNorm.includes('barbas');
    } else if (bNorm.includes('rebel')) {
      brandMatch = uVendorNorm.includes('rebel') || uTitleNorm.includes('rebel');
    } else if (bNorm.includes('inedit')) {
      brandMatch = uVendorNorm.includes('inedit') || uVendorNorm.includes('innedit');
    } else if (bNorm.includes('cash')) {
      brandMatch = uVendorNorm.includes('cash') || uTitleNorm.includes('cash');
    }

    if (!brandMatch) return;

    let matchCount = 0;
    modelWords.forEach(w => {
      if (uTitleNorm.includes(w) || uHandleNorm.includes(w)) matchCount++;
    });

    const score = modelWords.length > 0 ? (matchCount / modelWords.length) : 0;
    if (score > maxScore) {
      maxScore = score;
      best = u;
    }
  });

  detailedMatches.push({
    rowNum,
    brand,
    model,
    stock,
    bestUrl: best,
    score: Math.round(maxScore * 100)
  });
});

console.log('\n=== EXACT & HIGH RELEVANCE MATCHES ===');
const found = detailedMatches.filter(m => m.score >= 30 || (m.bestUrl && m.score > 0));
found.forEach(f => {
  console.log(`[Fila #${f.rowNum}] ${f.brand} - "${f.model}" (Stock: ${f.stock})`);
  console.log(`  -> Drop-Shop URL: ${f.bestUrl.title} (${f.bestUrl.url})`);
  console.log(`  -> Match Score: ${f.score}%\n`);
});
