/**
 * Sistema de Analítica y Flujo de Tráfico SPM SaaS
 * Registra visitas a páginas, clics en productos y eventos del carrito.
 */

export interface ProductAnalytics {
  id: string;
  name: string;
  brand: string;
  views: number;
  cartAdds: number;
  purchases: number;
  conversionRate: number;
}

export interface TrafficStats {
  totalVisits: number;
  uniqueVisitors: number;
  activeUsersNow: number;
  avgDuration: string;
  bounceRate: string;
  topProduct: {
    id: string;
    name: string;
    brand: string;
    views: number;
  };
  funnel: {
    siteVisits: number;
    productViews: number;
    cartAdds: number;
    checkouts: number;
    purchases: number;
  };
  sources: { source: string; percentage: number; visits: number }[];
  dailyVisits: { day: string; visits: number; pageviews: number }[];
}

const ANALYTICS_STORAGE_KEY = "spm_analytics_data";

export const DEFAULT_ANALYTICS: TrafficStats = {
  totalVisits: 14280,
  uniqueVisitors: 4890,
  activeUsersNow: 18,
  avgDuration: "2m 45s",
  bounceRate: "34.2%",
  topProduct: {
    id: "spm-001",
    name: "Negro flores azul",
    brand: "Cash Only",
    views: 1420,
  },
  funnel: {
    siteVisits: 14280,
    productViews: 8640,
    cartAdds: 1120,
    checkouts: 380,
    purchases: 13,
  },
  sources: [
    { source: "Instagram (@spm_store.cl)", percentage: 58, visits: 8282 },
    { source: "Búsqueda Directa", percentage: 22, visits: 3141 },
    { source: "Google Organic (SEO)", percentage: 14, visits: 1999 },
    { source: "WhatsApp / Referencias", percentage: 6, visits: 858 },
  ],
  dailyVisits: [
    { day: "Lun", visits: 1840, pageviews: 4200 },
    { day: "Mar", visits: 2100, pageviews: 4900 },
    { day: "Mié", visits: 1950, pageviews: 4400 },
    { day: "Jue", visits: 2400, pageviews: 5600 },
    { day: "Vie", visits: 3100, pageviews: 7100 },
    { day: "Sáb", visits: 2890, pageviews: 6300 },
    { day: "Dom", visits: 2200, pageviews: 5100 },
  ],
};

/** Track click/view event on client */
export function trackEvent(eventType: "view" | "product_view" | "cart_add" | "purchase", productId?: string, productName?: string) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    const data: TrafficStats = raw ? JSON.parse(raw) : { ...DEFAULT_ANALYTICS };

    data.totalVisits += 1;
    if (eventType === "product_view" || eventType === "view") {
      data.funnel.productViews += 1;
    } else if (eventType === "cart_add") {
      data.funnel.cartAdds += 1;
    } else if (eventType === "purchase") {
      data.funnel.purchases += 1;
    }

    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    // Ignore
  }
}

/** Get current traffic stats */
export function getTrafficStats(): TrafficStats {
  if (typeof window === "undefined") return DEFAULT_ANALYTICS;
  try {
    const raw = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // Ignore
  }
  return DEFAULT_ANALYTICS;
}
