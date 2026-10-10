"use client";

import React, { useState } from "react";
import { LogIn, UserPlus, Mail, ArrowLeft, ShieldCheck, CheckCircle2, User, KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import styles from "./login.module.css";

export default function ClientLogin({ onBack }: { onBack: () => void }) {
  const router = useRouter();

  type AuthMode = "login" | "register" | "recover";
  const [mode, setMode] = useState<AuthMode>("login");

  // Estados generales
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Estados para Login / Registro
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [rut, setRut] = useState("");
  const [phone, setPhone] = useState("");

  // Estados para Recuperación por Identidad en 4 pasos
  const [recoverStep, setRecoverStep] = useState<1 | 2 | 3 | 4>(1);
  const [recoverEmail, setRecoverEmail] = useState("");
  const [recoverRut, setRecoverRut] = useState("");
  const [recoverName, setRecoverName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const resetRecovery = () => {
    setRecoverStep(1);
    setRecoverEmail("");
    setRecoverRut("");
    setRecoverName("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccessMsg("");
  };

  // 1. Manejo de Login y Registro
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
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

        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

        if (loginError) {
          console.warn("Aviso en login post-registro:", loginError);
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

  // 2. Manejo de Pasos de Recuperación por Identidad
  const handleRecoverStepSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // PASO 1: Verificar Correo
      if (recoverStep === 1) {
        const res = await fetch("/api/auth/recover-identity", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "verify_email",
            email: recoverEmail.trim().toLowerCase(),
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Correo no encontrado.");

        setRecoverStep(2);
      } 
      // PASO 2: Verificar RUT
      else if (recoverStep === 2) {
        const res = await fetch("/api/auth/recover-identity", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "verify_rut",
            email: recoverEmail.trim().toLowerCase(),
            rut: recoverRut.trim(),
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "RUT no coincide.");

        setRecoverStep(3);
      } 
      // PASO 3: Verificar Nombre
      else if (recoverStep === 3) {
        const res = await fetch("/api/auth/recover-identity", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "verify_name",
            email: recoverEmail.trim().toLowerCase(),
            rut: recoverRut.trim(),
            name: recoverName.trim(),
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Nombre no coincide.");

        setRecoverStep(4);
      } 
      // PASO 4: Cambiar Contraseña Directamente en la Web
      else if (recoverStep === 4) {
        if (newPassword.length < 6) {
          throw new Error("La nueva contraseña debe tener al menos 6 caracteres.");
        }
        if (newPassword !== confirmPassword) {
          throw new Error("Las contraseñas no coinciden. Por favor revísalas.");
        }

        const res = await fetch("/api/auth/recover-identity", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "reset_password",
            email: recoverEmail.trim().toLowerCase(),
            rut: recoverRut.trim(),
            name: recoverName.trim(),
            newPassword,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Error al actualizar contraseña.");

        setSuccessMsg("¡Identidad verificada! Tu contraseña ha sido cambiada con éxito.");

        // Iniciar sesión automáticamente con la nueva clave
        const { error: loginErr } = await supabase.auth.signInWithPassword({
          email: recoverEmail.trim().toLowerCase(),
          password: newPassword,
        });

        if (!loginErr) {
          document.cookie = `spm_session=customer; path=/; max-age=86400`;
          setTimeout(() => {
            router.push("/tienda");
          }, 1500);
        } else {
          // Si por alguna razón no loguea automático, volver al login
          setTimeout(() => {
            setMode("login");
            setEmail(recoverEmail);
            resetRecovery();
          }, 2000);
        }
      }
    } catch (err: any) {
      setError(err.message || "Error al validar la información.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.card} ${styles.expandedCard}`}>
      <span className={styles.roleTag}>TIENDA & CLIENTE</span>

      {/* SECCIÓN RECUPERACIÓN DIRECTA POR IDENTIDAD */}
      {mode === "recover" ? (
        <div>
          <h2 className={styles.cardTitle}>RECUPERAR CONTRASEÑA</h2>
          <p className={styles.cardDesc}>
            Valida tus datos registrados para cambiar tu contraseña directamente desde esta pantalla.
          </p>

          {/* INDICADOR DE PASOS */}
          <div style={{ display: "flex", gap: "0.4rem", margin: "1rem 0 1.5rem" }}>
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                style={{
                  flex: 1,
                  height: "4px",
                  borderRadius: "9999px",
                  backgroundColor: step <= recoverStep ? "#ffffff" : "rgba(255, 255, 255, 0.15)",
                  transition: "background-color 0.3s ease",
                }}
              />
            ))}
          </div>

          <form onSubmit={handleRecoverStepSubmit} className={styles.loginForm}>
            {/* PASO 1: CORREO */}
            {recoverStep === 1 && (
              <div className={styles.formGroup}>
                <label style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Paso 1 de 4: Correo Electrónico</span>
                </label>
                <input
                  type="email"
                  value={recoverEmail}
                  onChange={(e) => setRecoverEmail(e.target.value)}
                  required
                  placeholder="ejemplo@correo.cl"
                  className={styles.input}
                  autoFocus
                />
              </div>
            )}

            {/* PASO 2: RUT */}
            {recoverStep === 2 && (
              <div className={styles.formGroup}>
                <label style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Paso 2 de 4: RUT Registrado</span>
                </label>
                <input
                  type="text"
                  value={recoverRut}
                  onChange={(e) => setRecoverRut(e.target.value)}
                  required
                  placeholder="12.345.678-9"
                  className={styles.input}
                  autoFocus
                />
                <p style={{ margin: "0.35rem 0 0", fontSize: "0.76rem", color: "#94a3b8" }}>
                  Ingresa el mismo RUT asociado a {recoverEmail}.
                </p>
              </div>
            )}

            {/* PASO 3: NOMBRE */}
            {recoverStep === 3 && (
              <div className={styles.formGroup}>
                <label style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Paso 3 de 4: Nombre Completo</span>
                </label>
                <input
                  type="text"
                  value={recoverName}
                  onChange={(e) => setRecoverName(e.target.value)}
                  required
                  placeholder="Tu nombre y apellido"
                  className={styles.input}
                  autoFocus
                />
                <p style={{ margin: "0.35rem 0 0", fontSize: "0.76rem", color: "#94a3b8" }}>
                  Ingresa el nombre con el que creaste tu cuenta.
                </p>
              </div>
            )}

            {/* PASO 4: NUEVA CLAVE */}
            {recoverStep === 4 && (
              <>
                <div style={{ backgroundColor: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "8px", padding: "0.75rem", marginBottom: "1rem", textAlign: "center" }}>
                  <p style={{ margin: 0, color: "#6ee7b7", fontSize: "0.82rem", fontWeight: 700 }}>
                    ✓ Identidad confirmada para {recoverName} ({recoverEmail})
                  </p>
                </div>

                <div className={styles.formGroup}>
                  <label>Paso 4 de 4: Nueva Contraseña</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Mínimo 6 caracteres"
                    className={styles.input}
                    autoFocus
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Confirmar Nueva Contraseña</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Repite tu nueva contraseña"
                    className={styles.input}
                  />
                </div>
              </>
            )}

            {error && <div className={styles.errorAlert}>{error}</div>}
            {successMsg && <div className={styles.successAlert}>{successMsg}</div>}

            <button
              type="submit"
              disabled={loading}
              className={`${styles.btn} ${styles.btnOutline}`}
              style={{ width: "100%", marginTop: "0.5rem" }}
            >
              <span>
                {loading
                  ? "VERIFICANDO..."
                  : recoverStep === 1
                  ? "VERIFICAR CORREO →"
                  : recoverStep === 2
                  ? "VERIFICAR RUT →"
                  : recoverStep === 3
                  ? "VERIFICAR NOMBRE →"
                  : "GUARDAR NUEVA CONTRASEÑA E INGRESAR"}
              </span>
              {recoverStep === 4 ? <ShieldCheck size={18} /> : <ArrowLeft size={18} style={{ transform: "rotate(180deg)" }} />}
            </button>
          </form>

          <div style={{ marginTop: "1.25rem", textAlign: "center" }}>
            <button
              onClick={() => {
                setMode("login");
                resetRecovery();
              }}
              type="button"
              className={styles.toggleAuthBtn}
            >
              ← Cancelar y volver al inicio de sesión
            </button>
          </div>
        </div>
      ) : (
        /* SECCIÓN LOGIN / REGISTRO NORMAL */
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
                    onClick={() => {
                      setMode("recover");
                      setRecoverEmail(email);
                      setError("");
                    }}
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
