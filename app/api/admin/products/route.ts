import { NextRequest, NextResponse } from "next/server";
import { getProducts, saveProduct, deleteProduct } from "@/lib/catalog";
import { Product } from "@/lib/products";

export async function GET() {
  const products = await getProducts();
  return NextResponse.json({ success: true, count: products.length, products });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.brand || !body.brandSlug) {
      return NextResponse.json({ success: false, error: "Faltan campos requeridos (nombre, marca)" }, { status: 400 });
    }

    const newProduct: Product = {
      id: body.id || `spm-${Date.now().toString(36)}`,
      slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name: body.name,
      brand: body.brand,
      brandSlug: body.brandSlug,
      seoTitle: body.seoTitle || `Jockey ${body.brand} ${body.name}`,
      seoDescription: body.seoDescription || `Jockey ${body.brand} ${body.name}. Gorra streetwear original en SPM.`,
      price: Number(body.price) || 70000,
      compareAtPrice: body.compareAtPrice ? Number(body.compareAtPrice) : null,
      color: body.color || { name: "Negro", hex: "#0b0b0b" },
      sizes: body.sizes || ["Única · Ajustable"],
      images: body.images || [],
      initialStock: Number(body.initialStock) || Number(body.stock) || 1,
      sold: Number(body.sold) || 0,
      stock: Number(body.stock) ?? 1,
      isNew: Boolean(body.isNew),
      isFeatured: Boolean(body.isFeatured),
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      description: body.description || "",
      specs: body.specs || [
        { label: "Marca", value: body.brand },
        { label: "Talla", value: "Única · Ajustable" },
      ],
      createdAt: body.createdAt || new Date().toISOString(),
    };

    const saved = await saveProduct(newProduct);
    return NextResponse.json({ success: true, product: saved });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "Missing product ID" }, { status: 400 });
    await deleteProduct(id);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
