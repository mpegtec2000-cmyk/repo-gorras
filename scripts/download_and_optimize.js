const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const definitive = JSON.parse(fs.readFileSync('D:/GORROS/scripts/user_urls_definitive.json', 'utf8')).urls;
const dropshopAll = JSON.parse(fs.readFileSync('D:/GORROS/scripts/dropshop_products.json', 'utf8'));

const outputDir = path.join('D:', 'GORROS', 'public', 'products');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function downloadAndOptimize(imageUrl, destFilename) {
  const destPath = path.join(outputDir, destFilename);
  if (fs.existsSync(destPath)) {
    return `/products/${destFilename}`;
  }

  try {
    const res = await fetch(imageUrl);
    if (!res.ok) {
      console.error(`Failed to download ${imageUrl}: ${res.status}`);
      return null;
    }
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Optimize with Sharp:
    // 1000x1000 square, contain fit, clean background, webp 85% quality
    await sharp(buffer)
      .resize(1000, 1000, {
        fit: 'contain',
        background: { r: 245, g: 245, b: 245, alpha: 1 }
      })
      .webp({ quality: 85 })
      .toFile(destPath);

    return `/products/${destFilename}`;
  } catch (err) {
    console.error(`Error processing ${imageUrl}:`, err.message);
    return null;
  }
}

async function processAll() {
  console.log(`Starting image processing for ${definitive.length} products...`);
  const results = [];

  for (let i = 0; i < definitive.length; i++) {
    const d = definitive[i];
    const sp = dropshopAll.find(p => p.handle === d.handle);
    const imagesToDownload = sp && sp.images ? sp.images.map(img => img.src).slice(0, 3) : []; // download up to 3 images per product

    console.log(`[${i + 1}/${definitive.length}] Processing ${d.vendor} - ${d.title} (${imagesToDownload.length} images)...`);

    const localImages = [];
    for (let imgIdx = 0; imgIdx < imagesToDownload.length; imgIdx++) {
      const srcUrl = imagesToDownload[imgIdx];
      const filename = `${d.handle}-${imgIdx + 1}.webp`;
      const localPath = await downloadAndOptimize(srcUrl, filename);
      if (localPath) {
        localImages.push({
          src: localPath,
          alt: `${d.title} - Gorra original ${d.vendor} vista ${imgIdx + 1}`
        });
      }
    }

    results.push({
      ...d,
      body_html: sp ? sp.body_html : '',
      shopifyImages: imagesToDownload,
      localImages: localImages.length > 0 ? localImages : [{ src: '/products/placeholder-cap.webp', alt: d.title }]
    });
  }

  fs.writeFileSync('D:/GORROS/scripts/processed_products.json', JSON.stringify(results, null, 2));
  console.log('\nAll products images downloaded and optimized successfully!');
}

processAll();
