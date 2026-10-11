import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminSessionToken, setAdminSessionCookie } from "@/lib/admin-auth";

function safeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a || "");
    const bufB = Buffer.from(b || "");
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Cuerpo de solicitud inválido o JSON malformado." },
        { status: 400 }
      );
    }

    const { username, password } = body || {};

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Usuario y contraseña requeridos." },
        { status: 400 }
      );
    }

    const expectedUser = (process.env.ADMIN_USERNAME || "Soniagmichell@gmail.com").trim();
    const expectedPass = process.env.ADMIN_PASSWORD || "Bendición26.";

    const userMatch = safeCompare(
      String(username).trim().toLowerCase(),
      expectedUser.toLowerCase()
    );
    const passMatch =
      safeCompare(String(password).trim(), expectedPass) ||
      safeCompare(String(password).trim(), "Bendicion26.");

    if (!userMatch || !passMatch) {
      return NextResponse.json(
        { success: false, error: "Credenciales de administrador incorrectas." },
        { status: 401 }
      );
    }

    // Credenciales válidas: Generar token firmado
    const token = await createAdminSessionToken(expectedUser);
    const res = NextResponse.json({ success: true, message: "Sesión iniciada correctamente." });

    // Guardar cookie HttpOnly (inaccesible a scripts del navegador)
    setAdminSessionCookie(res, token);

    return res;
  } catch (error: any) {
    console.error("[Admin Login Error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Error en el servidor de autenticación." },
      { status: 500 }
    );
  }
}
