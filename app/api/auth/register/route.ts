import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, rut, phone } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Correo electrónico y contraseña son obligatorios." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = (name || "").trim();
    const cleanRut = (rut || "").trim();
    const cleanPhone = (phone || "").trim();

    const sbAdmin = getServiceSupabase();

    // 1. Crear el usuario pre-confirmado en Supabase Auth usando auth.admin.createUser
    // Con email_confirm: true, Supabase NO envía correo de confirmación y el usuario queda habilitado al instante.
    const { data: userData, error: createError } = await sbAdmin.auth.admin.createUser({
      email: cleanEmail,
      password: password,
      email_confirm: true,
      user_metadata: {
        name: cleanName,
        rut: cleanRut,
        phone: cleanPhone,
      },
    });

    if (createError) {
      const msg = createError.message?.toLowerCase() || "";
      if (msg.includes("already registered") || msg.includes("already exists")) {
        return NextResponse.json(
          { error: "Este correo ya está registrado en SPM Store. Por favor ingresa a 'Acceso Cliente' con tu contraseña." },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: createError.message }, { status: 400 });
    }

    const userId = userData?.user?.id;

    // 2. Guardar permanentemente en la tabla public.profiles
    if (userId) {
      const now = new Date().toISOString();
      try {
        await sbAdmin.from("profiles").upsert(
          {
            id: userId,
            email: cleanEmail,
            name: cleanName,
            rut: cleanRut,
            phone: cleanPhone,
            created_at: now,
            updated_at: now,
          },
          { onConflict: "id" }
        );
      } catch (profErr) {
        console.warn("Aviso al guardar perfil en profiles:", profErr);
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        email: cleanEmail,
        name: cleanName,
        rut: cleanRut,
        phone: cleanPhone,
      },
      message: "Usuario registrado y verificado correctamente sin confirmación de correo.",
    });
  } catch (err: any) {
    console.error("Error en registro:", err);
    return NextResponse.json(
      { error: err?.message || "Error al procesar el registro." },
      { status: 500 }
    );
  }
}
