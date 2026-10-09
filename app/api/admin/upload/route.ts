import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

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
    const uploadDir = path.join(process.cwd(), "public", "products");

    await fs.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, fileName);

    await fs.writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      url: `/products/${fileName}`,
      fileName,
    });
  } catch (error: any) {
    console.error("Error al subir imagen:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
