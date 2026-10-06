import { Product } from "./products";
import catalogData from "./catalog-data.json";

export type OrderStatus = "Pagado" | "Preparando Pedido" | "Pedido Entregado";

export interface OrderItem {
  productId: string;
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
  status: OrderStatus;
  items: OrderItem[];
  total: number;
}

// Generate some mock orders based on actual catalog
const generateMockOrders = (): Order[] => {
  const products = catalogData as Product[];
  const orders: Order[] = [];
  
  // Nombres y RUTs chilenos aleatorios
  const names = ["Juan Pérez", "María González", "Carlos Soto", "Ana Rojas", "Pedro Silva", "Camila Morales", "Diego Castillo", "Valentina Torres"];
  const ruts = ["19.234.567-8", "18.345.678-9", "20.456.789-0", "15.567.890-1", "17.678.901-2", "21.789.012-3", "16.890.123-4", "19.901.234-5"];
  
  const today = new Date();
  
  // Crear 30 órdenes simuladas en los últimos 30 días
  for (let i = 1; i <= 30; i++) {
    const isRecent = i <= 5; // 5 orders in the last few days
    const dateOffset = isRecent ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 30);
    const orderDate = new Date(today);
    orderDate.setDate(today.getDate() - dateOffset);
    
    // 1 to 3 items per order
    const numItems = Math.floor(Math.random() * 3) + 1;
    const items: OrderItem[] = [];
    let total = 0;
    
    for (let j = 0; j < numItems; j++) {
      const p = products[Math.floor(Math.random() * products.length)];
      items.push({
        productId: p.id,
        quantity: 1,
        price: p.price
      });
      total += p.price;
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
      clientEmail: `${names[i % names.length].split(' ')[0].toLowerCase()}@gmail.com`,
      clientPhone: "+56 9 8765 4321",
      clientAddress: "Av. Providencia 1234, Depto 45, Providencia, RM",
      status,
      items,
      total
    });
  }
  
  // Sort descending by date
  return orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

let mockOrders = generateMockOrders();

export async function getOrders(): Promise<Order[]> {
  return mockOrders;
}

export async function updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<void> {
  mockOrders = mockOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
}
