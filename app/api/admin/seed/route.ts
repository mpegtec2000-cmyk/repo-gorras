import { NextResponse } from "next/server";
import { buildSeedProducts } from "@/lib/seed-products";
import { saveProduct } from "@/lib/catalog";

export async function POST() {
  try {
    const products = buildSeedProducts();
    let seeded = 0;
    for (const p of products) {
      await saveProduct(p);
      seeded++;
    }
    return NextResponse.json({ success: true, seededCount: seeded });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
