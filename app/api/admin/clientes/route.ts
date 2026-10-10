import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sb = getServiceSupabase();
    const { data, error } = await sb
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching profiles:", error);
      return NextResponse.json({ error: error.message, clients: [] }, { status: 500 });
    }

    return NextResponse.json({ clients: data || [] });
  } catch (err: any) {
    console.error("Error in /api/admin/clientes:", err);
    return NextResponse.json({ error: err.message, clients: [] }, { status: 500 });
  }
}
