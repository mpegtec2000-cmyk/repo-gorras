import { NextResponse } from "next/server";
import { getRealAnalytics } from "@/lib/analytics-server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const metrics = await getRealAnalytics();
    return NextResponse.json({
      success: true,
      metrics,
    });
  } catch (err: any) {
    console.error("Error en GET /api/admin/flujo:", err);
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
