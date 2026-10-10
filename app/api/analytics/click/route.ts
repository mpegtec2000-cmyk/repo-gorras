import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ success: false, error: "Missing productId" }, { status: 400 });
    }

    const sb = getServiceSupabase();

    // 1. Registrar evento en analytics_events
    try {
      await sb.from("analytics_events").insert({
        event_type: "product_view",
        product_id: productId,
        url: req.headers.get("referer") || "",
        metadata: {
          ip: req.headers.get("x-forwarded-for") || "",
          ua: req.headers.get("user-agent") || "",
        },
      });
    } catch {}

    // 2. Incrementar contador de clics en products usando rpc o fetch+update
    try {
      const { data } = await sb.from("products").select("clicks").eq("id", productId).single();
      const newClicks = ((data?.clicks) || 0) + 1;
      await sb.from("products").update({ clicks: newClicks }).eq("id", productId);
    } catch {}

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
