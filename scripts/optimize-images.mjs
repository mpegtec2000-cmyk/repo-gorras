/**
 * Optimiza las imÃ¡genes de /Imagenes â†’ /public
 * - Hero escritorio: 1920w y 1280w (WebP)
 * - Hero mÃ³vil: 1080w y 720w (WebP)
 * - Productos: 1200w (WebP)
 * - Logo: versiÃ³n negra y blanca (PNG con transparencia) + iconos
 *
 * Uso: node scripts/optimize-images.mjs
 */
import sharp from "sharp";
import { readdir, mkdir } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "Imagenes");
const OUT = path.join(ROOT, "public");

async function ensure(dir) {
  await mkdir(dir, { recursive: true });
}

async function hero(folder, outFolder, widths) {
  const dir = path.join(SRC, folder);
  const files = (await readdir(dir)).filter((f) => /\.(jpe?g|png)$/i.test(f)).sort();
  const outDir = path.join(OUT, "hero", outFolder);
  await ensure(outDir);
  for (const f of files) {
    const n = f.match(/\d+/)?.[0] ?? f;
    for (const w of widths) {
      await sharp(path.join(dir, f))
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: 78 })
        .toFile(path.join(outDir, `fondo-${n}-${w}.webp`));
    }
    console.log(`hero/${outFolder}/fondo-${n}`);
  }
}

async function products() {
  const dir = path.join(SRC, "Productos");
  const outDir = path.join(OUT, "products");
  await ensure(outDir);
  for (const f of (await readdir(dir)).filter((f) => /\.(jpe?g|png)$/i.test(f))) {
    const base = f.replace(/\.[^.]+$/, "").replace(/_/g, "-");
    await sharp(path.join(dir, f))
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(path.join(outDir, `${base}.webp`));
    console.log(`products/${base}.webp`);
  }
}

async function logo() {
  const src = path.join(SRC, "Logo", "LOGO.png");
  const outDir = path.join(OUT, "brand");
  await ensure(outDir);

  // Recorta el espacio en blanco y convierte el blanco en transparencia
  const trimmed = await sharp(src).flatten({ background: "#ffffff" }).trim({ threshold: 20 }).toBuffer();
  const { data, info } = await sharp(trimmed).greyscale().raw().toBuffer({ resolveWithObject: true });

  const black = Buffer.alloc(info.width * info.height * 4);
  const white = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < info.width * info.height; i++) {
    const alpha = 255 - data[i]; // oscuro = opaco
    black.set([0, 0, 0, alpha], i * 4);
    white.set([255, 255, 255, alpha], i * 4);
  }
  const raw = { raw: { width: info.width, height: info.height, channels: 4 } };
  await sharp(black, raw).resize({ width: 900 }).png().toFile(path.join(outDir, "spm-logo-black.png"));
  await sharp(white, raw).resize({ width: 900 }).png().toFile(path.join(outDir, "spm-logo-white.png"));
  console.log(`brand/spm-logo-{black,white}.png (${info.width}x${info.height})`);

  // Iconos: monograma sobre negro
  const mono = await sharp(white, raw)
    .extract({ left: 0, top: 0, width: info.width, height: Math.round(info.height * 0.78) })
    .trim()
    .resize({ width: 400, height: 400, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const monoFor = async (size) =>
    sharp(mono).resize({ width: Math.round(size * 0.78), height: Math.round(size * 0.78), fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();

  for (const [file, size] of [
    ["app/icon.png", 512],
    ["app/apple-icon.png", 180],
    ["public/brand/icon-192.png", 192],
    ["public/brand/icon-512.png", 512],
  ]) {
    await sharp({ create: { width: size, height: size, channels: 4, background: "#0a0a0a" } })
      .composite([{ input: await monoFor(size), gravity: "center" }])
      .png()
      .toFile(path.join(ROOT, file));
    console.log(file);
  }

}

await hero("Escritorio", "desktop", [1920, 1280]);
await hero("Movil", "mobile", [1080, 720]);
await products();
await logo();
console.log("âœ” ImÃ¡genes optimizadas");
