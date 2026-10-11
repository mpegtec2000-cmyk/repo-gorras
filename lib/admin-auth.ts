import { NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "spm_admin_session";
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 horas

function getSecretKey(): string {
  return (
    process.env.ADMIN_JWT_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "spm-streetwear-chile-ultra-secure-admin-salt-key-2026"
  );
}

function base64UrlEncode(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlDecode(str: string): Uint8Array {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Genera un token HMAC-SHA256 firmado con Web Crypto (compatible 100% Edge y Node).
 */
export async function createAdminSessionToken(username: string): Promise<string> {
  const secret = getSecretKey();
  const payloadObj = {
    user: username,
    role: "admin",
    exp: Date.now() + SESSION_DURATION_MS,
  };
  const enc = new TextEncoder();
  const payloadB64 = base64UrlEncode(enc.encode(JSON.stringify(payloadObj)));

  const key = await getHmacKey(secret);
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    enc.encode(payloadB64)
  );
  const signatureB64 = base64UrlEncode(signatureBuffer);

  return `${payloadB64}.${signatureB64}`;
}

/**
 * Valida la firma criptográfica y expiración del token.
 */
export async function verifyAdminSessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token || typeof token !== "string") return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payloadB64, signatureB64] = parts;
  const secret = getSecretKey();

  try {
    const key = await getHmacKey(secret);
    const enc = new TextEncoder();
    const signatureBytes = base64UrlDecode(signatureB64);

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes as unknown as BufferSource,
      enc.encode(payloadB64)
    );

    if (!isValid) return false;

    const dec = new TextDecoder();
    const payloadJson = dec.decode(base64UrlDecode(payloadB64));
    const payload = JSON.parse(payloadJson);

    if (!payload.exp || typeof payload.exp !== "number") return false;
    if (payload.exp < Date.now()) return false;
    if (payload.role !== "admin") return false;

    return true;
  } catch {
    return false;
  }
}

/**
 * Establece la cookie segura HttpOnly en la respuesta HTTP.
 */
export function setAdminSessionCookie(response: NextResponse, token: string): void {
  const isProduction = process.env.NODE_ENV === "production";
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true, // INMUNIDAD A XSS: Inaccesible desde document.cookie
    secure: isProduction, // Sólo por HTTPS en producción
    sameSite: "lax", // Previene CSRF
    path: "/",
    maxAge: Math.floor(SESSION_DURATION_MS / 1000),
  });
}

/**
 * Elimina la cookie de sesión al cerrar sesión.
 */
export function clearAdminSessionCookie(response: NextResponse): void {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  // Eliminar también cookie legacy si existiera
  response.cookies.set({
    name: "spm_session",
    value: "",
    path: "/",
    maxAge: 0,
  });
}

export { AUTH_COOKIE_NAME };
