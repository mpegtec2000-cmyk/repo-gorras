"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    // No registrar rutas administrativas ni APIs
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/api")) {
      return;
    }

    // Evitar duplicados seguidos del mismo path
    if (lastTrackedPath.current === pathname) {
      return;
    }
    lastTrackedPath.current = pathname;

    // Obtener o crear visitorId único persistente
    let visitorId = "";
    try {
      visitorId = localStorage.getItem("spm_vid") || "";
      if (!visitorId) {
        visitorId = "vid_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();
        localStorage.setItem("spm_vid", visitorId);
      }
    } catch {}

    const track = () => {
      try {
        fetch("/api/analytics/event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventType: "page_view",
            url: pathname,
            visitorId,
            metadata: {
              referrer: typeof document !== "undefined" ? document.referrer : "",
              title: typeof document !== "undefined" ? document.title : "",
            },
          }),
        }).catch(() => {});
      } catch {}
    };

    track();

    // Heartbeat cada 2 minutos si el usuario sigue en la página para medir usuarios activos reales
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        try {
          fetch("/api/analytics/event", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              eventType: "heartbeat",
              url: pathname,
              visitorId,
            }),
          }).catch(() => {});
        } catch {}
      }
    }, 120000);

    return () => clearInterval(interval);
  }, [pathname]);

  return null;
}
