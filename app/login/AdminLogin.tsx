"use client";

import React, { useState } from "react";
import { ArrowRight, LayoutDashboard, CheckCircle2, KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

export default function AdminLogin({ onBack }: { onBack: () => void }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push("/admin");
      } else {
        setError(data.error || "Usuario o contraseña incorrectos");
        setLoading(false);
      }
    } catch {
      setError("Error de conexión con el servidor de autenticación");
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.card} ${styles.cardPrimary} ${styles.expandedCard}`}>


      <h2 className={styles.cardTitle}>TRABAJADOR / ADMINISTRADOR</h2>
      <p className={styles.cardDesc}>
        Ingresa tus credenciales para administrar la plataforma SPM Streetwear.
      </p>

      <form onSubmit={handleLogin} className={styles.loginForm}>
        <div className={styles.formGroup}>
          <label>Usuario / Correo Administrador</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Soniagmichell@gmail.com"
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
            placeholder="••••••••"
            required
            className={styles.input}
          />
        </div>

        {error && <div className={styles.errorAlert}>{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className={`${styles.btn} ${styles.btnPrimary}`}
          style={{ width: "100%", marginTop: "0.5rem" }}
        >
          <span>{loading ? "VERIFICANDO..." : "INGRESAR"}</span>
          <KeyRound size={18} />
        </button>
      </form>
    </div>
  );
}
