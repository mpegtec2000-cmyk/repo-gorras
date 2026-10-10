import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const customName = (formData.get("name") as string) || "gorra-spm";

    if (!file) {
      return NextResponse.json({ success: false, error: "No se proporcionó ningún archivo de imagen." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitizar nombre de archivo
    const safeName = customName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const timestamp = Date.now().toString(36);
    const fileName = `${safeName}-${timestamp}.webp`;

    // 1. Intentar subir primero a Supabase Storage (ideal para producción en Vercel)
    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, buffer, {
          contentType: file.type || "image/webp",
          upsert: true,
        });

      if (!uploadError && uploadData) {
        const { data: publicUrlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);

        if (publicUrlData?.publicUrl) {
          return NextResponse.json({
            success: true,
            url: publicUrlData.publicUrl,
            fileName,
          });
        }
      }
    } catch {
      // Continuar con fallback local
    }

    // 2. Fallback: Guardar en disco local si el entorno lo permite (desarrollo / servidor persistente)
    try {
      const uploadDir = path.join(process.cwd(), "public", "products");
      await fs.mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, fileName);
      await fs.writeFile(filePath, buffer);

      return NextResponse.json({
        success: true,
        url: `/products/${fileName}`,
        fileName,
      });
    } catch {
      // 3. Fallback de emergencia si el sistema de archivos es de solo lectura (Data URI)
      const mime = file.type || "image/webp";
      const base64 = buffer.toString("base64");
      return NextResponse.json({
        success: true,
        url: `data:${mime};base64,${base64}`,
        fileName,
      });
    }
  } catch (error: any) {
    console.error("Error al subir imagen:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
