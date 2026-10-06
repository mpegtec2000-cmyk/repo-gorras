import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const alt = (formData.get("alt") as string) || "Gorra SPM Streetwear";
    const brand = (formData.get("brand") as string) || "SPM";

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert to optimized WebP image with sharp
    const fileName = `product-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.webp`;
    const webpBuffer = await sharp(buffer)
      .resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();

    // 1. Save locally to public/uploads/
    const publicDir = path.resolve(process.cwd(), "public/uploads");
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
    fs.writeFileSync(path.join(publicDir, fileName), webpBuffer);

    let finalUrl = `/uploads/${fileName}`;

    // 2. Try upload to Supabase Storage bucket 'product-images' if configured
    try {
      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(fileName, webpBuffer, { contentType: "image/webp", upsert: true });

      if (!error && data) {
        const { data: pubUrl } = supabase.storage.from("product-images").getPublicUrl(fileName);
        if (pubUrl?.publicUrl) {
          finalUrl = pubUrl.publicUrl;
        }
      }
    } catch (e) {
      console.warn("Supabase upload warning (falling back to local URL):", e);
    }

    return NextResponse.json({
      success: true,
      image: {
        src: finalUrl,
        alt: `${brand} ${alt} - Gorra Streetwear Original`,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
