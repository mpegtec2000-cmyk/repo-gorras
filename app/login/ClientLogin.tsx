"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, ShoppingBag, CheckCircle2, LogIn, UserPlus, KeyRound, Mail, ArrowLeft, ShieldCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import styles from "./login.module.css";

export default function ClientLogin({ onBack }: { onBack: () => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  type AuthMode = "login" | "register" | "forgot" | "forgot_success" | "reset_password";
  const [mode, setMode] = useState<AuthMode>("login");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [rut, setRut] = useState("");
  const [phone, setPhone] = useState("");

  // States for resetting password
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    // Detectar si el usuario viene de un enlace de recuperación de contraseña
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === "PASSWORD_RECOVERY") {
        setMode("reset_password");
        setError("");
      }
    });

    if (typeof window !== "undefined") {
      const hash = window.location.hash || "";
      const isResetParam = searchParams.get("type") === "reset";
      if (hash.includes("type=recovery") || isResetParam) {
        setMode("reset_password");
      }
    }

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [searchParams]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        // Registro directo pre-confirmado en el servidor (sin pedir confirmación de correo)
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
            name: name.trim(),
            rut: rut.trim(),
            phone: phone.trim(),
          }),
        });

        const resData = await res.json();
        if (!res.ok) {
          throw new Error(resData.error || "Error al crear la cuenta.");
        }

        // Iniciar sesión inmediatamente
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

        if (loginError) {
          console.warn("Aviso en inicio de sesión post-registro:", loginError);
        }

        const customerInfo = {
          name: name.trim(),
          rut: rut.trim(),
          phone: phone.trim(),
          email: email.trim().toLowerCase(),
        };
        localStorage.setItem("spm_customer_info", JSON.stringify(customerInfo));
        document.cookie = `spm_session=customer; path=/; max-age=86400`;
        router.push("/tienda");
      } else {
        // Sign In
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

        if (error) throw error;

        const meta = data.user?.user_metadata || {};
        let prof: any = null;
        if (data.user?.id) {
          try {
            const { data: p } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
            prof = p;
          } catch {}
        }

        const customerInfo = {
          name: prof?.name || meta.name || "",
          rut: prof?.rut || meta.rut || "",
          phone: prof?.phone || meta.phone || "",
          email: data.user?.email || email.trim().toLowerCase(),
          region: prof?.region || "RM",
          city: prof?.city || "Santiago Centro",
          address: prof?.address || "",
          apartment: prof?.apartment || "",
        };
        localStorage.setItem("spm_customer_info", JSON.stringify(customerInfo));
        document.cookie = `spm_session=customer; path=/; max-age=86400`;
        router.push("/tienda");
      }
    } catch (err: any) {
      console.error("Error de autenticación:", err);
      setError(err.message || "Error al procesar la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Por favor ingresa tu correo electrónico.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "https://www.spm-store.cl";
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${origin}/login?type=reset`,
      });

      if (error) throw error;

      setMode("forgot_success");
      setSuccessMsg(`Hemos enviado un correo de recuperación a ${email.trim()}. Revisa tu bandeja de entrada o spam.`);
    } catch (err: any) {
      setError(err.message || "Error al enviar el correo de recuperación.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden. Por favor verifícalas.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setSuccessMsg("¡Contraseña actualizada con éxito! Accediendo a tu cuenta...");
      document.cookie = `spm_session=customer; path=/; max-age=86400`;
      setTimeout(() => {
        router.push("/tienda");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Error al actualizar la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.card} ${styles.expandedCard}`}>
      <span className={styles.roleTag}>TIENDA & CLIENTE</span>

      {/* CASO 1: RECUPERACIÓN ENVIADA */}
      {mode === "forgot_success" && (
        <div>
          <h2 className={styles.cardTitle}>CORREO ENVIADO</h2>
          <div className={styles.successAlert} style={{ margin: "1.5rem 0" }}>
            <CheckCircle2 size={32} color="#10b981" style={{ margin: "0 auto 0.75rem", display: "block" }} />
            <p style={{ margin: 0, fontWeight: 700, fontSize: "1rem" }}>¡Revisa tu bandeja de entrada!</p>
            <p style={{ margin: "0.5rem 0 0", color: "#d1fae5", fontSize: "0.85rem" }}>
              {successMsg}
            </p>
          </div>
          <button
            type="button"
            onClick={() => { setMode("login"); setError(""); setSuccessMsg(""); }}
            className={`${styles.btn} ${styles.btnOutline}`}
            style={{ width: "100%" }}
          >
            <ArrowLeft size={16} />
            <span>VOLVER A INICIAR SESIÓN</span>
          </button>
        </div>
      )}

      {/* CASO 2: FORMULARIO OLVIDÉ MI CONTRASEÑA */}
      {mode === "forgot" && (
        <div>
          <h2 className={styles.cardTitle}>RECUPERAR CONTRASEÑA</h2>
          <p className={styles.cardDesc}>
            Ingresa tu correo registrado y te enviaremos el enlace oficial con el diseño exclusivo de SPM Store para definir una nueva clave.
          </p>

          <form onSubmit={handleForgotPassword} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label>Correo Electrónico Registrado</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@correo.cl"
                className={styles.input}
              />
            </div>

            {error && <div className={styles.errorAlert}>{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className={`${styles.btn} ${styles.btnOutline}`}
              style={{ width: "100%", marginTop: "0.5rem" }}
            >
              <span>{loading ? "ENVIANDO CORREO..." : "ENVIAR ENLACE DE RECUPERACIÓN"}</span>
              <Mail size={18} />
            </button>
          </form>

          <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
            <button
              onClick={() => { setMode("login"); setError(""); }}
              type="button"
              className={styles.toggleAuthBtn}
            >
              ← Volver al inicio de sesión
            </button>
          </div>
        </div>
      )}

      {/* CASO 3: FORMULARIO DEFINIR NUEVA CONTRASEÑA */}
      {mode === "reset_password" && (
        <div>
          <h2 className={styles.cardTitle}>NUEVA CONTRASEÑA</h2>
          <p className={styles.cardDesc}>
            Ingresa y confirma tu nueva contraseña de acceso seguro a SPM Store.
          </p>

          <form onSubmit={handleUpdatePassword} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label>Nueva Contraseña</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Mínimo 6 caracteres"
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Confirmar Nueva Contraseña</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Repite tu contraseña"
                className={styles.input}
              />
            </div>

            {error && <div className={styles.errorAlert}>{error}</div>}
            {successMsg && <div className={styles.successAlert}>{successMsg}</div>}

            <button
              type="submit"
              disabled={loading}
              className={`${styles.btn} ${styles.btnOutline}`}
              style={{ width: "100%", marginTop: "0.5rem" }}
            >
              <span>{loading ? "ACTUALIZANDO..." : "GUARDAR NUEVA CONTRASEÑA"}</span>
              <ShieldCheck size={18} />
            </button>
          </form>
        </div>
      )}

      {/* CASO 4: LOGIN / REGISTRO NORMAL */}
      {(mode === "login" || mode === "register") && (
        <div>
          <h2 className={styles.cardTitle}>{mode === "register" ? "CREAR CUENTA" : "ACCESO CLIENTE"}</h2>
          <p className={styles.cardDesc}>
            {mode === "register"
              ? "Regístrate para comprar los mejores drops exclusivos de SPM Streetwear."
              : "Inicia sesión para revisar tus compras y acceder a la tienda exclusiva."}
          </p>

          <form onSubmit={handleAuth} className={styles.loginForm}>
            {mode === "register" && (
              <>
                <div className={styles.formGroup}>
                  <label>Nombre Completo</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className={styles.input}
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>RUT</label>
                    <input
                      type="text"
                      value={rut}
                      onChange={(e) => setRut(e.target.value)}
                      placeholder="12.345.678-9"
                      required
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Teléfono</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+56 9..."
                      required
                      className={styles.input}
                    />
                  </div>
                </div>
              </>
            )}

            <div className={styles.formGroup}>
              <label>Correo Electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.input}
              />
            </div>
            
            <div className={styles.formGroup}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label style={{ margin: 0 }}>Contraseña</label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => { setMode("forgot"); setError(""); setSuccessMsg(""); }}
                    className={styles.forgotBtn}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                )}
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.input}
              />
            </div>

            {error && <div className={styles.errorAlert}>{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className={`${styles.btn} ${styles.btnOutline}`}
              style={{ width: "100%", marginTop: "0.5rem" }}
            >
              <span>{loading ? "PROCESANDO..." : mode === "register" ? "CREAR CUENTA" : "INGRESAR"}</span>
              {mode === "register" ? <UserPlus size={18} /> : <LogIn size={18} />}
            </button>
          </form>

          <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
            <button
              onClick={() => {
                setMode(mode === "register" ? "login" : "register");
                setError("");
              }}
              type="button"
              className={styles.toggleAuthBtn}
            >
              {mode === "register"
                ? "¿Ya tienes una cuenta? Inicia sesión aquí"
                : "¿No tienes cuenta? Regístrate aquí"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
