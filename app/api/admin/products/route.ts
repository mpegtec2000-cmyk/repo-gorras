import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getProducts, getProduct, saveProduct, updateProductPartial, deleteProduct } from "@/lib/catalog";
import { Product } from "@/lib/products";

export async function GET() {
  const products = await getProducts();
  return NextResponse.json({ success: true, count: products.length, products });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.brand) {
      return NextResponse.json({ success: false, error: "Faltan campos requeridos (nombre, marca)" }, { status: 400 });
    }

    const brandSlug = body.brandSlug || body.brand.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const existing = body.id ? await getProduct(body.id) : null;

    const newProduct: Product = {
      id: body.id || (existing ? existing.id : `spm-${Date.now().toString(36)}`),
      slug: body.slug || (existing ? existing.slug : body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")),
      name: body.name,
      brand: body.brand,
      brandSlug: brandSlug,
      seoTitle: body.seoTitle || (existing ? existing.seoTitle : `Jockey ${body.brand} ${body.name}`),
      seoDescription: body.seoDescription || (existing ? existing.seoDescription : `Jockey ${body.brand} ${body.name}. Gorra streetwear original en SPM.`),
      price: body.price !== undefined ? Number(body.price) : (existing ? existing.price : 70000),
      compareAtPrice: body.compareAtPrice !== undefined ? (body.compareAtPrice ? Number(body.compareAtPrice) : null) : (existing ? existing.compareAtPrice : null),
      color: body.color || (existing ? existing.color : { name: "Negro", hex: "#0b0b0b" }),
      sizes: body.sizes || (existing ? existing.sizes : ["Única · Ajustable"]),
      images: (body.images && body.images.length > 0) ? body.images : (existing ? existing.images : []),
      initialStock: body.initialStock !== undefined ? Number(body.initialStock) : (existing ? existing.initialStock : Number(body.stock) || 1),
      sold: body.sold !== undefined ? Number(body.sold) : (existing ? existing.sold : 0),
      stock: body.stock !== undefined ? Number(body.stock) : (existing ? existing.stock : 1),
      isNew: body.isNew !== undefined ? Boolean(body.isNew) : (existing ? existing.isNew : false),
      isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : (existing ? existing.isFeatured : false),
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : (existing ? existing.isActive : true),
      description: body.description !== undefined ? body.description : (existing ? existing.description : ""),
      specs: body.specs || (existing ? existing.specs : [
        { label: "Marca", value: body.brand },
        { label: "Talla", value: "Única · Ajustable" },
      ]),
      createdAt: (existing && existing.createdAt) || body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = await saveProduct(newProduct);

    // Invalidar caché de las rutas de la tienda y producto
    try {
      revalidatePath("/tienda");
      revalidatePath("/");
      revalidatePath("/drops");
      revalidatePath(`/producto/${saved.slug}`);
      revalidatePath("/admin/productos");
      revalidatePath("/admin/inventario");
    } catch {}

    return NextResponse.json({ success: true, product: saved });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Falta el ID del producto" }, { status: 400 });
    }

    const updated = await updateProductPartial(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Producto no encontrado" }, { status: 404 });
    }

    try {
      revalidatePath("/tienda");
      revalidatePath("/");
      revalidatePath("/drops");
      revalidatePath(`/producto/${updated.slug}`);
      revalidatePath("/admin/productos");
      revalidatePath("/admin/inventario");
    } catch {}

    return NextResponse.json({ success: true, product: updated });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "Missing product ID" }, { status: 400 });
    const deleted = await deleteProduct(id);

    try {
      revalidatePath("/tienda");
      revalidatePath("/");
      revalidatePath("/drops");
      revalidatePath("/admin/productos");
      revalidatePath("/admin/inventario");
    } catch {}

    return NextResponse.json({ success: deleted });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
