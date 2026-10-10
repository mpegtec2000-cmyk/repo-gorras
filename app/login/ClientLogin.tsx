"use client";

import React, { useState } from "react";
import { ArrowRight, ShoppingBag, CheckCircle2, LogIn, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import styles from "./login.module.css";

export default function ClientLogin({ onBack }: { onBack: () => void }) {
  const router = useRouter();
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [rut, setRut] = useState("");
  const [phone, setPhone] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegistering) {
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

  return (
    <div className={`${styles.card} ${styles.expandedCard}`}>


      <span className={styles.roleTag}>
        TIENDA & CLIENTE
      </span>
      <h2 className={styles.cardTitle}>{isRegistering ? "CREAR CUENTA" : "ACCESO CLIENTE"}</h2>
      <p className={styles.cardDesc}>
        {isRegistering 
          ? "Regístrate para comprar los mejores drops exclusivos de SPM Streetwear."
          : "Inicia sesión para revisar tus compras y acceder a la tienda exclusiva."
        }
      </p>

      <form onSubmit={handleAuth} className={styles.loginForm}>
        {isRegistering && (
          <>
            <div className={styles.formGroup}>
              <label>Nombre Completo</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                required={isRegistering}
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
                  required={isRegistering}
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
                  required={isRegistering}
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
          <label>Contraseña</label>
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
          <span>{loading ? "PROCESANDO..." : (isRegistering ? "CREAR CUENTA" : "INGRESAR")}</span>
          {isRegistering ? <UserPlus size={18} /> : <LogIn size={18} />}
        </button>
      </form>

      <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
        <button 
          onClick={() => setIsRegistering(!isRegistering)} 
          type="button"
          className={styles.toggleAuthBtn}
        >
          {isRegistering 
            ? "¿Ya tienes una cuenta? Inicia sesión aquí" 
            : "¿No tienes cuenta? Regístrate aquí"
          }
        </button>
      </div>
    </div>
  );
}
