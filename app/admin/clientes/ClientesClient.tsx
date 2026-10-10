"use client";

import React, { useState } from "react";
import { Users, Search, Mail, Phone, Calendar, MapPin, Copy, Check } from "lucide-react";
import styles from "./Clientes.module.css";

interface ClientProfile {
  id: string;
  email: string;
  name?: string;
  rut?: string;
  phone?: string;
  region?: string;
  city?: string;
  address?: string;
  created_at: string;
}

interface ClientesClientProps {
  initialClients: ClientProfile[];
}

export default function ClientesClient({ initialClients = [] }: ClientesClientProps) {
  const [clients] = useState<ClientProfile[]>(initialClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = clients.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      (c.name && c.name.toLowerCase().includes(term)) ||
      (c.email && c.email.toLowerCase().includes(term)) ||
      (c.rut && c.rut.toLowerCase().includes(term)) ||
      (c.phone && c.phone.includes(term))
    );
  });

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      const parts = name.trim().split(" ");
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return name.slice(0, 2).toUpperCase();
    }
    if (email) return email.slice(0, 2).toUpperCase();
    return "CL";
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.pageTitle}>Clientes Registrados</h1>
          <p className={styles.pageSubtitle}>
            Cuentas creadas y verificadas en SPM Store (sin confirmación requerida).
          </p>
        </div>
        <div className={styles.statBadge}>
          <Users size={16} />
          <span>Total Clientes:</span>
          <span className={styles.statNumber}>{clients.length}</span>
        </div>
      </div>

      <div className={styles.searchBar}>
        <Search size={18} color="#9ca3af" />
        <input
          type="text"
          placeholder="Buscar cliente por nombre, RUT, correo o teléfono..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.tableCard}>
        {filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <Users size={36} color="#d1d5db" style={{ marginBottom: "0.75rem" }} />
            <p style={{ margin: 0, fontWeight: 600 }}>No se encontraron clientes registrados.</p>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.82rem" }}>
              Los nuevos usuarios que se registren en la web aparecerán automáticamente aquí.
            </p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Cliente / RUT</th>
                <th className={styles.th}>Correo Electrónico</th>
                <th className={styles.th}>Teléfono</th>
                <th className={styles.th}>Ubicación</th>
                <th className={styles.th}>Fecha Registro</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className={styles.tr}>
                  <td className={styles.td}>
                    <div className={styles.userCell}>
                      <div className={styles.avatar}>
                        {getInitials(c.name, c.email)}
                      </div>
                      <div>
                        <p className={styles.userName}>{c.name || "Sin nombre registrado"}</p>
                        {c.rut && <p className={styles.userRut}>RUT: {c.rut}</p>}
                      </div>
                    </div>
                  </td>
                  <td className={styles.td}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <Mail size={14} color="#6b7280" />
                      <span>{c.email}</span>
                      <button
                        onClick={() => copyToClipboard(c.email, c.id)}
                        title="Copiar correo"
                        style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", color: "#9ca3af" }}
                      >
                        {copiedId === c.id ? <Check size={13} color="#16a34a" /> : <Copy size={13} />}
                      </button>
                    </div>
                  </td>
                  <td className={styles.td}>
                    {c.phone ? (
                      <a
                        href={`https://wa.me/${c.phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.contactLink}
                        title="Abrir WhatsApp"
                      >
                        <Phone size={14} color="#16a34a" />
                        <span>{c.phone}</span>
                      </a>
                    ) : (
                      <span style={{ color: "#9ca3af" }}>-</span>
                    )}
                  </td>
                  <td className={styles.td}>
                    {c.region || c.city ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                        <MapPin size={14} color="#6b7280" />
                        <span>{[c.city, c.region].filter(Boolean).join(", ")}</span>
                      </div>
                    ) : (
                      <span style={{ color: "#9ca3af" }}>-</span>
                    )}
                  </td>
                  <td className={styles.td}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "#6b7280", fontSize: "0.8rem" }}>
                      <Calendar size={13} />
                      <span>
                        {c.created_at
                          ? new Date(c.created_at).toLocaleDateString("es-CL", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
