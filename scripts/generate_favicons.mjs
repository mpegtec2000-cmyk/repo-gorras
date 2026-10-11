import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function generateFavicons() {
  const baseIconPath = path.join(process.cwd(), 'app', 'icon.png');
  const publicDir = path.join(process.cwd(), 'public');

  if (!fs.existsSync(baseIconPath)) {
    throw new Error('Base icon not found at app/icon.png');
  }

  console.log('Reading base icon from', baseIconPath);

  // 1. Generate PNGs in all standard sizes required by Google, Apple, and Browsers
  const sizes = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'favicon-48x48.png', size: 48 }, // GOOGLE SEARCH PREFERRED
    { name: 'favicon.png', size: 48 },
    { name: 'icon-96x96.png', size: 96 },   // Google multiple of 48
    { name: 'icon-144x144.png', size: 144 }, // Google multiple of 48
    { name: 'icon-192x192.png', size: 192 }, // Google / PWA multiple of 48
    { name: 'apple-touch-icon.png', size: 180 }, // iOS
    { name: 'icon-512x512.png', size: 512 }, // PWA High-Res
  ];

  const pngBuffers = {};

  for (const { name, size } of sizes) {
    const dest = path.join(publicDir, name);
    const buf = await sharp(baseIconPath)
      .resize(size, size, { fit: 'contain', background: { r: 9, g: 9, b: 9, alpha: 1 } })
      .png({ compressionLevel: 9 })
      .toBuffer();
    fs.writeFileSync(dest, buf);
    pngBuffers[size] = buf;
    console.log(`Generated public/${name} (${size}x${size})`);
  }

  // Also update public/brand/icon-192.png and public/brand/icon-512.png
  fs.writeFileSync(path.join(publicDir, 'brand', 'icon-192.png'), pngBuffers[192]);
  fs.writeFileSync(path.join(publicDir, 'brand', 'icon-512.png'), pngBuffers[512]);
  console.log('Updated public/brand/icon-192.png and public/brand/icon-512.png');

  // 2. Generate a valid multi-image Windows/Google favicon.ico (16, 32, 48)
  const icoSizes = [16, 32, 48];
  const images = icoSizes.map(s => ({ size: s, buf: pngBuffers[s] }));

  // Header: 6 bytes
  // 0-1: 0 (reserved)
  // 2-3: 1 (type: icon)
  // 4-5: count (3)
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  // Directory entries: 16 bytes each
  const dirEntries = [];
  let currentOffset = 6 + images.length * 16;

  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.size, 0); // width
    entry.writeUInt8(img.size, 1); // height
    entry.writeUInt8(0, 2);        // colors
    entry.writeUInt8(0, 3);        // reserved
    entry.writeUInt16LE(1, 4);     // planes
    entry.writeUInt16LE(32, 6);    // bpp
    entry.writeUInt32LE(img.buf.length, 8);  // size
    entry.writeUInt32LE(currentOffset, 12); // offset
    dirEntries.push(entry);
    currentOffset += img.buf.length;
  }

  const icoBuffer = Buffer.concat([header, ...dirEntries, ...images.map(img => img.buf)]);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  console.log(`Generated public/favicon.ico with sizes [16, 32, 48] (total ${icoBuffer.length} bytes)`);

  // Also create app/favicon.ico so Next.js App Router recognizes it natively if requested
  fs.writeFileSync(path.join(process.cwd(), 'app', 'favicon.ico'), icoBuffer);
  console.log('Created app/favicon.ico');
}

generateFavicons().catch(err => {
  console.error(err);
  process.exit(1);
});
