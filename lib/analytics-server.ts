import { getServiceSupabase } from "@/lib/supabase";
import { getProducts } from "@/lib/catalog";
import { getOrders } from "@/lib/orders";

export interface RealAnalyticsMetrics {
  siteVisits: number;
  uniqueVisitors: number;
  activeUsersNow: number;
  productViews: number;
  cartAdds: number;
  purchases: number;
  totalRevenue: number;
  currentStock: number;
  initialStock: number;
  topProduct: {
    id: string;
    name: string;
    brand: string;
    clicks: number;
    price: number;
  } | null;
  rankedProducts: Array<{
    id: string;
    name: string;
    brand: string;
    price: number;
    stock: number;
    images?: any[];
    clicks: number;
    addedToCart: number;
    sold: number;
    conversionRate: string;
  }>;
}

export async function getRealAnalytics(): Promise<RealAnalyticsMetrics> {
  const sb = getServiceSupabase();
  const products = await getProducts();

  // 1. Obtener eventos de analytics_events
  const { data: events } = await sb
    .from("analytics_events")
    .select("id, event_type, product_id, metadata, created_at");

  const allEvents = events || [];

  // 2. Visitas totales reales al sitio (page_view)
  const siteVisits = allEvents.filter((e) => e.event_type === "page_view").length;

  // 3. Visitantes únicos reales
  const uniqueVisitorIds = new Set<string>();
  allEvents.forEach((e) => {
    const vid = e.metadata?.visitorId || e.metadata?.ip;
    if (vid) uniqueVisitorIds.add(vid);
  });
  const uniqueVisitors = uniqueVisitorIds.size;

  // 4. Usuarios activos ahora (eventos en los últimos 5 minutos)
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  const activeVisitorIds = new Set<string>();
  allEvents
    .filter((e) => e.created_at >= fiveMinutesAgo)
    .forEach((e) => {
      const vid = e.metadata?.visitorId || e.metadata?.ip;
      if (vid) activeVisitorIds.add(vid);
    });
  const activeUsersNow = activeVisitorIds.size;

  // 5. Total de vistas a fichas de productos
  const productViews = allEvents.filter(
    (e) => e.event_type === "product_view" || e.event_type === "click"
  ).length;

  // 6. Total de agregados a la bolsa (cart_add)
  const cartAdds = allEvents.filter((e) => e.event_type === "cart_add").length;

  // 7. Clics y agregados por producto
  const productStatsMap: Record<string, { clicks: number; cartAdds: number }> = {};
  allEvents.forEach((e) => {
    if (!e.product_id) return;
    if (!productStatsMap[e.product_id]) {
      productStatsMap[e.product_id] = { clicks: 0, cartAdds: 0 };
    }
    if (e.event_type === "product_view" || e.event_type === "click") {
      productStatsMap[e.product_id].clicks += 1;
    } else if (e.event_type === "cart_add") {
      productStatsMap[e.product_id].cartAdds += 1;
    }
  });

  // 8. Órdenes y ventas reales perfectamente sincronizadas con Ventas y Órdenes
  const allOrders = await getOrders();
  const validOrders = allOrders.filter((o) => {
    const s = String(o.status || "").toLowerCase().trim();
    return s === "pagado" || s === "paid" || s === "preparando pedido" || s === "pedido entregado" || s === "confirmed" || s === "completed";
  });
  const totalSoldUnits = products.reduce((acc, p) => acc + (p.sold || 0), 0);
  const totalRevenue = validOrders.reduce((acc: number, o) => acc + (Number(o.total) || 0), 0);

  // 9. Construir el ranking de productos con datos 100% reales
  const rankedProducts = products
    .map((p) => {
      const stats = productStatsMap[p.id] || { clicks: 0, cartAdds: 0 };
      const realClicks = Math.max(p.clicks || 0, stats.clicks);
      const realCartAdds = stats.cartAdds;
      const realSold = p.sold || 0;
      const conversionRate = realClicks > 0 ? ((realSold / realClicks) * 100).toFixed(1) : "0.0";

      return {
        id: p.id,
        name: p.name,
        brand: p.brand,
        price: p.price,
        stock: p.stock,
        images: p.images,
        clicks: realClicks,
        addedToCart: realCartAdds,
        sold: realSold,
        conversionRate,
      };
    })
    .sort((a, b) => b.clicks - a.clicks || b.addedToCart - a.addedToCart || b.sold - a.sold);

  const hasAnyClicks = rankedProducts.some((p) => p.clicks > 0);
  const topProduct = hasAnyClicks ? rankedProducts[0] : null;

  return {
    siteVisits,
    uniqueVisitors,
    activeUsersNow,
    productViews,
    cartAdds,
    purchases: validOrders.length > 0 ? validOrders.length : totalSoldUnits,
    totalRevenue,
    currentStock: products.reduce((acc, p) => acc + p.stock, 0),
    initialStock: products.reduce((acc, p) => acc + p.initialStock, 0),
    topProduct,
    rankedProducts,
  };
}
