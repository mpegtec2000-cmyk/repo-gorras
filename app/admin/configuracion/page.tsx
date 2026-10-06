import React from "react";
import { Database, ShieldAlert, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Configuración BD | SaaS Admin",
};

export default function ConfigPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "800px" }}>
      <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>Configuración de Base de Datos</h2>
      
      <div style={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
          <Database size={24} color="#3b82f6" />
          <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Estado de Conexión: Supabase</h3>
        </div>
        
        <p style={{ color: "#6b7280", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
          Actualmente el sistema está configurado para operar con datos locales mientras se realiza la migración definitiva a Supabase.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#10b981", fontSize: "0.9rem" }}>
            <CheckCircle2 size={18} />
            URL de Proyecto (project ref): uscjvmwknetmwwnxhtux configurada correctamente.
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#f59e0b", fontSize: "0.9rem" }}>
            <ShieldAlert size={18} />
            Esperando ejecución de migración SQL para habilitar tablas remotas.
          </div>
        </div>
      </div>
    </div>
  );
}
