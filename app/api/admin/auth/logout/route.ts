import { NextRequest, NextResponse } from "next/server";
import { clearAdminSessionCookie } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
  const protocol = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const baseUrl = `${protocol}://${host}`;

  const res = NextResponse.redirect(new URL("/login", baseUrl));
  clearAdminSessionCookie(res);
  return res;
}

export async function GET(req: NextRequest) {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
  const protocol = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const baseUrl = `${protocol}://${host}`;

  const res = NextResponse.redirect(new URL("/login", baseUrl));
  clearAdminSessionCookie(res);
  return res;
}
