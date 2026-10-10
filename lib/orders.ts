import fs from "fs/promises";
import path from "path";
import { Product } from "./products";
import catalogData from "./catalog-data.json";
import { getServiceSupabase } from "./supabase";

export type OrderStatus = "Pendiente de Pago" | "Pagado" | "Preparando Pedido" | "Pedido Entregado" | "Rechazado";

export interface OrderItem {
  productId: string;
  name?: string;
  brand?: string;
  image?: string;
  size?: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  clientName: string;
  clientRut: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  clientCity?: string;
  clientRegion?: string;
  shippingMethod?: string;
  shippingCost?: number;
  status: OrderStatus;
  items: OrderItem[];
  subtotal?: number;
  total: number;
  flowOrder?: number;
  flowToken?: string;
  paymentMethod?: string;
  paidAt?: string;
  paymentMedia?: string;
}

const ORDERS_FILE_PATH = path.join(process.cwd(), "data", "orders.json");

function mapOrderToDb(o: Order): Record<string, any> {
  return {
    id: o.id,
    order_number: o.orderNumber,
    date: o.date,
    client_name: o.clientName,
    client_rut: o.clientRut,
    client_email: o.clientEmail,
    client_phone: o.clientPhone || "",
    client_address: o.clientAddress || "",
    client_city: o.clientCity || "Santiago Centro",
    client_region: o.clientRegion || "RM",
    shipping_method: o.shippingMethod || "Envío Express",
    shipping_cost: Number(o.shippingCost) || 0,
    status: o.status,
    items: o.items || [],
    subtotal: Number(o.subtotal) || 0,
    total: Number(o.total) || 0,
    flow_order: o.flowOrder || null,
    flow_token: o.flowToken || null,
    payment_method: o.paymentMethod || "Webpay Plus / Flow",
    paid_at: o.paidAt || null,
    payment_media: o.paymentMedia || null,
    created_at: o.date || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

function mapOrderFromDb(row: any): Order {
  return {
    id: row.id,
    orderNumber: row.order_number || row.orderNumber,
    date: row.date || row.created_at,
    clientName: row.client_name || row.clientName,
    clientRut: row.client_rut || row.clientRut,
    clientEmail: row.client_email || row.clientEmail,
    clientPhone: row.client_phone || row.clientPhone || "",
    clientAddress: row.client_address || row.clientAddress || "",
    clientCity: row.client_city || row.clientCity,
    clientRegion: row.client_region || row.clientRegion,
    shippingMethod: row.shipping_method || row.shippingMethod,
    shippingCost: Number(row.shipping_cost ?? row.shippingCost ?? 0),
    status: row.status as OrderStatus,
    items: row.items || [],
    subtotal: Number(row.subtotal ?? 0),
    total: Number(row.total ?? 0),
    flowOrder: row.flow_order ? Number(row.flow_order) : undefined,
    flowToken: row.flow_token || undefined,
    paymentMethod: row.payment_method || row.paymentMethod,
    paidAt: row.paid_at || undefined,
    paymentMedia: row.payment_media || undefined,
  };
}

// Generador de órdenes de base
const generateInitialOrders = (): Order[] => {
  const products = catalogData as Product[];
  const orders: Order[] = [];
  const names = ["Juan Pérez", "María González", "Carlos Soto", "Ana Rojas", "Pedro Silva", "Camila Morales", "Diego Castillo", "Valentina Torres"];
  const ruts = ["19.234.567-8", "18.345.678-9", "20.456.789-0", "15.567.890-1", "17.678.901-2", "21.789.012-3", "16.890.123-4", "19.901.234-5"];
  const today = new Date();

  for (let i = 1; i <= 25; i++) {
    const isRecent = i <= 4;
    const dateOffset = isRecent ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 25);
    const orderDate = new Date(today);
    orderDate.setDate(today.getDate() - dateOffset);

    const numItems = Math.floor(Math.random() * 2) + 1;
    const items: OrderItem[] = [];
    let subtotal = 0;

    for (let j = 0; j < numItems; j++) {
      const p = products[Math.floor(Math.random() * products.length)];
      items.push({
        productId: p.id,
        name: p.name,
        brand: p.brand,
        image: p.images?.[0]?.src || "/brand/placeholder.png",
        size: "Única · Ajustable",
        quantity: 1,
        price: p.price,
      });
      subtotal += p.price;
    }

    let status: OrderStatus = "Pedido Entregado";
    if (isRecent) {
      status = Math.random() > 0.5 ? "Preparando Pedido" : "Pagado";
    }

    orders.push({
      id: `ord_${1000 + i}`,
      orderNumber: `#SPM-${1000 + i}`,
      date: orderDate.toISOString(),
      clientName: names[i % names.length],
      clientRut: ruts[i % ruts.length],
      clientEmail: `${names[i % names.length].split(" ")[0].toLowerCase()}@gmail.com`,
      clientPhone: "+56 9 8765 4321",
      clientAddress: "Av. Providencia 1234, Depto 45",
      clientCity: "Providencia",
      clientRegion: "Región Metropolitana",
      shippingMethod: "Envío Express Starken / Blue Express",
      shippingCost: 0,
      status,
      items,
      subtotal,
      total: subtotal,
      paymentMethod: "Webpay Plus / Flow",
      paidAt: orderDate.toISOString(),
      paymentMedia: "Webpay Débito",
    });
  }

  return orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

let cachedOrders: Order[] | null = null;

export async function getOrders(): Promise<Order[]> {
  // 1. Intentar leer desde Supabase
  try {
    const sb = getServiceSupabase();
    const { data, error } = await sb.from("orders").select("*").order("date", { ascending: false });
    if (!error && Array.isArray(data)) {
      cachedOrders = data.map(mapOrderFromDb);
      return cachedOrders;
    }
  } catch (e) {
    console.warn("Aviso: Supabase orders no disponible, usando fallback local:", e);
  }

  // 2. Fallback a archivo local
  try {
    const raw = await fs.readFile(ORDERS_FILE_PATH, "utf-8");
    cachedOrders = JSON.parse(raw);
    return cachedOrders!;
  } catch {
    cachedOrders = [];
    return [];
  }
}

export async function getOrder(idOrNumber: string): Promise<Order | null> {
  const orders = await getOrders();
  return orders.find((o) => o.id === idOrNumber || o.orderNumber === idOrNumber || o.flowToken === idOrNumber) || null;
}

export async function saveOrder(order: Order): Promise<Order> {
  const orders = await getOrders();
  const existingIdx = orders.findIndex((o) => o.id === order.id);

  if (existingIdx >= 0) {
    orders[existingIdx] = { ...orders[existingIdx], ...order };
  } else {
    orders.unshift(order);
  }

  cachedOrders = orders;
  await fs.mkdir(path.dirname(ORDERS_FILE_PATH), { recursive: true }).catch(() => {});
  await fs.writeFile(ORDERS_FILE_PATH, JSON.stringify(orders, null, 2), "utf-8").catch(() => {});

  // Guardar en Supabase
  try {
    const sb = getServiceSupabase();
    const { error } = await sb.from("orders").upsert(mapOrderToDb(order));
    if (error) {
      console.error("[Supabase] Error al guardar orden:", error);
    } else {
      console.log(`[Supabase] Orden ${order.orderNumber} guardada exitosamente.`);
    }
  } catch (err) {
    console.error("[Supabase] Excepción al guardar orden:", err);
  }

  return order;
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  extraData?: Partial<Order>
): Promise<Order | null> {
  const orders = await getOrders();
  const orderIdx = orders.findIndex((o) => o.id === orderId);
  if (orderIdx === -1) return null;

  orders[orderIdx] = {
    ...orders[orderIdx],
    status: newStatus,
    ...(extraData || {}),
  };

  cachedOrders = orders;
  await fs.mkdir(path.dirname(ORDERS_FILE_PATH), { recursive: true }).catch(() => {});
  await fs.writeFile(ORDERS_FILE_PATH, JSON.stringify(orders, null, 2), "utf-8").catch(() => {});

  // Actualizar en Supabase
  try {
    const sb = getServiceSupabase();
    const { error } = await sb.from("orders").upsert(mapOrderToDb(orders[orderIdx]));
    if (error) {
      console.error("[Supabase] Error al actualizar estado de orden:", error);
    } else {
      console.log(`[Supabase] Orden ${orders[orderIdx].orderNumber} actualizada a estado: ${newStatus}`);
    }
  } catch (err) {
    console.error("[Supabase] Excepción al actualizar estado de orden:", err);
  }

  return orders[orderIdx];
}
