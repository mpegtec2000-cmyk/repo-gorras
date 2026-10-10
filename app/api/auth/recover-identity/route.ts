import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function cleanRut(rut: string): string {
  return (rut || "").replace(/[^0-9kK]/g, "").toUpperCase();
}

function cleanName(name: string): string {
  return (name || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, email, rut, name, newPassword } = body;

    const cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail) {
      return NextResponse.json({ error: "El correo electrónico es requerido." }, { status: 400 });
    }

    const sbAdmin = getServiceSupabase();

    // 1. Buscar perfil del usuario
    const { data: profile, error: profError } = await sbAdmin
      .from("profiles")
      .select("id, email, rut, name")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (profError || !profile) {
      return NextResponse.json(
        { error: "No encontramos ninguna cuenta registrada con este correo electrónico." },
        { status: 404 }
      );
    }

    // PASO 1: Verificar correo
    if (action === "verify_email") {
      return NextResponse.json({
        success: true,
        message: "Correo verificado.",
        nextStep: 2,
      });
    }

    // PASO 2: Verificar RUT
    if (action === "verify_rut") {
      const inputRut = cleanRut(rut);
      const savedRut = cleanRut(profile.rut);

      if (!savedRut || inputRut !== savedRut) {
        return NextResponse.json(
          { error: "El RUT ingresado no coincide con el registrado para esta cuenta." },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "RUT verificado correctamente.",
        nextStep: 3,
      });
    }

    // PASO 3: Verificar Nombre
    if (action === "verify_name") {
      const inputRut = cleanRut(rut);
      const savedRut = cleanRut(profile.rut);
      if (inputRut !== savedRut) {
        return NextResponse.json({ error: "RUT no coincide." }, { status: 400 });
      }

      const inputName = cleanName(name);
      const savedName = cleanName(profile.name);

      const isMatch =
        inputName === savedName ||
        (inputName.length >= 3 && savedName.includes(inputName)) ||
        (savedName.length >= 3 && inputName.includes(savedName));

      if (!savedName || !isMatch) {
        return NextResponse.json(
          { error: "El nombre ingresado no coincide con el registrado en tu cuenta." },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Identidad validada con éxito. Ya puedes definir tu nueva clave.",
        nextStep: 4,
      });
    }

    // PASO 4: Cambiar Contraseña directamente
    if (action === "reset_password") {
      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json(
          { error: "La nueva contraseña debe tener al menos 6 caracteres." },
          { status: 400 }
        );
      }

      // Validar nuevamente RUT y Nombre por seguridad estricta
      const inputRut = cleanRut(rut);
      const savedRut = cleanRut(profile.rut);
      if (inputRut !== savedRut) {
        return NextResponse.json({ error: "RUT no coincide." }, { status: 400 });
      }

      const inputName = cleanName(name);
      const savedName = cleanName(profile.name);
      const isMatch =
        inputName === savedName ||
        (inputName.length >= 3 && savedName.includes(inputName)) ||
        (savedName.length >= 3 && inputName.includes(savedName));

      if (!isMatch) {
        return NextResponse.json({ error: "Nombre no coincide." }, { status: 400 });
      }

      // Actualizar la contraseña en Supabase Auth directamente usando Admin API
      const { error: updateError } = await sbAdmin.auth.admin.updateUserById(profile.id, {
        password: newPassword,
      });

      if (updateError) {
        console.error("Error actualizando contraseña:", updateError);
        return NextResponse.json(
          { error: updateError.message || "No se pudo actualizar la contraseña." },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "¡Contraseña actualizada exitosamente! Ya puedes iniciar sesión.",
      });
    }

    return NextResponse.json({ error: "Acción no válida." }, { status: 400 });
  } catch (err: any) {
    console.error("Error en /api/auth/recover-identity:", err);
    return NextResponse.json(
      { error: err?.message || "Error al procesar la solicitud." },
      { status: 500 }
    );
  }
}
