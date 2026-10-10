import { NextResponse } from "next/server";
import { getProducts, mapToDb } from "@/lib/catalog";
import { getServiceSupabase } from "@/lib/supabase";

export async function POST() {
  try {
    const products = await getProducts();
    const sb = getServiceSupabase();

    const payload = products.map(mapToDb);

    const { data, error } = await sb.from("products").upsert(payload, { onConflict: "id" });

    if (error) {
      console.error("Error syncing products to Supabase:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Se sincronizaron exitosamente ${products.length} productos con la base de datos Supabase.`,
      count: products.length,
    });
  } catch (e: any) {
    console.error("Exception in sync endpoint:", e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
