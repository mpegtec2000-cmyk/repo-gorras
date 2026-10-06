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

    // Hardcoded admin validation
    if (username === "Admin" && password === "Admin123") {
      try {
        // Set secure cookie for admin session
        document.cookie = `spm_session=admin; path=/; max-age=86400`;
        router.push("/admin");
      } catch (e) {
        setError("Error de sesión local");
      }
    } else {
      setError("Usuario o contraseña incorrectos");
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
          <label>Usuario</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Admin"
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
