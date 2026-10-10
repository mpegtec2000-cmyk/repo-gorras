import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { eventType = "page_view", productId, url, visitorId, metadata = {} } = body;

    const sb = getServiceSupabase();

    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("x-real-ip") || "anonymous";
    const userAgent = req.headers.get("user-agent") || "";
    const referer = req.headers.get("referer") || "";

    const enrichedMeta = {
      ...metadata,
      visitorId: visitorId || clientIp,
      ip: clientIp,
      ua: userAgent,
      referer: referer,
      timestamp: new Date().toISOString(),
    };

    // 1. Guardar evento en analytics_events
    await sb.from("analytics_events").insert({
      event_type: eventType,
      product_id: productId || null,
      url: url || referer,
      metadata: enrichedMeta,
    });

    // 2. Si es una vista o clic de producto, incrementar clicks en la tabla products
    if (productId && (eventType === "product_view" || eventType === "click")) {
      try {
        const { data: prod } = await sb.from("products").select("clicks").eq("id", productId).single();
        const newClicks = ((prod?.clicks) || 0) + 1;
        await sb.from("products").update({ clicks: newClicks }).eq("id", productId);
      } catch (e) {
        // Ignorar error no crítico
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
