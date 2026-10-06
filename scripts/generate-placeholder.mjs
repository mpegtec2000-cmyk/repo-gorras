import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve("public/products");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const svg = `
<svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="800" fill="#141414"/>
  <rect x="2" y="2" width="796" height="796" fill="none" stroke="#262626" stroke-width="4"/>
  <circle cx="400" cy="350" r="160" fill="#1e1e1e" stroke="#333333" stroke-width="3"/>
  <path d="M280 410 Q400 330 520 410 Q400 480 280 410 Z" fill="#2a2a2a" stroke="#444444" stroke-width="3"/>
  <path d="M 320 350 C 340 250, 460 250, 480 350 Z" fill="#222222" stroke="#444444" stroke-width="3"/>
  <text x="400" y="580" font-family="sans-serif" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="4">SPM STREETWEAR</text>
  <text x="400" y="625" font-family="sans-serif" font-size="18" font-weight="600" fill="#888888" text-anchor="middle" letter-spacing="2">FOTOGRAFÍA EN PROCESO</text>
  <text x="400" y="660" font-family="sans-serif" font-size="14" font-weight="500" fill="#555555" text-anchor="middle">Sube la foto del producto en el SaaS Admin</text>
</svg>
`;

await sharp(Buffer.from(svg))
  .webp({ quality: 90 })
  .toFile(path.join(outDir, "placeholder-cap.webp"));

console.log("Created public/products/placeholder-cap.webp");
